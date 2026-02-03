import { AdminGuard } from './admin.guard';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException, Logger } from '@nestjs/common';

describe('AdminGuard', () => {
  let guard: AdminGuard;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockExecutionContext = (headers: any = {}) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        headers,
      }),
    }),
  } as any);

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

    // Mock logger to avoid cluttering test output
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should throw UnauthorizedException if no authorization header is present', () => {
    const context = mockExecutionContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should return false and log error if ADMIN_API_TOKEN is not configured', () => {
    mockConfigService.get.mockReturnValue(undefined);
    const context = mockExecutionContext({ authorization: 'Bearer some-token' });

    expect(guard.canActivate(context)).toBe(false);
    expect(Logger.prototype.error).toHaveBeenCalledWith(
      'ADMIN_API_TOKEN is not configured in environment variables'
    );
  });

  it('should throw UnauthorizedException if token does not match', () => {
    mockConfigService.get.mockReturnValue('secret-token');
    const context = mockExecutionContext({ authorization: 'Bearer wrong-token' });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should return true if token matches', () => {
    mockConfigService.get.mockReturnValue('secret-token');
    const context = mockExecutionContext({ authorization: 'Bearer secret-token' });

    expect(guard.canActivate(context)).toBe(true);
  });
});
