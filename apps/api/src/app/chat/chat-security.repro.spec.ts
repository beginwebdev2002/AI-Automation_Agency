
import { Test, TestingModule } from '@nestjs/testing';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { TelegramAuthGuard } from '@app/auth/telegram-auth.guard';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';

// Define minimal interface to avoid 'any'
interface MockRequest {
    user?: {
        id: number;
        first_name: string;
    };
}

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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const guardNames = guards.map((g: any) => g.name);
        expect(guardNames).toContain('TelegramAuthGuard');
    });

    it('should throw UnauthorizedException if req.user is missing (IDOR protection)', async () => {
        const req = { user: undefined } as unknown as MockRequest;
        const body: SendMessageDto = { message: 'hello', chatId: 'target_victim_id' };

        // Cast req to any because controller expects AuthenticatedRequest which is private
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await expect(controller.sendMessage(req as any, body)).rejects.toThrow(UnauthorizedException);
    });

    it('should use req.user.id and ignore body.chatId', async () => {
        const req = { user: { id: 12345, first_name: 'Attacker' } } as MockRequest;
        const body: SendMessageDto = { message: 'hello', chatId: 'target_victim_id' };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await controller.sendMessage(req as any, body);

        // Verify that handleMessage was called with the USER'S id (12345), not the body's id (target_victim_id)
        expect(mockChatService.handleMessage).toHaveBeenCalledWith('12345', 'hello');
    });
});
