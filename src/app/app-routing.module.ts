import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';
import { ErrorFourOFourComponent } from './layouts/error-four-o-four/error-four-o-four.component';

import { GuardService } from './core/services/guard.service';
import { ErrorFiveOOComponent } from './layouts/error-five-o-o/error-five-o-o.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [GuardService],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule)
      }
    ]
  },
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [GuardService],
    children: [
      {
        path: 'user-management',
        loadChildren: () => import('./modules/user-management/user-management.module').then(m => m.UserManagementModule)
      }
    ]
  },
  {
    path: '',
    component: BaseLayoutComponent,
    canActivate: [GuardService],
    children: [
      {
        path: 'employee-management',
        loadChildren: () => import('./modules/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
      }
    ]
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () => import('./modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)
      }
    ]
  },
  {
    path: '500', pathMatch: 'full',
    component: ErrorFiveOOComponent
  },
  {
    path: '**', pathMatch: 'full',
    component: ErrorFourOFourComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
