import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { AuthSessionPayload } from '@erp/types';

/**
 * Maker-Checker Guard:
 * Strictly enforces that a sensitive transaction cannot be approved,
 * rejected, or reversed by the user who originally created it.
 * (Even Master Admin cannot approve their own sensitive transaction)
 */
@Injectable()
export class MakerCheckerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: AuthSessionPayload = request.user;

    if (!user) {
      throw new ForbiddenException('User authentication session required');
    }

    // In a sensitive approval handler, the existing entity must be attached
    // or passed via request.entity or request.body.createdBy
    const creatorId =
      request.entity?.createdBy?.toString() ||
      request.body?.createdBy?.toString() ||
      request.recordCreatorId;

    if (creatorId && creatorId === user.userId) {
      throw new ForbiddenException(
        'MAKER_CHECKER_VIOLATION: The creator of a sensitive financial transaction cannot approve or reverse their own request.'
      );
    }

    return true;
  }
}
