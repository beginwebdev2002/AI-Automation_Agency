import { Test, TestingModule } from '@nestjs/testing';
import { BookingController } from './booking.controller';
import { CreateBookingUseCase } from '@application/booking/create-booking.usecase';
import { GetBookingsUseCase } from '@application/booking/get-bookings.usecase';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ConfigService } from '@nestjs/config';

describe('BookingController', () => {
  let controller: BookingController;
  let createBookingUseCase: { execute: jest.Mock };
  let getBookingsUseCase: { execute: jest.Mock };

  beforeEach(async () => {
    createBookingUseCase = { execute: jest.fn() };
    getBookingsUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingController],
      providers: [
        {
          provide: CreateBookingUseCase,
          useValue: createBookingUseCase,
        },
        {
          provide: GetBookingsUseCase,
          useValue: getBookingsUseCase,
        },
        // We need to provide AdminGuard and its dependencies because it is used in UseGuards
        AdminGuard,
        {
          provide: ConfigService,
          useValue: { get: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<BookingController>(BookingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call CreateBookingUseCase.execute with transformed parameters', async () => {
      const mockDate = new Date();
      const body = {
        clientId: 'client-1',
        clientName: 'John Doe',
        date: mockDate.toISOString(),
        items: ['item1'],
      };

      await controller.create(body);

      expect(createBookingUseCase.execute).toHaveBeenCalledWith(
        'client-1',
        'John Doe',
        expect.any(Date), // Checks it's a Date object
        ['item1'],
      );
    });
  });

  describe('findAll', () => {
    it('should call GetBookingsUseCase.execute', async () => {
      await controller.findAll();
      expect(getBookingsUseCase.execute).toHaveBeenCalled();
    });
  });
});
