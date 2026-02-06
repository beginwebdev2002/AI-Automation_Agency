import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const adminToken = this.configService.get<string>('ADMIN_API_TOKEN');

    if (!adminToken) {
      this.logger.error('ADMIN_API_TOKEN is not configured');
      throw new UnauthorizedException('Service unavailable');
    }

    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }

    if (authHeader === `Bearer ${adminToken}`) {
      return true;
    }

    throw new UnauthorizedException('Insufficient permissions');
  }
}
