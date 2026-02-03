import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { StatsComponent } from '@widgets/stats/stats.component';

@Component({
  selector: 'app-stats-widget',
  standalone: true,
  template: ''
})
class MockStatsComponent {}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    })
    .overrideComponent(DashboardComponent, {
      remove: { imports: [StatsComponent] },
      add: { imports: [MockStatsComponent] }
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
