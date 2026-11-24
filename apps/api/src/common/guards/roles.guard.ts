import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRoleType, AuthSessionPayload } from '@erp/types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user }: { user: AuthSessionPayload } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User authentication session required');
    }

    // MASTER_ADMIN always has administrative capability across system roles
    if (user.role === UserRoleType.MASTER_ADMIN) {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Role '${user.role}' is not authorized to access this resource. Required: [${requiredRoles.join(', ')}]`
      );
    }

    return true;
  }
}
