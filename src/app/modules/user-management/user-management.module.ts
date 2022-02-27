import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgxSpinnerModule } from 'ngx-spinner';

import { UserComponent } from './user/user/user.component';

const userManagementRoutes: Routes = [
  {
    path: 'user',
    component: UserComponent
  }
];

@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    RouterModule.forChild(userManagementRoutes)
  ]
})
export class UserManagementModule { }
