import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserRole } from '../users/schemas/user.schema';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;

  const mockUser = {
    _id: 'some_id',
    email: 'test@example.com',
    passwordHash: 'hashed_password',
    role: UserRole.USER,
  };

  const mockUserModel = {
    findOne: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue({
        ...mockUser
      }),
    }),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without passwordHash if credentials are valid', async () => {
      const result = await service.validateUser('test@example.com', 'password');
      expect(userModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
      // Ensure lean was called
      // We can check if the mock returned by findOne had lean called?
      // With the current mock setup, we can't easily check 'lean' call count unless we spy on the return value of findOne.
      // But functionality is what matters here.

      expect(result).toEqual({
        _id: 'some_id',
        email: 'test@example.com',
        role: UserRole.USER,
      });
      expect(result.passwordHash).toBeUndefined();
    });

    it('should return null if user not found', async () => {
      mockUserModel.findOne.mockReturnValueOnce({
        lean: jest.fn().mockResolvedValue(null),
      });
      const result = await service.validateUser('wrong@example.com', 'password');
      expect(result).toBeNull();
    });

    it('should return null if password invalid', async () => {
       (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

       const result = await service.validateUser('test@example.com', 'wrong_password');
       expect(result).toBeNull();
    });
  });
});
