import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { VehicleGroup } from './vehiclegroup';
import { VehicleGroupService } from './vehiclegroup.service';

@Component({
  selector: 'app-vehiclegroup',
  templateUrl: './vehiclegroup.component.html',
  styleUrls: ['./vehiclegroup.component.css']
})

export class VehicleGroupComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Vehicle Group';
  readonly colSearch =
    [
      { headerName: 'Group Id', field: 'groupId', width: 70 },
      { headerName: 'Group Name', field: 'groupName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmVehicleGroup: any;
  lstVehicleGroupType: any;
  footer: agFooter = new agFooter();
  @ViewChild('groupName', { static: true }) groupName: ElementRef;
  @ViewChild('groupId', { static: true }) groupId: ElementRef;

  constructor(private vehiclegroupr: Router, private formbulider: FormBuilder,
    private svcVehicleGroup: VehicleGroupService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmVehicleGroup = this.formbulider.group({
      groupId: [null, [Validators.required]],
      groupName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmVehicleGroup.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmVehicleGroup.reset();
    this.frmVehicleGroup.enable();
    this.frmVehicleGroup.controls.groupId.disable();
    this.frmVehicleGroup.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.groupName.nativeElement.focus();

  }

  tbRecall() {
    this.initForm();
    this.frmVehicleGroup.controls.groupId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.groupId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcVehicleGroup.getVehicleGroups().subscribe(r => {
        this.svcSearchDlg.open("Search & Select VehicleGroup", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.groupId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmVehicleGroup.enable();
    this.frmVehicleGroup.controls.groupId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.groupName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmVehicleGroup.markAllAsTouched();    
      if (!this.frmVehicleGroup.invalid) {
        this.svcWaitDlg.open({});
        var formData: VehicleGroup = this.frmVehicleGroup.getRawValue();
      formData.footer = this.footer;
      this.svcVehicleGroup.save(formData).subscribe(
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
    this.vehiclegroupr.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcVehicleGroup.get(Id).subscribe(
        vehiclegroup => {
          if (vehiclegroup) {
            this.frmVehicleGroup.disable();
            this.frmVehicleGroup.controls['groupId'].setValue(vehiclegroup.groupId);
            this.frmVehicleGroup.controls['groupName'].setValue(vehiclegroup.groupName);
            this.frmVehicleGroup.controls['isActive'].setValue(vehiclegroup.isActive);  
            this.footer = vehiclegroup.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmVehicleGroup.reset();    
    this.frmVehicleGroup.disable();
  }
  //#endregion local functions
}
