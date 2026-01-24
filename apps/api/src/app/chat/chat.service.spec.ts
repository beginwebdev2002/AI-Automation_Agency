import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { GeminiService } from '@app/gemini/gemini.service';
import { getModelToken } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';

describe('ChatService', () => {
  let service: ChatService;

  // Mock the Mongoose Model constructor and static methods
  const mockChatInstance = {
    history: [],
    save: jest.fn(),
  };

  const mockChatModel = {
    findOne: jest.fn(),
    updateOne: jest.fn(),
  };

  const mockChatModelConstructor = jest.fn().mockImplementation((dto) => ({
    ...mockChatInstance,
    ...dto,
  }));

  Object.assign(mockChatModelConstructor, {
    findOne: mockChatModel.findOne,
    updateOne: mockChatModel.updateOne,
  });

  const mockGeminiService = {
    chatWithHistory: jest.fn().mockResolvedValue('Response'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken(Chat.name),
          useValue: mockChatModelConstructor,
        },
        {
          provide: GeminiService,
          useValue: mockGeminiService,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should limit history sent to Gemini to the last 50 messages', async () => {
    const chatId = 'user123';
    const message = 'Hello';

    // Create a history larger than 50
    const initialHistory = Array.from({ length: 60 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'model',
      text: `Message ${i}`,
      timestamp: new Date(),
    }));

    const existingChat = {
      chatId,
      history: [...initialHistory],
      save: jest.fn(),
    };

    // Mock findOne to return an object with lean()
    const mockQuery = {
      lean: jest.fn().mockResolvedValue(existingChat),
    };
    mockChatModel.findOne.mockReturnValue(mockQuery);

    await service.handleMessage(chatId, message);

    expect(mockGeminiService.chatWithHistory).toHaveBeenCalled();
    const calledHistory = mockGeminiService.chatWithHistory.mock.calls[0][0];

    // Verify we are limiting the context
    expect(calledHistory.length).toBeLessThanOrEqual(50);

    // Verify updateOne was called
    expect(mockChatModel.updateOne).toHaveBeenCalledWith(
      { chatId },
      expect.objectContaining({
        $push: expect.objectContaining({
          history: expect.objectContaining({
            $each: expect.any(Array),
          }),
        }),
      }),
      { upsert: true },
    );
  });
});
