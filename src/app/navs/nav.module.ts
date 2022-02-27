
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    SpinnerComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule
  ],
  exports: [
    SidebarComponent,
    FooterComponent,
    NavbarComponent,
    SpinnerComponent
  ]
})
export class NavModule { }
