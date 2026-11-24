import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UserRoleType, AuthSessionPayload } from '@erp/types';

@Injectable()
export class BranchScopeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthSessionPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication session required');
    }

    // MASTER_ADMIN has global scope across all branches
    if (user.role === UserRoleType.MASTER_ADMIN) {
      return true;
    }

    // Extract target branchId from params, query, or body
    const branchId =
      request.params?.branchId ||
      request.query?.branchId ||
      request.body?.branchId ||
      request.body?.sourceBranchId;

    if (!branchId) {
      return true; // No explicit branch specified in endpoint
    }

    const allowed = user.allowedBranches || [];
    if (!allowed.includes(branchId)) {
      throw new ForbiddenException(
        `Access denied. Your role and assignment do not permit access to branch: ${branchId}`
      );
    }

    return true;
  }
}
