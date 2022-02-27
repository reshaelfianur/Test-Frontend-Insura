import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormArray } from '@angular/forms';

import { Observable } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

import { SessionService } from './session.service';

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	private extraData: any;

	constructor(
		private http: HttpClient,
		private spinner: NgxSpinnerService,
		private sessionService: SessionService,
	) {
		this.extraData = new Object();
	}

	public prefix() {
		const company = this.sessionService.getCompany();

		if (company == null) {
			return null;
		}
		return company.company;
	}

	protected extractData(respond: any) {
		const keys = Object.keys(respond);

		for (const key of keys) {
			if (key != "status" && key != "data") {
				this.extraData[key] = respond[key];
			}
		}
	}

	public getExtraData(key: any) {
		return this.extraData[key];
	}

	public getDb() {
		return this.sessionService.getDb();
	}

	public json(key: string): Observable<any> {
		return new Observable(observer => {
			this.http.get(key).subscribe((respond: any) => {
				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			});
		});
	}

	public list(key: string, params?: string): Observable<any> {
		return new Observable(observer => {
			let url;

			key += '/index'

			if (params != undefined) {
				url = `${this.sessionService.server}/${key}${params}`;
			} else {
				url = `${this.sessionService.server}/${key}`;
			}

			const request = this.http.get(url, { headers: this.sessionService.getHeader() });

			this.spinner.show();

			request.subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public get(key: string, params: string): Observable<any> {
		return new Observable(observer => {

			key += '/show'

			const url = `${this.sessionService.server}/${key}${params}&_getOne=1`;

			let request = this.http.get(url, { headers: this.sessionService.getHeader() });

			this.spinner.show();

			request.subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public add(key: string, data: any): Observable<any> {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/${key}/store`;

			const encodedData = this.getFormUrlEncoded(data);

			this.spinner.show();

			this.http.post(url, encodedData, { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public taskPost(key: string, taskName: string, data: any): Observable<any> {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/${key}/${taskName}`;

			this.spinner.show();

			this.http.post(url, this.getFormUrlEncoded(data), { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public update(key: string, data: any): Observable<any> {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/${key}/save`;

			this.spinner.show();

			this.http.put(url, this.getFormUrlEncoded(data), { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public taskPut(key: string, taskName: string, data: any): Observable<any> {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/${key}/${taskName}`;

			this.spinner.show();

			this.http.put(url, this.getFormUrlEncoded(data), { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public delete(key: string, params: string): Observable<any> {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/${key}/destroy${params}`;

			this.spinner.show();

			this.http.delete(url, { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				if (!respond.status) {
					this.checkAutoSignOut(respond);

					observer.next(respond);
					observer.complete();

					return (observer).unsubscribe();
				}

				this.regenerateAuth(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public upload(key: string, data: any): Observable<any> {
		return new Observable(observer => {

			const url = `${this.sessionService.server}/${key}/upload`;

			this.spinner.show();

			this.http.post(url, data, { headers: this.sessionService.uploadHeader() }).subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public taskGet(key: string, taskName: string, params: string = "", header: boolean = true): Observable<any> {
		return new Observable(observer => {

			let objectHeader = {};

			const url = `${this.sessionService.server}/${key}/${taskName}${params}`;

			if (header) {
				objectHeader = { headers: this.sessionService.getHeader() };
			}

			let request = this.http.get(url, objectHeader);

			this.spinner.show();

			request.subscribe((respond: any) => {
				this.spinner.hide();

				this.regenerateAuth(respond);
				this.extractData(respond);

				observer.next(respond);
				observer.complete();

				return (observer).unsubscribe();
			},
				(err) => { this.checkAutoSignOut(err) });
		});
	}

	public checkAutoSignOut(respond: any) {
		
		if (respond.status == 401) {
			const url = `${this.sessionService.server}/auth/sign-out`;

			this.http.post(url, {}, { headers: this.sessionService.postHeader() }).subscribe((respond: any) => {
				this.sessionService.signOut();

				window.location.href = location.origin;
				return;
			});
		}
	}

	public regenerateAuth(respond: any) {
		if (this.sessionService.getUser() != null && respond.token != undefined) {
			this.sessionService.setAuthentication(this.sessionService.getUser().id, respond.token, this.sessionService.getDb());
		}
	}

	public getFormUrlEncoded(toConvert: any) {
		const formBody = [];

		for (const property in toConvert) {
			const encodedKey = encodeURIComponent(property);
			const encodedValue = encodeURIComponent(toConvert[property]);

			formBody.push(encodedKey + '=' + encodedValue);
		}
		return formBody.join('&');
	}

	public findInvalidControlsRecursive(formToInvestigate: FormGroup | FormArray): string[] {
		var invalidControls: string[] = [];

		let recursiveFunc = (form: FormGroup | FormArray) => {
			Object.keys(form.controls).forEach(field => {
				const control = form.get(field);

				if (control != null) {
					if (control.invalid) invalidControls.push(field);

					if (control instanceof FormGroup) {
						recursiveFunc(control);
					} else if (control instanceof FormArray) {
						recursiveFunc(control);
					}
				};
			});
		}
		recursiveFunc(formToInvestigate);

		return invalidControls;
	}

}
