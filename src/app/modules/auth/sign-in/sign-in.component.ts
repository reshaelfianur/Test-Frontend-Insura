import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { CommonService } from 'src/app/core/services/common.service';
import { SessionService } from 'src/app/core/services/session.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthSignInComponent implements OnInit {

    public form: FormGroup;

    public url: string = "/auth/sign-in";
    public title: string = "Sign-in";
    public module: string = "Auth";

    private storeKey: string = '__lastAction';
    public password: string = 'password';

    public isShow: boolean = false;
    public isRememberMe: boolean = false;
    public countFailedAttempt: number = 0;

    constructor(
        private authService: AuthService,
        private router: Router,
        private sessionService: SessionService,
        private commonService: CommonService,
        private toastr: ToastrService,
        private userService: UserService,
        private spinner: NgxSpinnerService) {

        this.router.routeReuseStrategy.shouldReuseRoute = () => {
            return false;
        };
    }

    get f(): { [key: string]: AbstractControl } {
        return this.form.controls;
    }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.form = new FormGroup({
            username_or_email: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
            password: new FormControl("", [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
        });
    }

    public onClick(): void {
        if (this.password === 'password') {
            this.password = 'text';
            this.isShow = true;
        } else {
            this.password = 'password';
            this.isShow = false;
        }
    }

    public onSubmit(): void {
        if (this.form.invalid) {
            this.toastr.error('The input data is invalid. Please check error message');
            return;
        }

        this.spinner.show();

        const data = this.form.value;

        this.authService.signIn(data.username_or_email, data.password).subscribe((signInRes: any) => {
            if (!signInRes.status) {
                this.spinner.hide();

                this.toastr.error(signInRes.message);
                return;
            }

            this.userService.getAccessRights(`?user_id=${signInRes.data.user.user_id}`).subscribe((acccessRightsRes: any) => {
                this.spinner.hide();
                
                if (acccessRightsRes.status) {
                    this.sessionService.setAccessRights(acccessRightsRes.data);

                    this.toastr.success(acccessRightsRes.message, `Welcome ${signInRes.data.user.user_full_name}`);
                    this.router.navigate(['/dashboard']);

                    this.sessionService.save(this.storeKey, Date.now().toString());
                }
            });
        });
    }

    public onRememberMe(value: any): void {
        this.isRememberMe = value;
    }
}
