import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { RouteGroup } from './routegroup';
import { RouteGroupService } from './routegroup.service';

@Component({
  selector: 'app-routegroup',
  templateUrl: './routegroup.component.html',
  styleUrls: ['./routegroup.component.css']
})

export class RouteGroupComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Route Group';
  readonly colSearch =
    [
      { headerName: 'Group Id', field: 'routeGroupId', width: 70 },
      { headerName: 'Group Name', field: 'routeGroupName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmRouteGroup: any;
/*  lstRouteGroupType: any;*/
  footer: agFooter = new agFooter();
  @ViewChild('groupName', { static: true }) groupName: ElementRef;
  @ViewChild('groupId', { static: true }) groupId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcRouteGroup: RouteGroupService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmRouteGroup = this.formbulider.group({
      groupId: [null, [Validators.required]],
      groupName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmRouteGroup.disable(); 
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmRouteGroup.reset();
    this.frmRouteGroup.enable();
    this.frmRouteGroup.controls.groupId.disable();
    this.frmRouteGroup.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.groupName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmRouteGroup.controls.groupId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.groupId.nativeElement.focus();
  } 

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRouteGroup.getRouteGroups().subscribe(r => {
        this.svcSearchDlg.open("Search & Select RouteGroup", this.colSearch, r);
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
    this.frmRouteGroup.enable();
    this.frmRouteGroup.controls.groupId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.groupName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmRouteGroup.markAllAsTouched();
      if (!this.frmRouteGroup.invalid) {
        this.svcWaitDlg.open({});
        var formData: RouteGroup = this.frmRouteGroup.getRawValue();
        formData.footer = this.footer;
        this.svcRouteGroup.save(formData).subscribe(
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
      this.svcRouteGroup.get(Id).subscribe(
        routegroup => {
          if (routegroup) {
            this.frmRouteGroup.disable();
            this.frmRouteGroup.controls['groupId'].setValue(routegroup.groupId);
            this.frmRouteGroup.controls['groupName'].setValue(routegroup.groupName);
            this.frmRouteGroup.controls['isActive'].setValue(routegroup.isActive);  
            this.footer = routegroup.footer;
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
    this.frmRouteGroup.reset();    
    this.frmRouteGroup.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
