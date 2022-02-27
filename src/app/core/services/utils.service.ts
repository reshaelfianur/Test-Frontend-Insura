import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public checkFormError(form: any) {
    Object.keys(form.controls).forEach(key => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      const controlsArr: ValidationErrors = form.get(key).controls;

      if (controlsArr != null && controlsArr != undefined && Array.isArray(controlsArr)) {
        controlsArr.forEach(function (element, i) {
          Object.keys(controlsArr[i].controls).forEach(keyArr => {
            const controlErrorsArr: ValidationErrors = controlsArr[i].get(keyArr).errors;
            // const controlErrorsArr: ValidationErrors = form.controls[key]['controls'][i]['controls'][keyArr]['errors']

            if (controlErrorsArr != null) {
              Object.keys(controlErrorsArr).forEach(keyErrorArr => {
                console.log('Key control: ' + keyArr + ', Key index: ' + i + ', keyErrorArr: ' + keyErrorArr + ', err value: ', controlErrorsArr[keyErrorArr]);
              });
            }
          });
        });
      }

      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  public stringToNgbDataStruct(date: string): NgbDateStruct {
    const d = new Date(date);
    return { "year": d.getFullYear(), "month": d.getMonth() + 1, "day": d.getDate() };
  }

  public ngbDateStructToString(date: NgbDateStruct): string {
    const d = new Date(date.year, date.month - 1, date.day);
    const dd = new Date(d);
    return dd.toISOString().split('T')[0]
  }

  public getMonthName(key?: any) {

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    if (key) {
      return monthNames[key - 1];
    }

    return monthNames;
  }

  public getMonthNameIndo(key?: any) {

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    if (key) {
      return monthNames[key - 1];
    }

    return monthNames;
  }

  public arrayColumn(array: any[], columnName: string) {
    return array.map((value, index) => {
      return value[columnName];
    })
  }

  public arrayCompare(a1: any[], a2: any[]) {
    if (a1.length != a2.length) return false;
    var length = a2.length;

    for (var i = 0; i < length; i++) {
      if (a1[i] !== a2[i]) return false;
    }
    return true;
  }

  public inArray(needle: any, haystack: any[]) {
    var length = haystack.length;

    for (var i = 0; i < length; i++) {
      if (typeof haystack[i] == 'object') {
        if (this.arrayCompare(haystack[i], needle)) return true;
      } else {
        if (haystack[i] == needle) return true;
      }
    }
    return false;
  }

  public formatDateToDB(date: any) {
    let d = new Date(date);

    return d.toISOString().split('T')[0]
  }

  excelDateToJSDate(excelDate: any) {
    let date = new Date((excelDate - (25567 + 2)) * 86400 * 1000);
    let localTime = new Date(date.getTime() + (new Date()).getTimezoneOffset() * 60000);

    return date.toISOString().split('T')[0]
  }

  public getRamdomString(length: number) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
}
