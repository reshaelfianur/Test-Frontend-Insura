import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  // container for fields's current status 1:asc, 0:desc 
  public fieldSorts: any;

  // field key for sorting
  public fieldCurrent: string = "";

  // search page number 1 is initial
  public pageNumber: number = 1;

  // default is 20 document per-page
  public pageSize: number = 20;

  // initial no document
  public documentSize: number = 0;
  public numberOfPages: number = 0;

  public userSearchData: any = null;
  public userSearchKey: any = { search: ['code_regex', 'name_regex'] };

  constructor() {
    this.fieldSorts = new Object();
  }

  public setFieldSort(field: string) {
    this.fieldCurrent = field;

    if (!this.fieldSorts.hasOwnProperty(field)) {
      this.fieldSorts[field] = 1;
      return;
    }

    if (this.fieldSorts[field] == 1) {
      this.fieldSorts[field] = 0;
      return;
    }

    this.fieldSorts[field] = 1;
  }

  public setPageNumber(page: number) {
    this.pageNumber = page;
  }

  public setSearchParam(param: any) {
    this.userSearchData = param;
  }

  public setPageSize(param: any) {
    this.pageSize = param;
  }

  public initSearchKey(param: any) {
    this.userSearchKey = param;
  }

  /*
   * usage on first page of document loading
   */
  public setDocumentSize(size: number) {
    if (this.pageNumber == 1) {
      this.documentSize = size;
      this.numberOfPages = Math.floor((size / this.pageSize) + 1);
    }
  }

  public getNumberOfPages() {
    return this.numberOfPages;
  }

  /*
   * usage by loading
   */
  public getWhereStatement(prefix: string) {
    let regex = "";

    // user provide search data
    if (this.userSearchData != null) {

      // loop for the key
      for (let key in this.userSearchData) {

        if (this.userSearchData[key] == null || this.userSearchData[key] == "") {
          continue;
        }

        // is the is need to replace?
        const replaceKeys = this.userSearchKey[key];

        if (replaceKeys == null) {
          regex += "&" + key + "=" + this.userSearchData[key];
          continue;
        }

        // replace key with the right key(s), possible more than one key
        for (let searchKey of replaceKeys) {
          regex += "&" + searchKey + "=" + this.userSearchData[key];
        }

      }
    }

    return prefix + "_page=" + this.pageNumber + "&_pageSize=" + this.pageSize + "&_sortby=" + this.fieldCurrent + ":" + this.fieldSorts[this.fieldCurrent] + regex;
  }

  /*
   * return document size = number of data in database
   */
  public getDocumentSize() {
    return this.documentSize;
  }

  public isAscSorted(field: string) {
    if (field == this.fieldCurrent && this.fieldSorts[field] == 1) {
      return true;
    }

    return false;
  }

  public isDescSorted(field: string) {
    if (field == this.fieldCurrent && this.fieldSorts[field] == 0) {
      return true;
    }
    return false;
  }

  /*
   * sorting process
   */
  public sorting(data: any[]) {

    // data in database only one page   
    if (this.documentSize > this.pageSize) {
      return false;
    }

    // no sort field yet
    if (this.fieldSorts == undefined) {
      return false;
    }

    // check asc or desc
    if (!this.fieldSorts.hasOwnProperty(this.fieldCurrent)) {
      return false;
    }

    // get sort method
    const sortMethod = this.fieldSorts[this.fieldCurrent];

    // create special field for sort
    for (let item of data) {
      item["sort"] = item[this.fieldCurrent];
    }

    // ascending sort
    if (sortMethod == 1) {
      data.sort(this.compareAsc);
      return true;
    }

    // descending sort
    data.sort(this.compareDesc);
    return true;
  }

  compareAsc(a: any, b: any) {

    if (a["sort"].toLowerCase() < b["sort"].toLowerCase()) {
      return -1;
    }

    if (a["sort"].toLowerCase() > b["sort"].toLowerCase()) {
      return 1;
    }

    return 0;
  }

  compareDesc(a: any, b: any) {
    if (a["sort"].toLowerCase() < b["sort"].toLowerCase()) {
      return 1;
    }

    if (a["sort"].toLowerCase() > b["sort"].toLowerCase()) {
      return -1;
    }

    return 0;
  }
}
