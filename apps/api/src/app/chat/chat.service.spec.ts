import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { GeminiService } from '../gemini/gemini.service';
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
    };

    const mockChatModelConstructor = jest.fn().mockImplementation((dto) => ({
        ...mockChatInstance,
        ...dto,
    }));

    (mockChatModelConstructor as any).findOne = mockChatModel.findOne;

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

        mockChatModel.findOne.mockResolvedValue(existingChat);

        await service.handleMessage(chatId, message);

        expect(mockGeminiService.chatWithHistory).toHaveBeenCalled();
        const calledHistory = mockGeminiService.chatWithHistory.mock.calls[0][0];

        // Verify we are limiting the context
        // Current implementation sends all (60 + 1 new = 61)
        // Optimization should reduce this to 50
        expect(calledHistory.length).toBeLessThanOrEqual(50);
    });
});
