import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorFourOFourComponent } from './error-four-o-four.component';

describe('ErrorFourOFourComponent', () => {
  let component: ErrorFourOFourComponent;
  let fixture: ComponentFixture<ErrorFourOFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorFourOFourComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorFourOFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
