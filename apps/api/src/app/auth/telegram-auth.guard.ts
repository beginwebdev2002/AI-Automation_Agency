import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class TelegramAuthGuard implements CanActivate {
  private secretKey: Buffer | undefined;

  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const initData = request.headers['x-telegram-init-data'];

    if (!initData) {
      throw new UnauthorizedException('Missing Telegram initData');
    }

    if (this.validateInitData(initData)) {
      // Parse user data from initData
      const urlParams = new URLSearchParams(initData);
      const userString = urlParams.get('user');
      if (userString) {
        request.user = JSON.parse(userString);
        // Add role logic here
        const adminId = this.configService.get<string>('TELEGRAM_ADMIN_ID');
        request.user.role =
          String(request.user.id) === adminId ? 'admin' : 'client';
      }
      return true;
    }

    throw new UnauthorizedException('Invalid Telegram initData');
  }

  private validateInitData(initData: string): boolean {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    const authDate = urlParams.get('auth_date');
    urlParams.delete('hash');

    if (!authDate) {
      return false;
    }

    const authTimestamp = parseInt(authDate, 10);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const timeDifference = currentTimestamp - authTimestamp;

    // Check if data is older than 24 hours (86400 seconds)
    if (timeDifference > 86400) {
      return false;
    }

    const dataCheckString = Array.from(urlParams.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    let secretKey = this.secretKey;

    if (!secretKey) {
      const token = this.configService.get<string>('TELEGRAM_TOKEN');
      if (!token) {
        throw new UnauthorizedException('Telegram token not configured');
      }
      secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(token)
        .digest();
      this.secretKey = secretKey;
    }

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    return calculatedHash === hash;
  }
}
