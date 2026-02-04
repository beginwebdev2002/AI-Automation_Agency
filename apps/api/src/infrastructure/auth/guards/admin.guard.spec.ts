import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  const mockConfigService = {
    get: jest.fn(),
  };

  const createMockContext = (headers: Record<string, string>) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers,
      }),
    }),
  } as unknown as import('@nestjs/common').ExecutionContext);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminGuard,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if authorization header is missing', () => {
    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should return false and log error if ADMIN_API_TOKEN is not configured', () => {
    mockConfigService.get.mockReturnValue(undefined);
    const context = createMockContext({ authorization: 'Bearer token' });

    expect(guard.canActivate(context)).toBe(false);
    expect(mockConfigService.get).toHaveBeenCalledWith('ADMIN_API_TOKEN');
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    mockConfigService.get.mockReturnValue('secret-token');
    const context = createMockContext({ authorization: 'Bearer wrong-token' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should return true if token is valid', () => {
    mockConfigService.get.mockReturnValue('secret-token');
    const context = createMockContext({ authorization: 'Bearer secret-token' });

    expect(guard.canActivate(context)).toBe(true);
  });
});
