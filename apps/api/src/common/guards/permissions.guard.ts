import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserRoleType, AuthSessionPayload } from '@erp/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user }: { user: AuthSessionPayload } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('User authentication session required');
    }

    if (user.role === UserRoleType.MASTER_ADMIN) {
      return true;
    }

    const userPerms = new Set(user.permissions || []);
    const hasAll = requiredPermissions.every((p) => userPerms.has(p) || userPerms.has('*'));

    if (!hasAll) {
      throw new ForbiddenException(
        `Insufficient permissions. Missing required: [${requiredPermissions.join(', ')}]`
      );
    }

    return true;
  }
}
