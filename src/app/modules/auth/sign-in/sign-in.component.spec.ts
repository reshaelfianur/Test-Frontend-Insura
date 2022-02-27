import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { DebugElement } from '@angular/core';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';

import { AuthSignInComponent } from './sign-in.component';

describe('AuthSignInComponent', () => {
  let component: AuthSignInComponent;
  let fixture: ComponentFixture<AuthSignInComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthSignInComponent],
      imports: [HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        NgxSpinnerModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthSignInComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement.query(By.css('form'));
    el = de.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have as Title "Sign-in"', () => {
    expect(component.title).toEqual('Sign-in');
  });

  it('should have as Url "/auth/sign-in"', () => {
    expect(component.url).toEqual('/auth/sign-in');
  });

  it('should have as Module "Auth"', () => {
    expect(component.module).toEqual('Auth');
  });

  it('should call the onSubmit method', () => {
    fixture.detectChanges();

    spyOn(component, 'onSubmit');

    el = fixture.debugElement.query(By.css('button')).nativeElement;
    el.click();

    expect(component.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('form should be invalid', () => {
    component.form.controls['email'].setValue('');
    component.form.controls['password'].setValue('');

    expect(component.form.valid).toBeFalsy();
  });

  it('form should be valid', () => {
    component.form.controls['email'].setValue('Karlie.Nolan2@hotmail.com');
    component.form.controls['password'].setValue('password 1');

    expect(component.form.valid).toBeTruthy();
  });
});
