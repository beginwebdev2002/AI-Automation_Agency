import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from './admin.guard';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const createMockContext = (authHeader?: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: authHeader,
          },
        }),
      }),
    } as unknown as ExecutionContext;
  };

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
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access with valid token from env', () => {
    mockConfigService.get.mockReturnValue('secure-token');
    const context = createMockContext('Bearer secure-token');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access with default token if env is missing', () => {
    mockConfigService.get.mockReturnValue(undefined);
    const context = createMockContext('Bearer admin-secret-token');

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw UnauthorizedException if auth header is missing', () => {
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    mockConfigService.get.mockReturnValue('secure-token');
    const context = createMockContext('Bearer wrong-token');

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token format is wrong', () => {
    mockConfigService.get.mockReturnValue('secure-token');
    const context = createMockContext('secure-token'); // Missing Bearer

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
