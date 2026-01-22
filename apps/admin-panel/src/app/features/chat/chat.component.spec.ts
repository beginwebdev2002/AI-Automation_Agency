import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { LanguageService } from '../../core/services/language.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import '@angular/localize/init';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;
  let chatServiceMock: any;
  let languageServiceMock: any;

  beforeEach(async () => {
    chatServiceMock = {
      sendMessage: vi.fn().mockReturnValue(of({ response: 'Hello' }))
    };
    languageServiceMock = {
      getLanguage: vi.fn().mockReturnValue({ code: 'en' })
    };

    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        { provide: ChatService, useValue: chatServiceMock },
        { provide: LanguageService, useValue: languageServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have accessible elements', () => {
    const button = fixture.debugElement.query(By.css('button'));
    const textarea = fixture.debugElement.query(By.css('textarea'));

    expect(button.attributes['aria-label']).toBe('Отправить');
    expect(textarea.attributes['aria-label']).toBe('Сообщение');
  });

  it('should not allow sending empty messages', () => {
    component.newMessage = '';
    component.sendMessage();
    expect(chatServiceMock.sendMessage).not.toHaveBeenCalled();
  });

  it('should call sendMessage on Enter key', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'));
    component.newMessage = 'Hello';

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    vi.spyOn(event, 'preventDefault');

    textarea.triggerEventHandler('keydown.enter', event);

    expect(event.preventDefault).toHaveBeenCalled();
    expect(chatServiceMock.sendMessage).toHaveBeenCalled();
  });

  it('should NOT call sendMessage on Shift+Enter', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'));
    component.newMessage = 'Hello';

    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    vi.spyOn(event, 'preventDefault');

    textarea.triggerEventHandler('keydown.enter', event);

    expect(event.preventDefault).not.toHaveBeenCalled();
    expect(chatServiceMock.sendMessage).not.toHaveBeenCalled();
  });

  it('should auto-resize textarea on input', () => {
    const textarea = fixture.debugElement.query(By.css('textarea'));
    const nativeTextarea = textarea.nativeElement as HTMLTextAreaElement;

    // Set initial height
    nativeTextarea.style.height = '44px';

    // Mock scrollHeight
    Object.defineProperty(nativeTextarea, 'scrollHeight', { value: 100, configurable: true });

    // Trigger input event
    const event = new Event('input');
    textarea.triggerEventHandler('input', { target: nativeTextarea });

    expect(nativeTextarea.style.height).toBe('100px');
  });
});
