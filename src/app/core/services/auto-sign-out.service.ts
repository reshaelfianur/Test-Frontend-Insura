import { Router } from '@angular/router'
import { Injectable } from "@angular/core";

import { SessionService } from './session.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoSignOutService {

  public minuteUntilAutoSignOut: number = 30 // in mins
  public checkInterval: number = 10000 // in ms
  public storeKey: string = '__lastAction';

  constructor(
    private router: Router,
    private authService: AuthService,
    private sessionService: SessionService
  ) {
    this.check();
    this.initListener();
    this.initInterval();
  }

  public getLastAction() {
    return parseInt(this.sessionService.load(this.storeKey));
  }

  public setLastAction(lastAction: number) {
    this.sessionService.save(this.storeKey, lastAction.toString());
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    // document.body.addEventListener('mouseover', () => this.reset());
    // document.body.addEventListener('mouseout', () => this.reset());
    // document.body.addEventListener('keydown', () => this.reset());
    // document.body.addEventListener('keyup', () => this.reset());
    // document.body.addEventListener('keypress', () => this.reset());

    window.addEventListener("storage", () => this.storageEvt());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, this.checkInterval);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + (this.minuteUntilAutoSignOut * 60 * 1000);
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout) {
      this.authService.signOut();

      // window.location.href = location.origin;
      // return;
    }
  }

  storageEvt() {
    this.sessionService.load(this.storeKey)
  }
}
