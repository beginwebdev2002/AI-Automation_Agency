import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getModelToken } from '@nestjs/mongoose';
import { Venue } from './schemas/venue.schema';
import { Appointment } from './schemas/appointment.schema';

describe('BookingService', () => {
    let service: BookingService;
    let venueModel: { find: jest.Mock; skip: jest.Mock; limit: jest.Mock; exec: jest.Mock };
    let appointmentModel: { find: jest.Mock; populate: jest.Mock; skip: jest.Mock; limit: jest.Mock; exec: jest.Mock };

    const mockVenueModel = {
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    const mockAppointmentModel = {
        find: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                {
                    provide: getModelToken(Venue.name),
                    useValue: mockVenueModel,
                },
                {
                    provide: getModelToken(Appointment.name),
                    useValue: mockAppointmentModel,
                },
            ],
        }).compile();

        service = module.get<BookingService>(BookingService);
        venueModel = module.get(getModelToken(Venue.name)) as unknown as typeof mockVenueModel;
        appointmentModel = module.get(getModelToken(Appointment.name)) as unknown as typeof mockAppointmentModel;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAllVenues', () => {
        it('should return paginated venues with default values', async () => {
            mockVenueModel.exec.mockResolvedValue(['venue1', 'venue2']);

            const result = await service.findAllVenues();

            expect(venueModel.find).toHaveBeenCalled();
            expect(venueModel.skip).toHaveBeenCalledWith(0);
            expect(venueModel.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual(['venue1', 'venue2']);
        });

        it('should return paginated venues with provided values', async () => {
            mockVenueModel.exec.mockResolvedValue(['venue3']);
            const page = 2;
            const limit = 5;

            const result = await service.findAllVenues(page, limit);

            expect(venueModel.find).toHaveBeenCalled();
            expect(venueModel.skip).toHaveBeenCalledWith(5);
            expect(venueModel.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(['venue3']);
        });

        it('should cap limit to 100', async () => {
            mockVenueModel.exec.mockResolvedValue(['venue4']);
            const page = 1;
            const limit = 200;

            const result = await service.findAllVenues(page, limit);

            expect(venueModel.find).toHaveBeenCalled();
            expect(venueModel.limit).toHaveBeenCalledWith(100);
            expect(venueModel.skip).toHaveBeenCalledWith(0);
            expect(result).toEqual(['venue4']);
        });
    });

    describe('findAllAppointments', () => {
        it('should return paginated appointments with default values', async () => {
            mockAppointmentModel.exec.mockResolvedValue(['appt1', 'appt2']);

            const result = await service.findAllAppointments();

            expect(appointmentModel.find).toHaveBeenCalled();
            expect(appointmentModel.populate).toHaveBeenCalledWith('user', 'email role');
            expect(appointmentModel.populate).toHaveBeenCalledWith('venue', 'name address');
            expect(appointmentModel.skip).toHaveBeenCalledWith(0);
            expect(appointmentModel.limit).toHaveBeenCalledWith(10);
            expect(result).toEqual(['appt1', 'appt2']);
        });

        it('should return paginated appointments with provided values', async () => {
            mockAppointmentModel.exec.mockResolvedValue(['appt3']);
            const page = 2;
            const limit = 5;

            const result = await service.findAllAppointments(page, limit);

            expect(appointmentModel.find).toHaveBeenCalled();
            expect(appointmentModel.skip).toHaveBeenCalledWith(5);
            expect(appointmentModel.limit).toHaveBeenCalledWith(5);
            expect(result).toEqual(['appt3']);
        });

        it('should cap limit to 100', async () => {
            mockAppointmentModel.exec.mockResolvedValue(['appt4']);
            const page = 1;
            const limit = 200;

            const result = await service.findAllAppointments(page, limit);

            expect(appointmentModel.find).toHaveBeenCalled();
            expect(appointmentModel.limit).toHaveBeenCalledWith(100);
            expect(appointmentModel.skip).toHaveBeenCalledWith(0);
            expect(result).toEqual(['appt4']);
        });
    });
});
