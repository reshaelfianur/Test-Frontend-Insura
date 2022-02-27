import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from 'src/app/core/services/auth.service';
import { UtilsService } from 'src/app/core/services/utils.service';
import { SessionService } from 'src/app/core/services/session.service';
import { User } from 'src/app/core/user/user.types';
import { ConfirmationDialogService } from 'src/app/additional/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})
export class NavbarComponent implements OnInit {

  public iconOnlyToggled: boolean = false;
  public sidebarToggled: boolean = false;
  public currentPeriodString: string;
  public currentPeriod: any = null;

  public user: User;

  constructor(
    private config: NgbDropdownConfig,
    private router: Router,
    private authService: AuthService,
    private utilsService: UtilsService,
    private sessionService: SessionService,
    private confirmationDialogService: ConfirmationDialogService,
  ) {

    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.user = this.sessionService.getUser();
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas')?.classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');

    if ((!body!.classList.contains('sidebar-toggle-display')) && (!body!.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;

      if (this.iconOnlyToggled) {
        body!.classList.add('sidebar-icon-only');
      } else {
        body!.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;

      if (this.sidebarToggled) {
        body!.classList.add('sidebar-hidden');
      } else {
        body!.classList.remove('sidebar-hidden');
      }
    }
  }

  signOut() {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to signout?')
      .then((confirmed) => {
        if (confirmed) {
          this.authService.signOut();
        }
      })
  }

}
