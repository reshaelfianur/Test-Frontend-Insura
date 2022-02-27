import { Component, OnInit } from '@angular/core';

import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public userManagement: boolean = false;
  public employeeManagement: boolean = false;

  public isAdmin: boolean = false;
  public isStillLoading: boolean = true;

  public accessModules: AccessModuleObject = {};
  public accessSubModules: AccessSubModuleObject = {};

  public accessRights: any;
  public user: any;

  constructor(private sessionService: SessionService) { }

  ngOnInit() {
    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .app-item').forEach(function (el) {

      el.addEventListener('mouseover', function () {
        if (body!.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body!.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });

    this.user = this.sessionService.getUser();
    this.accessRights = this.sessionService.getAccessRights();

    this.isStillLoading = false;

    if (this.user.user_id == 1) {
      this.isAdmin = true;
    }

    for (const i of this.accessRights.access_module) {
      this.accessModules[i.mod_id] = i.am_rights == 1 ? true : false;
    }

    for (const i of this.accessRights.role.permissions) {
      this.accessSubModules[i.submod_id] = true;
    }
  }
}

interface AccessModuleObject {
  [key: string]: any
}
interface AccessSubModuleObject {
  [key: string]: any
}