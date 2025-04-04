import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AssetStatus } from './assetstatus';
import { AssetStatusService } from './assetstatus.service';

@Component({  
  selector: 'app-assetstatus',  
  templateUrl: './assetstatus.component.html',  
  styleUrls: ['./assetstatus.component.css']  
})  

export class AssetStatusComponent implements OnInit {
  //public AssetStatuss: AssetStatus;
  //#region constant variables
  readonly optionName: string = 'Change Asset Status';
  readonly colSearch =
    [
      { headerName: 'AssetId', field: 'assetId', width: 70 },
      { headerName: 'AssetNo', field: 'assetNo' },
      { headerName: 'AssetType', field: 'assetTypeName' },
      { headerName: 'IsActive', field: 'isActive' },
    ];
  //#endregion
  frmAssetStatus: any;
  lstAssetType: any;
  lstAssetStatus: any;
  lstNewAssetStatus: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('newstatusId', { static: true }) newstatusId: MatSelect;
  @ViewChild('assetNo', { static: true }) assetNo: ElementRef;

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcAssetStatus: AssetStatusService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.loadLookup();
  }  
  
  ngOnInit() {
    this.frmAssetStatus = this.formbulider.group({
      assetNo: [null, [Validators.required]],
      assetId: [null],
      assetTypeId: [null, [Validators.required]],
      statusId: [null, [Validators.required]],
      newstatusId: [null, [Validators.required]],
      remarks: [null, [Validators.required]]     
    });
    this.frmAssetStatus.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }
  //#region toolbar functions

  //tbAdd() {
  //  this.frmAssetStatus.reset();
  //  this.frmAssetStatus.enable();
  //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
  //  this.assetNo.nativeElement.focus();
  //}

  //tbSearch(): void {
  //  try {
  //    this.svcWaitDlg.open({});
  //    this.assetstatusService.GetList().subscribe(r => {
  //      this.svcSearchDlg.open("Search & Select  Asset", this.colSearch, r);
  //      this.svcSearchDlg.selected().subscribe(r => {
  //        if (r) {
  //          this.get(r.assetNo);
  //        }
  //      });
  //    },
  //      error => { this.svcToaster.showFailure(error); },
  //      () => { this.svcWaitDlg.close(); });
  //  }
  //  catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  //}

  tbRecall() {
    this.initForm();
    this.frmAssetStatus.controls.assetNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.assetNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmAssetStatus.enable();
    this.frmAssetStatus.controls.assetNo.disable();
    this.frmAssetStatus.controls.assetTypeId.disable();
    this.frmAssetStatus.controls.statusId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.newstatusId.focus();
  }

  tbSave() {
    try {
      this.frmAssetStatus.markAllAsTouched();
      if (!this.frmAssetStatus.invalid) {
        var formData: AssetStatus = this.frmAssetStatus.getRawValue();
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcAssetStatus.save(formData.assetId, formData.statusId, formData.newstatusId, formData.remarks).subscribe(
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
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcAssetStatus.get(Id).subscribe(
        assetstatus => {
          if (assetstatus) {
            this.frmAssetStatus.disable();
            this.frmAssetStatus.controls['assetId'].setValue(assetstatus.assetId);
            this.frmAssetStatus.controls['assetNo'].setValue(assetstatus.assetNo);
            this.frmAssetStatus.controls['assetTypeId'].setValue(assetstatus.assetTypeId);
            this.frmAssetStatus.controls['statusId'].setValue(assetstatus.statusId);
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcAssetStatus.getLookup().subscribe(
        data => {
          this.lstAssetType = data.lstAssetType;
          this.lstAssetStatus = data.lstAssetStatus;
          this.lstNewAssetStatus = this.lstAssetStatus.filter(x => x.editable == 1);
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

  private validate(as: AssetStatus) {
    this.errors = [];
    if (as.newstatusId == as.statusId) {
      this.errors.push('Current Status and Changed Status are same. Nothing to Save!');
    }
  }

  private initForm() {
    this.frmAssetStatus.reset();
    this.frmAssetStatus.disable();
    this.errors = [];
  }
  //#endregion local functions
}
