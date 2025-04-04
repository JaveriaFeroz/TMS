import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Shipper } from './shipper';
import { ShipperService } from './shipper.service';

@Component({
  selector: 'app-shipper',
  templateUrl: './shipper.component.html',
  styleUrls: ['./shipper.component.css']
})

export class ShipperComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Shipper';
  readonly colSearch =
    [
      { headerName: 'Shipper Id', field: 'shipperId', width: 70 },
      { headerName: 'Shipper Name', field: 'shipperName', },
      { headerName: 'Client Name', field: 'clientName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmShipper: any;
  //lstShipperType: any;
  lstCity: any;
  lstClient: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('shipperName', { static: true }) shipperName: ElementRef;
  @ViewChild('shipperId', { static: true }) shipperId: ElementRef;

  constructor(private shipperr: Router, private formbulider: FormBuilder,
    private svcShipper: ShipperService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmShipper = this.formbulider.group({
      shipperId: [null, [Validators.required]],
      shipperName: [null, [Validators.required]],
      isActive: [null],
      cityId: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      contactNo: [null, [Validators.required]],
      address: [null, [Validators.required]],
    });
    this.frmShipper.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmShipper.reset();
    this.frmShipper.enable();
    this.frmShipper.controls.shipperId.disable();
    this.frmShipper.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.shipperName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmShipper.controls.shipperId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.shipperId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcShipper.getShippers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Shipper", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.shipperId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmShipper.enable();
    this.frmShipper.controls.shipperId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.shipperName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmShipper.markAllAsTouched();
      if (!this.frmShipper.invalid) {
        var formData: Shipper = this.frmShipper.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        else {
          this.svcWaitDlg.open({});
          this.svcShipper.save(formData).subscribe(
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
    this.shipperr.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcShipper.get(Id).subscribe(
        shipper => {
          if (shipper) {
            this.frmShipper.disable();
            this.frmShipper.controls['shipperId'].setValue(shipper.shipperId);
            this.frmShipper.controls['shipperName'].setValue(shipper.shipperName);
            this.frmShipper.controls['address'].setValue(shipper.address);
            this.frmShipper.controls['clientId'].setValue(shipper.clientId);
            this.frmShipper.controls['contactNo'].setValue(shipper.contactNo);
            this.frmShipper.controls['cityId'].setValue(shipper.cityId);
            this.frmShipper.controls['isActive'].setValue(shipper.isActive);  
            this.footer = shipper.footer;
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
      this.svcShipper.getLookup().subscribe(
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

  private validate(s: Shipper) {
    this.errors = [];  
    let reMobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');

    if (!reMobileNo.test(s.contactNo)) {
      this.errors.push('Contact # must be provided in valid format like xxxx-xxxxxxx');
    }
  }

  private initForm() {
    this.frmShipper.reset();
    this.frmShipper.disable();
    this.errors = [];    
    this.footer = new agFooter();
  }
  //#endregion local functions
}
