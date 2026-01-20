import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  it('should validate valid dto', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    const dto = new RegisterDto();
    dto.email = 'invalid-email';
    dto.password = 'password123';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
  });

  it('should fail on short password', async () => {
    const dto = new RegisterDto();
    dto.email = 'test@example.com';
    dto.password = '12345';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('password');
  });
});
