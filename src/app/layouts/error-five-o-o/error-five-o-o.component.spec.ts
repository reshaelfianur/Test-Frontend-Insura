import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFiveOOComponent } from './error-five-o-o.component';

describe('ErrorFiveOOComponent', () => {
  let component: ErrorFiveOOComponent;
  let fixture: ComponentFixture<ErrorFiveOOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorFiveOOComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFiveOOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
