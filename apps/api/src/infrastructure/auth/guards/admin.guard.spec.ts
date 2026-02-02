import { AdminGuard } from './admin.guard';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if token matches', () => {
    jest.spyOn(configService, 'get').mockReturnValue('test-token');
    const context = createMockContext('Bearer test-token');
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException if token does not match', () => {
    jest.spyOn(configService, 'get').mockReturnValue('test-token');
    const context = createMockContext('Bearer wrong-token');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if no header', () => {
    jest.spyOn(configService, 'get').mockReturnValue('test-token');
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if ADMIN_API_TOKEN is not set', () => {
    jest.spyOn(configService, 'get').mockReturnValue(undefined);
    const context = createMockContext('Bearer any-token');
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});

function createMockContext(authHeader: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({
        headers: {
          authorization: authHeader,
        },
      }),
    }),
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
