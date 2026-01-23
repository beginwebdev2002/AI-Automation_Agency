import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    // TODO: Implement real JWT verification here
    // For Phase 2 MVP, we check a mock token or simple logic
    if (authHeader === 'Bearer admin-secret-token') {
      return true;
    }

    throw new UnauthorizedException('Insufficient permissions');
  }
}
