import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { getModelToken } from '@nestjs/mongoose';
import { Venue } from './schemas/venue.schema';
import { Appointment } from './schemas/appointment.schema';

describe('BookingService', () => {
    let service: BookingService;
    let venueModel: any;

    const mockVenueModel = {
        find: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn(),
    };

    const mockAppointmentModel = {
        find: jest.fn(),
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
        venueModel = module.get(getModelToken(Venue.name));
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
});
