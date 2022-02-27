import { Route } from '@angular/router';
import { AuthSignInComponent } from 'src/app/modules/auth/sign-in/sign-in.component';

export const authSignInRoutes: Route[] = [
    {
        path: 'sign-in',
        component: AuthSignInComponent
    }
];
