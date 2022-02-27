import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { debounceTime, distinctUntilChanged, startWith, tap, delay, catchError, finalize, map } from 'rxjs/operators';
import { merge, fromEvent, throwError, Observable } from 'rxjs';
import { NgbModal, NgbModalConfig, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { TableService } from 'src/app/core/services/table.service';
import { SessionService } from 'src/app/core/services/session.service';
import { ConfirmationDialogService } from 'src/app/additional/confirmation-dialog/confirmation-dialog.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { GroupService } from 'src/app/services/group.service';
import { Employee } from "src/app/models/employee";

const now = new Date();

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [DatePipe]
})
export class EmployeeComponent implements OnInit, AfterViewInit {

  @ViewChild('filter', { static: true }) filter?: ElementRef;

  public minDate: NgbDateStruct = { year: now.getFullYear() - 65, month: now.getMonth() + 1, day: now.getDate() }
  public maxDate: NgbDateStruct = { year: now.getFullYear() - 15, month: now.getMonth() + 1, day: now.getDate() }

  public title: string = 'Employee';
  public module: string = 'Employee Management';
  public url: string = 'employee-management/employee';

  public editFormGroup: FormGroup;
  public addFormGroup: FormGroup;

  public groups: any = null;
  public accessRights: any = null;
  public permission: any = null;
  public contents: any = [];
  public viewContent: any = null;
  public viewMode: string = 'view';

  public isStillLoading: boolean = false;
  public isLockUser: boolean = true;

  constructor(
    private mainService: EmployeeService,
    private groupService: GroupService,
    private confirmationDialogService: ConfirmationDialogService,
    private sessionService: SessionService,
    public tableService: TableService,

    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,

    private toastr: ToastrService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;

    this.tableService.setFieldSort("employee_full_name");
    this.tableService.initSearchKey({ "search": ["_search"] });
    this.tableService.setPageSize(10);
    this.tableService.setSearchParam("");

    this.accessRights = this.sessionService.getAccessRights();

    this.permission = this.accessRights.role.permissions.find((key: any) => key.submod_id == 4);
  }

  ngOnInit() {
    if (this.accessRights.role.id == 1 || this.permission != undefined) {
      this.isLockUser = false;

      this.loadRequiredData();
      this.fetchServerSide();
    } else {
      this.router.navigate(['404']);
      return;
    }
  }

  ngAfterViewInit() {
    this.onSearch();
  }

  loadRequiredData() {
    this.groupService.list().subscribe(res => {
      if (!res.status) {
        this.toastr.error(res.message);
        this.groups = null;
        return;
      }

      this.groups = res.data;
    });
  }

  onBack(mode: string) {
    this.viewMode = mode;
  }

