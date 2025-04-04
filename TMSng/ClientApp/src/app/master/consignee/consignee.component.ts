import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Consignee } from './consignee';
import { ConsigneeService } from './consignee.service';

@Component({
  selector: 'app-consignee',
  templateUrl: './consignee.component.html',
  styleUrls: ['./consignee.component.css']
})

export class ConsigneeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Consignee';
  readonly colSearch =
    [
      { headerName: 'Consignee Id', field: 'consigneeId', width: 70 },
      { headerName: 'Consignee Name', field: 'consigneeName', },
      { headerName: 'Client Name', field: 'clientName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmConsignee: any;
  //lstConsigneeType: any;
  lstCity: any;
  lstClient: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('consigneeName', { static: true }) consigneeName: ElementRef;
  @ViewChild('consigneeId', { static: true }) consigneeId: ElementRef;

  constructor(private consigneer: Router, private formbulider: FormBuilder,
    private svcConsignee: ConsigneeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmConsignee = this.formbulider.group({
      consigneeId: [null, [Validators.required]],
      consigneeName: [null, [Validators.required]],
      isActive: [null],
      cityId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      contactNo: [null, [Validators.required]],
      address: [null, [Validators.required]],
    });
    this.frmConsignee.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmConsignee.reset();
    this.frmConsignee.enable();
    this.frmConsignee.controls.consigneeId.disable();
    this.frmConsignee.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.consigneeName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmConsignee.controls.consigneeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.consigneeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcConsignee.getConsignees().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Consignee", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.consigneeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmConsignee.enable();
    this.frmConsignee.controls.consigneeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.consigneeName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmConsignee.markAllAsTouched();
      if (!this.frmConsignee.invalid) {
        var formData: Consignee = this.frmConsignee.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        else {
          this.svcWaitDlg.open({});
          this.svcConsignee.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Record saved Successfully');
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); }
          );
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.consigneer.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcConsignee.get(Id).subscribe(
        consignee => {
          if (consignee) {
            this.frmConsignee.disable();
            this.frmConsignee.controls['consigneeId'].setValue(consignee.consigneeId);
            this.frmConsignee.controls['consigneeName'].setValue(consignee.consigneeName);
            this.frmConsignee.controls['address'].setValue(consignee.address);
            this.frmConsignee.controls['clientId'].setValue(consignee.clientId);
            this.frmConsignee.controls['contactNo'].setValue(consignee.contactNo);
            this.frmConsignee.controls['cityId'].setValue(consignee.cityId);
            this.frmConsignee.controls['isActive'].setValue(consignee.isActive);  
            this.footer = consignee.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcConsignee.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          this.lstCity = data.lstCity;
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(c: Consignee) {
    this.errors = [];  
    let MobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');

    if (!MobileNo.test(c.contactNo)) {
      this.errors.push('Contact # must be provided in valid format like 9999-9999999');
    }
  }

  private initForm() {
    this.frmConsignee.reset();
    this.errors = [];
    this.frmConsignee.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
