import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class SessionService {

	public server: string = environment.api;
	public pasphrase: string = "";

	constructor(private http: HttpClient) {
	}

	public fetchIp(): Observable<any> {
		return new Observable(observer => {
			const url: string = "https://api.ipify.org?format=json";

			this.http.get(url).subscribe((respond: any) => {
				this.setIp(respond.ip);

				observer.next(respond.ip);
				observer.complete();

				return (observer).unsubscribe();
			});
		});
	}

	public setIp(params: any) {
		localStorage.setItem("__IP", this.encrypt(JSON.stringify(params)));

		// this.pasphrase = params.replace(/\./g, '').toString(); // if uncomment is error decrypt
	}

	public getIp() {
		let __IP = this.decrypt(localStorage.getItem("__IP"));

		if (__IP == null) {
			return this.fetchIp().subscribe(output => {
				return output;
			});
		}

		return JSON.parse(__IP);
	}

	public encrypt(text: any) {
		return CryptoJS.AES.encrypt(text.trim(), this.pasphrase.trim()).toString();
	}

	public decrypt(encrypted: any) {
		if (encrypted == null || encrypted == undefined) {
			return null;
		}

		return CryptoJS.AES.decrypt(encrypted.trim(), this.pasphrase.trim()).toString(CryptoJS.enc.Utf8);
	}

	public setCaptcha(params: any) {
		localStorage.setItem("__captcha", this.encrypt(JSON.stringify(params)));
	}

	public getCaptcha(): string {
		let captcha = this.decrypt(localStorage.getItem("__captcha"));

		if (captcha == null) {
			return 'OnaRmHs2YOE34ATR5fyAJfxCzJwMpO0G';
		}

		return JSON.parse(captcha);
	}

	public setCompany(params: any) {
		sessionStorage.setItem("__company", this.encrypt(JSON.stringify(params)));
	}

	public getCompany() {
		let __company = this.decrypt(sessionStorage.getItem("__company"));

		if (__company == null) {
			return null;
		}

		return JSON.parse(__company);
	}

	public setDb(params: any) {
		sessionStorage.setItem("__db", this.encrypt(params));
	}

	public getDb() {
		return this.decrypt(sessionStorage.getItem("__db"));
	}

	public setAccessRights(params: any) {
		sessionStorage.setItem("__accessRights", this.encrypt(JSON.stringify(params)));
	}

	public getAccessRights() {
		let __accessRights = this.decrypt(sessionStorage.getItem("__accessRights"));

		if (__accessRights == null) {
			return null;
		}

		return JSON.parse(__accessRights);
	}

	public getHeaderAccessRights() {
		return btoa(JSON.stringify(this.getAccessRights()));
	}

	public setAuthentication(userId: string, loginId: string, db?: string | null, custom: boolean = false) {
		sessionStorage.setItem("__userId", this.encrypt(userId.toString())); // add toString for id integer
		sessionStorage.setItem("__loginId", this.encrypt(loginId));

		if (custom) {
			if (db == undefined || db == null) {
				sessionStorage.setItem("__bearer", this.encrypt(btoa(userId + ":" + loginId)));
			} else {
				sessionStorage.setItem("__bearer", this.encrypt(btoa(userId + ":" + loginId + ":" + db)));
			}
		} else {
			sessionStorage.setItem("__bearer", this.encrypt(loginId));
		}
	}

	public getLoginId() {
		return this.decrypt(sessionStorage.getItem("__loginId"));
	}

	public getBearer() {
		return this.decrypt(sessionStorage.getItem("__bearer"));
	}

	public setUser(user: any) {
		sessionStorage.setItem("__user", this.encrypt(JSON.stringify(user)));
	}

	public getUser() {
		let __user = this.decrypt(sessionStorage.getItem("__user"));

		if (__user == null) {
			return null;
		}

		return JSON.parse(__user);
	}

	public signOut() {
		sessionStorage.clear();
	}

	public save(name: string, data: any) {
		localStorage.setItem(name, JSON.stringify(data));
	}

	public load(name: string): any {
		let itemName = localStorage.getItem(name);

		if (itemName == null || itemName == 'undefined') {
			return null;
		}

		return JSON.parse(itemName);
	}

	public loadAndRemove(name: string): any {
		let itemName = localStorage.getItem(name);

		if (itemName == null) {
			return null;
		}

		localStorage.removeItem(name);

		return JSON.parse(itemName);
	}

	public clearAll() {
		localStorage.clear();
	}

	public appHeader() {
		return new HttpHeaders({
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + this.getBearer()
		});
	}

	public authHeader() {
		return new HttpHeaders({
			'Accept': 'application/json',
			'Captcha': this.getCaptcha(),
			'IPAddress': this.getIp(),
		});
	}

	public postHeader() {
		if (this.getLoginId() != null) {
			return new HttpHeaders({
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + this.getBearer(),
				'AccessRights': this.getHeaderAccessRights(),
			});
		}

		return new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
		});
	}

	public uploadHeader() {
		if (this.getLoginId() != null) {
			return new HttpHeaders({
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + this.getBearer(),
				'AccessRights': this.getHeaderAccessRights(),
			});
		}

		return new HttpHeaders({
			'Content-Type': 'application/x-www-form-urlencoded',
			'Accept': 'application/json',
		});
	}

	public getHeader() {
		if (this.getLoginId() != null) {
			return new HttpHeaders({
				'Accept': 'application/json',
				'Authorization': 'Bearer ' + this.getBearer(),
				'AccessRights': this.getHeaderAccessRights(),
			});
		}

		return new HttpHeaders({
			'Accept': 'application/json',
		});
	}

}
