import { Component, OnInit } from '@angular/core';

import { RoleService } from 'src/app/services/role.service';
import { UserService } from 'src/app/services/user.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { GroupService } from 'src/app/services/group.service';

import { SessionService } from 'src/app/core/services/session.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public users: number = 0;
  public roles: number = 0;
  public employees: number = 0;
  public groups: number = 0;

  public accessRights: any = null;

  constructor(
    private sessionService: SessionService,
    private roleService: RoleService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private groupService: GroupService,
  ) {
    this.accessRights = this.sessionService.getAccessRights();
  }

  ngOnInit(): void {
    this.countGroups();
    this.countEmployees();
    this.countRoles();
    this.countUsers();
  }

  countRoles(): void {
    this.roleService.list().subscribe(respond => {
      if (respond) {
        this.roles = respond.data.length;
      }
    });
  }

  countUsers(): void {
    this.userService.list().subscribe(respond => {
      if (respond) {
        this.users = respond.data.length;
      }
    });
  }

  countGroups(): void {
    this.groupService.list().subscribe(respond => {
      if (respond) {
        this.groups = respond.data.length;
      }
    });
  }

  countEmployees(): void {
    this.employeeService.list().subscribe(respond => {
      if (respond) {
        this.employees = respond.data.length;
      }
    });
  }

}
