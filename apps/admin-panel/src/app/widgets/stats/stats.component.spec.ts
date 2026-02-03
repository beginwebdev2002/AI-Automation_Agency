import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatsComponent } from './stats.component';
import { CardComponent } from '@shared/ui/card/card.component';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-card',
  standalone: true,
  template: '<ng-content></ng-content>'
})
class MockCardComponent {
    @Input() title?: string;
    @Input() glass?: boolean;
    @Input() padding?: 'none' | 'sm' | 'md' | 'lg';
}

@Component({
  selector: 'lucide-icon',
  standalone: true,
  template: ''
})
class MockLucideIcon {
    @Input() name?: string;
    @Input() class?: string;
    @Input() img?: unknown;
}

describe('StatsComponent', () => {
  let component: StatsComponent;
  let fixture: ComponentFixture<StatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsComponent],
    })
    .overrideComponent(StatsComponent, {
      remove: { imports: [CardComponent, LucideAngularModule] },
      add: { imports: [MockCardComponent, MockLucideIcon] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
