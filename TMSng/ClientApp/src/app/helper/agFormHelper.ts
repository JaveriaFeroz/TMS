import { Injectable } from '@angular/core';
import { agToasterService } from './service/toaster.service';

export enum agFormMode { Initialize, Add, Edit, Recall, ReadOnly, Review }

@Injectable({ providedIn: 'root' })
export class agFormHelper {
  constructor(private svcToaster: agToasterService) { }

  static setFormControls(optionName, formMode: agFormMode) {  
    
    var data = JSON.parse(sessionStorage.getItem("UserAccess")).find(o => o.optionName == optionName);
    if (data) {
      var canAdd = data.canAdd; var canEdit = data.canEdit;
      if (document.getElementById('btnAdd') as HTMLInputElement != null) {
        (document.getElementById('btnAdd') as HTMLInputElement).disabled = !canAdd || formMode != agFormMode.Initialize;
      }
      if (document.getElementById('btnEdit') as HTMLInputElement != null) {
        (document.getElementById('btnEdit') as HTMLInputElement).disabled = !canEdit || formMode != agFormMode.ReadOnly;
      }
      if (document.getElementById('btnSave') as HTMLInputElement != null) {
        (document.getElementById('btnSave') as HTMLInputElement).disabled = (formMode != agFormMode.Edit || !canEdit) && formMode != agFormMode.Add;
      }

      if (formMode != agFormMode.Initialize) {
        if (document.getElementById('btnSearch') != null) {
          (document.getElementById('btnSearch') as HTMLInputElement).disabled = true;
        }
        (document.getElementById('btnUndo') as HTMLInputElement).disabled = false;
      }
      else {
        if (document.getElementById('btnSearch') != null) {
          (document.getElementById('btnSearch') as HTMLInputElement).disabled = false;
        }
        (document.getElementById('btnUndo') as HTMLInputElement).disabled = true;
      }
      if (document.getElementById('btnRecall') != null) {
        (document.getElementById('btnRecall') as HTMLInputElement).disabled = formMode != agFormMode.Initialize;
      }
      (document.getElementById('btnExit') as HTMLInputElement).disabled = (formMode != agFormMode.Initialize) && (formMode != agFormMode.Review);
      if (formMode == agFormMode.ReadOnly) {
        if (document.getElementById('btnEdit') as HTMLInputElement)
          document.getElementById('btnEdit').focus();
      }

      //if (formMode == agFormMode.Add || formMode == agFormMode.Edit) {
      //  $("#divMain div[class*='ag-root-wrapper']").removeClass('ag-disabled');
      //}
    }
    else {
      if (document.getElementById('btnAdd') as HTMLInputElement)
        (document.getElementById('btnAdd') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnEdit') as HTMLInputElement)
        (document.getElementById('btnEdit') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnDelete') as HTMLInputElement)
        (document.getElementById('btnDelete') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnSave') as HTMLInputElement)
        (document.getElementById('btnSave') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnRecall') as HTMLInputElement)
        (document.getElementById('btnRecall') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnSearch') as HTMLInputElement)
        (document.getElementById('btnSearch') as HTMLInputElement).disabled = true;
    }
  }

  static setGridToolbar(enable: boolean) {
    document.querySelectorAll('[id^="tbGrid"]').forEach(x => x.querySelectorAll("button").forEach((a) => {
      if (enable) {
        a.removeAttribute('disabled');
      }
      else if (!a.hasAttribute('disabled')) {
        a.setAttribute('disabled', 'true');
      }
    }));
    //if (document.getElementById('tbGrid') as HTMLDivElement != null) {     
    //  var div: HTMLDivElement = document.getElementById('tbGrid') as HTMLDivElement;     
    //  var buttons = div.querySelectorAll("button");
    //  buttons.forEach((a) => {
      //  if (enable) {
      //    a.removeAttribute('disabled');       
      //  }
      //  else if (!a.hasAttribute('disabled')) {
      //    a.setAttribute('disabled', 'true');         
      //  }
      //});
    //}
  }

  static setGridStatus(enable: boolean = true) {
    if (enable)
      document.querySelectorAll('[id^="grd"]').forEach(x => x.classList.remove('ag-disabled'));
    else
      document.querySelectorAll('[id^="grd"]:not([class~="ag-disabled"])').forEach(x => x.classList.add('ag-disabled'));
  }

  static setFormSearch(enable: boolean) {
    if (document.getElementById('tbSearch') as HTMLDivElement != null) {
      var div: HTMLDivElement = document.getElementById('tbSearch') as HTMLDivElement;
      var buttons = div.querySelectorAll("button");
      buttons.forEach((a) => {
        if (enable) {
          a.removeAttribute('disabled');
        }
        else if (!a.hasAttribute('disabled')) {
          a.setAttribute('disabled', 'true');
        }
      });
    }
  }

  static setFormSubmissionControls(formMode: agFormMode) {
    if (formMode == agFormMode.ReadOnly || formMode == agFormMode.Review) {
      if (document.getElementById('btnHistory') as HTMLInputElement)
        (document.getElementById('btnHistory') as HTMLInputElement).disabled = false;
      if (document.getElementById('btnTransfer') as HTMLInputElement != null)
        (<HTMLInputElement>document.getElementById("btnTransfer")).disabled = false;
      if (document.getElementById('btnReceived') as HTMLInputElement != null)
        (<HTMLInputElement>document.getElementById("btnReceived")).disabled = false;
    }   
    else {
      if (document.getElementById('btnHistory') as HTMLInputElement)
          (document.getElementById('btnHistory') as HTMLInputElement).disabled = true;
      if (document.getElementById('btnTransfer') as HTMLInputElement != null)
        (<HTMLInputElement>document.getElementById("btnTransfer")).disabled = true;
      if (document.getElementById('btnReceived') as HTMLInputElement != null)
        (<HTMLInputElement>document.getElementById("btnReceived")).disabled = true;
    }
  }

  static currentCompany(): number {
    return Number(sessionStorage.getItem("CompanyId"));
  }

  static enableGL(): boolean{
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.enableGL;
  }

  static enablePartialDelivery(): boolean {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.enablePartialDelivery;
  }

  static arId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.arAccountId;
  }

  static arPeriodId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.arPeriodId;
  }

  static apId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.apAccountId;
  }

  static apPeriodId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.apPeriodId;
  }

  static glPeriodId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.glPeriodId;
  }

  static opsPeriodId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.opsPeriodId;
  }

  static periodName(): string {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.periodName;
  }

  static advanceACId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.advanceAccountId;
  }

  static bankControlId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.bankAccountId;
  }

  static fuelExpACId(): number {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.fuelExpenseAccountId;
  }

  static IsMandatoryDriver2() {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.isMandatoryDriver2;
  }

  static AllowTrailer() {
    let cc = JSON.parse(sessionStorage.getItem("CompanyConfig"));
    return cc.allowTrailer;
  }

  static getISODate(date: Date): string {
    date = new Date(date);
    return new Date(date.setHours(date.getHours() + (date.getTimezoneOffset() * -1 / 60))).toISOString().split('T')[0];
  }

  static padL(text: string, padChar: string = "0", size: number = 10): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size).toString();
  }
}
