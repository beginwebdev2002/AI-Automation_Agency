
import { TelegramAuthGuard } from './telegram-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('TelegramAuthGuard Replay Attack', () => {
  let guard: TelegramAuthGuard;
  let configService: ConfigService;

  const mockTelegramToken = 'mock_token';
  const mockAdminId = '123456789';

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'TELEGRAM_TOKEN') return mockTelegramToken;
        if (key === 'TELEGRAM_ADMIN_ID') return mockAdminId;
        return null;
      }),
    } as unknown as ConfigService;

    guard = new TelegramAuthGuard(configService);
  });

  const generateInitData = (authDate: number, token: string) => {
    const user = { id: 123456789, first_name: 'User' };
    const userStr = JSON.stringify(user);
    const params = new URLSearchParams();
    params.append('user', userStr);
    params.append('auth_date', authDate.toString());
    params.append('query_id', 'AAEAA...');

    const dataCheckString = Array.from(params.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(token)
      .digest();

    const hash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    params.append('hash', hash);
    return params.toString();
  };

  it('FIXED: should REJECT initData with old auth_date', () => {
    // 2 days ago
    const oldDate = Math.floor(Date.now() / 1000) - (2 * 86400);
    const initData = generateInitData(oldDate, mockTelegramToken);

    const request = {
      headers: {
        'x-telegram-init-data': initData,
      },
      user: null as unknown,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    // Now it should throw UnauthorizedException
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
