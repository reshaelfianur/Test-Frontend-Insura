import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTablesModule } from 'angular-datatables';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layouts/layout.module';
import { AppRoutingModule } from './app-routing.module';

import { ConfirmationDialogComponent } from 'src/app/additional/confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from 'src/app/additional/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([], { useHash: true }),
    RouterModule,
    NgbModule,
    CoreModule,
    LayoutModule,
    NgSelectModule,
    HttpClientModule,
    DataTablesModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    NgBootstrapFormValidationModule.forRoot(),
    ToastrModule.forRoot({
      positionClass: 'toast-top-right'
    })
  ],
  providers: [ConfirmationDialogService],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AppModule { }
