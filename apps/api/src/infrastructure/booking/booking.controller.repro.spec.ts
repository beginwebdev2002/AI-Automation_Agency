import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { CreateBookingUseCase } from '@application/booking/create-booking.usecase';
import { GetBookingsUseCase } from '@application/booking/get-bookings.usecase';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import axios from 'axios';
import { Server } from 'http';
import { AddressInfo } from 'net';

describe('BookingController Repro', () => {
  let app: INestApplication;
  let url: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: CreateBookingUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: GetBookingsUseCase,
          useValue: {
            execute: jest.fn().mockResolvedValue([]),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    const server = app.getHttpServer();
    await new Promise<void>((resolve) => {
      server.listen(0, () => resolve());
    });
    const address = server.address() as AddressInfo;
    url = `http://localhost:${address.port}`;
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return 400 when body is invalid (missing clientId)', async () => {
    const invalidBody = {
      // clientId: missing
      clientName: 'John Doe',
      date: '2023-10-10T10:00:00Z',
      items: [],
    };

    try {
      await axios.post(`${url}/bookings`, invalidBody);
      // If it succeeds (201), the vulnerability exists.
      // We expect 400.
      throw new Error('Expected 400 Bad Request, but got 2xx');
    } catch (error: any) {
      if (error.response) {
        expect(error.response.status).toBe(400);
      } else {
        // If "Expected 400..." was thrown, it fails the test (as desired for repro).
        throw error;
      }
    }
  });

  it('should return 400 when date is invalid', async () => {
    const invalidBody = {
      clientId: '123',
      clientName: 'John Doe',
      date: 'not-a-date',
      items: [],
    };

    try {
      await axios.post(`${url}/bookings`, invalidBody);
      throw new Error('Expected 400 Bad Request, but got 2xx');
    } catch (error: any) {
      if (error.response) {
        expect(error.response.status).toBe(400);
      } else {
        throw error;
      }
    }
  });
});
