import { Test, TestingModule } from '@nestjs/testing';
import { QueueService } from './queue.service';
import { getModelToken } from '@nestjs/mongoose';
import { Queue } from './schemas/queue.schema';

describe('QueueService', () => {
  let service: QueueService;
  let model: any;

  const mockQueueModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  // Constructor mock
  const mockModelConstructor = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...dto, _id: 'mockId' }),
  }));

  // Attach static methods to the constructor mock
  Object.assign(mockModelConstructor, mockQueueModel);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueueService,
        {
          provide: getModelToken(Queue.name),
          useValue: mockModelConstructor,
        },
      ],
    }).compile();

    service = module.get<QueueService>(QueueService);
    model = module.get(getModelToken(Queue.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addToQueue', () => {
    it('should add a new entry with incremented sequence number', async () => {
      // Mock findOne -> sort -> exec to return last entry
      const mockExec = jest.fn();
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
      model.findOne.mockReturnValue({ sort: mockSort });

      mockExec.mockResolvedValue({ sequenceNumber: 5 }); // Last entry was 5

      const result = await service.addToQueue(1, 'John', 'john', 'Laser');

      expect(model.findOne).toHaveBeenCalled();
      expect(mockSort).toHaveBeenCalledWith({ sequenceNumber: -1 });
      expect(result.sequenceNumber).toBe(6);
      expect(result.status).toBe('waiting');
    });

    it('should start sequence at 1 if no entry found for today', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
      model.findOne.mockReturnValue({ sort: mockSort });

      const result = await service.addToQueue(1, 'John', 'john', 'Laser');

      expect(result.sequenceNumber).toBe(1);
    });
  });

  describe('getQueue', () => {
    it('should return waiting and in-progress items sorted by sequence', async () => {
      const mockItems = [
        { sequenceNumber: 1, status: 'in-progress' },
        { sequenceNumber: 2, status: 'waiting' }
      ];

      const mockExec = jest.fn().mockResolvedValue(mockItems);
      const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
      const mockSort = jest.fn().mockReturnValue({ lean: mockLean });
      model.find.mockReturnValue({ sort: mockSort });

      const result = await service.getQueue();

      expect(model.find).toHaveBeenCalledWith({ status: { $in: ['waiting', 'in-progress'] } });
      expect(mockSort).toHaveBeenCalledWith({ sequenceNumber: 1 });
      expect(result).toEqual(mockItems);
    });
  });
});
