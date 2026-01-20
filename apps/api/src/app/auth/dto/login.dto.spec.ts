import { validate } from 'class-validator';
import { LoginDto } from './login.dto';

describe('LoginDto', () => {
  it('should validate valid dto', async () => {
    const dto = new LoginDto();
    dto.email = 'test@example.com';
    dto.password = 'password';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    const dto = new LoginDto();
    dto.email = 'invalid-email';
    dto.password = 'password';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail on empty password', async () => {
    const dto = new LoginDto();
    dto.email = 'test@example.com';
    dto.password = '';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
