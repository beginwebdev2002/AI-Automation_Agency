import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

describe('CreateBookingDto', () => {
  it('should validate a correct booking', async () => {
    const data = {
      clientId: '123',
      clientName: 'John Doe',
      date: new Date().toISOString(),
      items: [
        {
          serviceId: 's1',
          name: 'Haircut',
          price: 100,
          durationMinutes: 30,
        },
      ],
    };
    const dto = plainToInstance(CreateBookingDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if required fields are missing', async () => {
    const data = {};
    const dto = plainToInstance(CreateBookingDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail if items are invalid', async () => {
    const data = {
      clientId: '123',
      clientName: 'John Doe',
      date: new Date().toISOString(),
      items: [
        {
          serviceId: 's1',
          name: 'Haircut',
          price: -10, // Invalid
          durationMinutes: 0, // Invalid
        },
      ],
    };
    const dto = plainToInstance(CreateBookingDto, data);
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    // Specifically check that items validation failed
    const itemsError = errors.find((e) => e.property === 'items');
    expect(itemsError).toBeDefined();
  });
});
