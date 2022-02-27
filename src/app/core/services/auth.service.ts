import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, Observer } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { SessionService } from './session.service';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	constructor(
		private http: HttpClient,
		private router: Router,
		private spinner: NgxSpinnerService,
		private sessionService: SessionService,
	) { }

	isSignin(): boolean {
		if (this.sessionService.getLoginId() != null) {
			return true;
		}
		return false;
	}

	signIn(usernameOrEmail: string, password: string) {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/auth/sign-in`;
			const data = { "username_or_email": usernameOrEmail, "password": password };

			this.spinner.show();

			this.http.post(url, data, { headers: this.sessionService.authHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				if (respond.status) {
					this.sessionService.setAuthentication(respond.data.user.user_id, respond.data.token);
					this.sessionService.setUser(respond.data.user);
				}

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			});
		});
	}

	signOut() {
		const url = `${this.sessionService.server}/auth/sign-out`;

		this.http.post(url, {}, { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
			this.sessionService.signOut();
			this.router.navigate(['/auth/sign-in']);
		});
	}

	forgotPassword(email: string) {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/auth/forgot-password`;
			const data = { "email": email };

			this.http.post(url, data, { headers: this.sessionService.authHeader() }).subscribe((respond: any) => {
				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			});
		});
	}

	resetPassword(username: string, password: string, token: string) {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/api/entity/auth/reset-password`;
			const data = { "email": username, "password": password, "token": token };

			this.http.post(url, data, { headers: this.sessionService.authHeader() }).subscribe((respond: any) => {
				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			});
		});
	}
}

