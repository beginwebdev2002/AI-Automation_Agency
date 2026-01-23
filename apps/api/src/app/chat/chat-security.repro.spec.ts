
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { TelegramAuthGuard } from '@app/auth/telegram-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('ChatController Security Repro', () => {
    let controller: ChatController;

    const mockChatService = {
        handleMessage: jest.fn().mockResolvedValue('Hello from Gemini'),
    };

    const mockConfigService = {
        get: jest.fn((key) => {
            if (key === 'TELEGRAM_TOKEN') return 'mock_token';
            return null;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ChatController],
            providers: [
                {
                    provide: ChatService,
                    useValue: mockChatService,
                },
                TelegramAuthGuard,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        controller = module.get<ChatController>(ChatController);
    });

    it('should HAVE TelegramAuthGuard applied to sendMessage', async () => {
        const guards = Reflect.getMetadata('__guards__', controller.sendMessage);
        expect(guards).toBeDefined();
        const guardNames = guards.map((g: any) => g.name);
        expect(guardNames).toContain('TelegramAuthGuard');
    });
});
