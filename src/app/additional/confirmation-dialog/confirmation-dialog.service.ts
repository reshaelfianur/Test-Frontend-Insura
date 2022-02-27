import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfirmationDialogComponent } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {

  public modalRef: any;

  constructor(private modalService: NgbModal) { }

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' | 'md' = 'md'): Promise<boolean> {
    this.modalRef = this.modalService.open(ConfirmationDialogComponent, { size: dialogSize, backdrop: 'static', centered: true });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.message = message;
    this.modalRef.componentInstance.btnOkText = btnOkText;
    this.modalRef.componentInstance.btnCancelText = btnCancelText;

    return this.modalRef.result;
  }

  public dismiss() {
    this.modalRef.dismiss();
  }
}
