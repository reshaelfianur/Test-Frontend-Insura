import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DataTablesModule } from 'angular-datatables';
import { NgSelectModule } from '@ng-select/ng-select';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { EmployeeComponent } from './employee/employee.component';

const employeeManagementRoutes: Routes = [
  {
    path: 'employee',
    component: EmployeeComponent
  }
];

@NgModule({
  declarations: [
    EmployeeComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    NgSelectModule,
    NgxSpinnerModule,
    DataTablesModule,
    ReactiveFormsModule,
    NgBootstrapFormValidationModule,
    RouterModule.forChild(employeeManagementRoutes)
  ]
})
export class EmployeeManagementModule { }
