import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { SessionService } from 'src/app/core/services/session.service';
import { ConfirmationDialogService } from 'src/app/additional/confirmation-dialog/confirmation-dialog.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public dtOptions: DataTables.Settings = {};

  public title: string = 'User';
  public module: string = 'User Management';
  public url: string = 'user-management/user';

  public editFormGroup: FormGroup;
  public addFormGroup: FormGroup;

  public accessRights: any = null;
  public permission: any = null;
  public contents: any = null;
  public viewContent: any = null;
  public viewMode: string = 'view';

  public isStillLoading: boolean = false;
  public isLockUser: boolean = true;

  constructor(
    private mainService: UserService,
    private confirmationDialogService: ConfirmationDialogService,
    private sessionService: SessionService,

    private formBuilder: FormBuilder,
    private router: Router,

    private toastr: ToastrService,
    private modalService: NgbModal,
    private modalConfig: NgbModalConfig
  ) {
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;

    this.accessRights = this.sessionService.getAccessRights();

    this.permission = this.accessRights.role.permissions.find((key: any) => key.submod_id == 1);
  }

  ngOnInit() {
    if (this.accessRights.role.id == 1 || this.permission != undefined) {
      this.isLockUser = false;

      this.fetchClientSide();
      this.dtOptions = {
        order: []
      };
    } else {
      this.router.navigate(['404']);
      return;
    }
  }

  onBack(mode: string) {
    this.viewMode = mode;
  }

  onAdd(form: any) {
    this.addFormGroup = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50), Validators.minLength(5)]],
      username: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirm_password: ['', [Validators.required, Validators.minLength(3)]],
      user_full_name: ['', [Validators.required]],
      user_active_date: ['', [Validators.required]],
      user_inactive_date: [null],
      user_status: [1, [Validators.required]],
      role_id: [2, [Validators.required]],
      created_by: [this.accessRights.user.user_id],
    }, { validators: this.checkPasswords });

    const modal = this.modalService.open(form, { backdrop: 'static' });
  }

  onSaveAdd() {
    if (this.addFormGroup.invalid) {
      this.toastr.error("The input data is invalid. Please check error message");
      return;
    }

    const data = this.addFormGroup.getRawValue();

    const activeDate = data.user_active_date;
    const inactiveDate = data.user_inactive_date;

    if (inactiveDate != null && new Date(activeDate) >= new Date(inactiveDate)) {
      this.toastr.warning('Active date can not greater than Inactive date');
      return;
    }

    this.mainService.unique(`?user_id=${data.user_id}&username=${data.username}&email=${data.email}`).subscribe(uniqueRes => {
      if (!uniqueRes.status) {
        this.toastr.warning(uniqueRes.message);
        return;
      }

      this.mainService.add(data).subscribe(addRes => {
        this.modalService.dismissAll();

        if (addRes.status) {
          this.toastr.success(addRes.message);
          this.fetchClientSide();
        }
      });
    });
  }

  onEdit(form: any, id: number) {
    this.editFormGroup = this.formBuilder.group({
      user_id: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50), Validators.minLength(5)]],
      username: ['', [Validators.required, Validators.maxLength(25), Validators.minLength(3)]],
      password: ['', [Validators.minLength(3)]],
      confirm_password: ['', [Validators.minLength(3)]],
      user_full_name: ['', [Validators.required]],
      user_active_date: ['', [Validators.required]],
      user_inactive_date: [null],
      user_status: ['', [Validators.required]],
      role_id: ['', [Validators.required]],
      updated_by: [''],
    }, { validators: this.checkPasswords });

    let row = this.contents.find((row: any) => row.user_id == id);

    row.updated_by = this.accessRights.user.user_id;

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

    const data = this.editFormGroup.getRawValue();

    const activeDate = data.user_active_date;
    const inactiveDate = data.user_inactive_date;

    if (inactiveDate != null && new Date(activeDate) >= new Date(inactiveDate)) {
      this.toastr.warning('Active date can not greater than Inactive date');
      return;
    }

    this.mainService.unique(`?user_id=${data.user_id}&username=${data.username}&email=${data.email}`).subscribe(uniqueRes => {
      if (!uniqueRes.status) {
        this.toastr.warning(uniqueRes.message);
        return;
      }

      this.mainService.update(data).subscribe(updateRes => {
        this.modalService.dismissAll();

        if (updateRes.status) {
          this.toastr.success(updateRes.message);
          this.fetchClientSide();
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

        this.mainService.delete(`?user_id=${id}&deleted_by=${this.accessRights.user.user_id}`).subscribe(res => {

          if (res.status) {
            this.toastr.success(res.message);
            this.fetchClientSide();
          }
        });
      })
      .catch();
  }

  fetchClientSide() {
    this.isStillLoading = true;

    let args: null | any = this.accessRights.role.id == 1 ? null : `?user_id=${this.accessRights.user.user_id}`;

    this.mainService.list(args).subscribe(res => {
      this.isStillLoading = false;

      if (!res.status) {
        this.toastr.error(res.message);
        this.contents = null;
        return;
      }

      this.toastr.success('Successfully load data.');
      this.contents = res.data;
    });
  }

  checkPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirm_password')?.value;

    return pass === confirmPass ? null : { notConfirmed: true }
  }

  // passwordConfirming(c: AbstractControl): { invalid: boolean } { // just working on FormControl
  //   if (c.get('password').value !== c.get('confirm_password').value) {
  //     return { invalid: true };
  //   }
  // }

}
