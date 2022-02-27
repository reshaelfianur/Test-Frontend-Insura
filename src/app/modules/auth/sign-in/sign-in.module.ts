import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxSpinnerModule } from 'ngx-spinner';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { AuthSignInComponent } from 'src/app/modules/auth/sign-in/sign-in.component';
import { authSignInRoutes } from 'src/app/modules/auth/sign-in/sign-in.routing';

@NgModule({
    declarations: [
        AuthSignInComponent
    ],
    imports: [
        RouterModule.forChild(authSignInRoutes),
        NgBootstrapFormValidationModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        CommonModule,
        FormsModule,
    ]
})
export class AuthSignInModule {
}
