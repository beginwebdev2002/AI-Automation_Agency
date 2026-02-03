import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from '@features/auth/login-form/login-form.component';
import { CardComponent } from '@shared/ui/card/card.component';

@Component({
  selector: 'app-login-form',
  standalone: true,
  template: ''
})
class MockLoginFormComponent {}

@Component({
  selector: 'app-card',
  standalone: true,
  template: '<ng-content></ng-content>'
})
class MockCardComponent {
    @Input() glass?: boolean;
    @Input() padding?: 'none' | 'sm' | 'md' | 'lg';
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    })
    .overrideComponent(LoginComponent, {
      remove: { imports: [LoginFormComponent, CardComponent] },
      add: { imports: [MockLoginFormComponent, MockCardComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
