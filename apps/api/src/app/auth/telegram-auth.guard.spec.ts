
import { TelegramAuthGuard } from './telegram-auth.guard';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

describe('TelegramAuthGuard', () => {
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
    } as any;

    guard = new TelegramAuthGuard(configService);
  });

  const generateInitData = (user: any, token: string) => {
    const userStr = JSON.stringify(user);
    const params = new URLSearchParams();
    params.append('user', userStr);
    params.append('auth_date', Math.floor(Date.now() / 1000).toString());
    params.append('query_id', 'AAEAA...');

    // Sort and create data check string
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

  it('should assign admin role when user id matches TELEGRAM_ADMIN_ID', () => {
    const adminUser = { id: 123456789, first_name: 'Admin', username: 'admin' };
    const initData = generateInitData(adminUser, mockTelegramToken);

    const request = {
      headers: {
        'x-telegram-init-data': initData,
      },
      user: null,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    // Note: The current implementation might fail this expectation until we apply the fix
    // because it hardcodes a different ID.
    // For TDD, I expect this to FAIL (or I should test for the hardcoded behavior first, then change it).
    // But since I'm implementing the fix immediately, I'll write the test for the DESIRED behavior.
    expect(request.user).toBeDefined();
    // Use loose equality or string conversion as ID comes as number from JSON but might be string in env
    expect(String(request.user.role)).toBe('admin');
  });

  it('should assign client role when user id does not match TELEGRAM_ADMIN_ID', () => {
    const clientUser = { id: 987654321, first_name: 'User', username: 'user' };
    const initData = generateInitData(clientUser, mockTelegramToken);

    const request = {
      headers: {
        'x-telegram-init-data': initData,
      },
      user: null,
    };

    const context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect(request.user.role).toBe('client');
  });

  it('should throw UnauthorizedException if initData is missing', () => {
      const request = {
          headers: {},
      };
      const context = {
          switchToHttp: () => ({
              getRequest: () => request,
          }),
      } as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if hash is invalid', () => {
      const adminUser = { id: 123456789, first_name: 'Admin', username: 'admin' };
      // Generate with WRONG token
      const initData = generateInitData(adminUser, 'wrong_token');

      const request = {
          headers: {
              'x-telegram-init-data': initData,
          },
      };

      const context = {
          switchToHttp: () => ({
              getRequest: () => request,
          }),
      } as ExecutionContext;

      expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
