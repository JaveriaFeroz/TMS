import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Region } from './region';
import { RegionService } from './region.service';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.css']
})

export class RegionComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Region';
  readonly colSearch =
    [
      { headerName: 'Region Id', field: 'regionId', width: 70 },
      { headerName: 'Region Name', field: 'regionName', },
      { headerName: 'Is Active', field: 'isActive', },
    ];
  //#endregion
  frmRegion: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('regionName', { static: true }) regionName: ElementRef;
  @ViewChild('regionId', { static: true }) regionId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcRegion: RegionService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmRegion = this.formbulider.group({
      regionId: [null, [Validators.required]],
      regionName: [null, [Validators.required]],
      taxRate: [null, [Validators.required]],      
      isActive: [null],
    });
    this.frmRegion.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmRegion.reset();
    this.frmRegion.enable();
    this.frmRegion.controls.regionId.disable();
    this.frmRegion.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.regionName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmRegion.controls.regionId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.regionId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRegion.getRegions().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Region", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.regionId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmRegion.enable();
    this.frmRegion.controls.regionId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.regionName.nativeElement.focus();
  }
 
  tbSave() {
    try {
      this.frmRegion.markAllAsTouched();
      if (!this.frmRegion.invalid) {
        this.svcWaitDlg.open({});
        var formData: Region = this.frmRegion.getRawValue();
        formData.footer = this.footer;
        this.svcRegion.save(formData).subscribe(
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
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcRegion.get(Id).subscribe(
        region => {
          if (region) {
            this.frmRegion.disable();
            this.frmRegion.controls['regionId'].setValue(region.regionId);
            this.frmRegion.controls['regionName'].setValue(region.regionName);
            this.frmRegion.controls['taxRate'].setValue(region.taxRate);
            this.frmRegion.controls['isActive'].setValue(region.isActive);  
            this.footer = region.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmRegion.reset();    
    this.frmRegion.disable();
    this.footer = new agFooter()
  }
  //#endregion local functions
}