  onAdd(form: any) {
    this.addFormGroup = this.formBuilder.group({
      group_id: ['', [Validators.required]],
      employee_code: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      employee_first_name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      employee_last_name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      employee_birth_date: ['', [Validators.required]],
      employee_email_private: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.email]],
      employee_basic_salary: ['', [Validators.required, Validators.maxLength(10), Validators.min(1), Validators.pattern("^[0-9]*$")]],
      employee_description: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      created_by: [this.accessRights.user.user_id],
    });

    const modal = this.modalService.open(form, { backdrop: 'static' });
  }

  onSaveAdd() {
    if (this.addFormGroup.invalid) {
      this.toastr.error("The input data is invalid. Please check error message");
      return;
    }

    const data: Employee = this.addFormGroup.getRawValue();

    data.employee_birth_date = this.datePipe.transform(
      new Date(data.employee_birth_date.year, data.employee_birth_date.month - 1, data.employee_birth_date.day),
      "yyyy-MM-dd");

    this.mainService.unique(`?employee_id=${data.employee_id}&employee_code=${data.employee_code}`).subscribe(uniqueRes => {
      if (!uniqueRes.status) {
        this.toastr.warning(uniqueRes.message);
        return;
      }

      this.mainService.add(data).subscribe(addRes => {
        this.modalService.dismissAll();

        if (addRes.status) {
          this.toastr.success(addRes.message);
          this.fetchServerSide();
        }
      });
    });
  }

  onEdit(form: any, id: number) {
    this.editFormGroup = this.formBuilder.group({
      employee_id: ['', [Validators.required]],
      group_id: ['', [Validators.required]],
      employee_code: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      employee_first_name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      employee_last_name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      employee_birth_date: ['', [Validators.required]],
      employee_email_private: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(3), Validators.email]],
      employee_basic_salary: ['', [Validators.required, Validators.maxLength(10), Validators.min(1), Validators.pattern("^[0-9]*$")]],
      employee_description: ['', [Validators.required, Validators.maxLength(255), Validators.minLength(3)]],
      updated_by: [''],
    });

    let row = { ...this.contents.find((row: any) => row.employee_id == id) };

    row.updated_by = this.accessRights.user.user_id;
    row.employeeBirthDateView = row.employee_birth_date;

    const date = new Date(row.employee_birth_date);
    const employeeBirthDate: NgbDateStruct = { "year": date.getFullYear(), "month": date.getMonth() + 1, "day": date.getDate() };

    row.employee_birth_date = employeeBirthDate;

    this.viewContent = row;
    this.editFormGroup.patchValue(row);

    this.modalService.open(form, { backdrop: 'static' }).result.then((result) => {
      this.viewMode = 'view';
    }, (reason) => {
      this.viewMode = 'view';
    });
  }

  onSaveEdit() {
    if (this.editFormGroup.invalid) {
      this.toastr.error("The input data is invalid. Please check error message");
      return;
    }

    const data: Employee = this.editFormGroup.getRawValue();

    data.employee_birth_date = this.datePipe.transform(
      new Date(data.employee_birth_date.year, data.employee_birth_date.month - 1, data.employee_birth_date.day),
      "yyyy-MM-dd");

    this.mainService.unique(`?employee_id=${data.employee_id}&employee_code=${data.employee_code}`).subscribe(uniqueRes => {
      if (!uniqueRes.status) {
        this.toastr.warning(uniqueRes.message);
        return;
      }

      this.mainService.update(data).subscribe(updateRes => {
        this.modalService.dismissAll();

        if (updateRes.status) {
          this.toastr.success(updateRes.message);
          this.fetchServerSide();
        }
      });
    });
  }

  onDelete(id: number) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete this data?')
      .then((confirmed) => {
        if (!confirmed) {
          this.confirmationDialogService.dismiss();
          return;
        }

        this.modalService.dismissAll();

        this.mainService.delete(`?employee_id=${id}&deleted_by=${this.accessRights.user.user_id}`).subscribe(res => {

          if (res.status) {
            this.toastr.success(res.message);
            this.fetchServerSide();
          }
        });
      })
      .catch();
  }

  fetchServerSide(filter?: string) {
    this.isStillLoading = true;

    const completeParams = this.tableService.getWhereStatement(`?`);

    this.mainService.list(completeParams).subscribe(res => {
      this.isStillLoading = false;

      if (!res.status) {
        this.contents = [];
        this.toastr.error(res.message);
        return;
      }

      this.toastr.success('Successfully load data.');

      this.contents = res.data;

      this.tableService.setDocumentSize(this.mainService.extraData("documentSize"));
    });
  }

  onLength(field: any): void {
    this.tableService.setPageSize(parseInt(field.target.value));

    this.fetchServerSide();
  }

  onSort(field: string): void {
    this.tableService.setFieldSort(field);

    if (!this.tableService.sorting(this.contents)) {
      this.fetchServerSide();
    }
  }

  onChangePage(event: any): void {
    this.tableService.setPageNumber(parseInt(event));
    this.fetchServerSide();
  }

  onSearch() {
    const obs = fromEvent(this.filter?.nativeElement, 'keyup')
      .pipe(debounceTime(500))
      .subscribe((res: any) => {
        this.tableService.setPageNumber(1);
        this.tableService.setSearchParam({ _search: (res.target as HTMLInputElement).value });

        this.fetchServerSide()
      });
  }

}
