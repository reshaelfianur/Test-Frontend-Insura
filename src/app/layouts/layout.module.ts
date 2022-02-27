import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NavModule } from '../navs/nav.module';
import { BaseLayoutComponent } from './base-layout/base-layout.component';
import { FullLayoutComponent } from './full-layout/full-layout.component';
import { ErrorFiveOOComponent } from './error-five-o-o/error-five-o-o.component';
import { ErrorFourOFourComponent } from './error-four-o-four/error-four-o-four.component';

@NgModule({
    declarations: [
        BaseLayoutComponent,
        FullLayoutComponent,
        ErrorFiveOOComponent,
        ErrorFourOFourComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        NavModule,
        NgbModule,
        BrowserAnimationsModule,
    ]
})
export class LayoutModule { }
