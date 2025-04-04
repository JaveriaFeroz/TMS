import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Route } from './route';
import { RouteService } from './route.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})

export class RouteComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Route';
  readonly colSearch =
    [
      { headerName: 'Route Id', field: 'routeId', width: 70 },
      { headerName: 'Route Name', field: 'routeName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmRoute: any;
  lstRouteType: any;
  lstCity: any;
  lstConsignee: any;
  lstShipper: any;
  enablePartialDelivery: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('routeName', { static: true }) routeName: ElementRef;
  @ViewChild('routeId', { static: true }) routeId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcRoute: RouteService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.enablePartialDelivery = agFormHelper.enablePartialDelivery();
  }
 

  ngOnInit() {
    this.frmRoute = this.formbulider.group({
      routeId: [null, [Validators.required]],
      routeName: [null, [Validators.required]],
      originId: [null],
      destinationId: [null],
      consigneeStartPoint: [null],
      consigneeFinishPoint: [null],
      stdKMs: [null, [Validators.required]],
      stdTT: [null, [Validators.required]],
      hillyKMs: [null],
      tollTaxApplicable: [null],
      isActive: [null],
      enablePartialDelivery: [null],
    });
    this.frmRoute.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.frmRoute.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
  }

  //#region toolbar functions
  tbAdd() {
    this.frmRoute.reset();
    this.frmRoute.enable();
    this.frmRoute.controls.routeId.disable();
    this.frmRoute.patchValue({ isActive: true, enablePartialDelivery: this.enablePartialDelivery, tollTaxApplicable:false});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.routeName.nativeElement.focus();

  }

  tbRecall() {
    this.initForm();
    this.frmRoute.controls.routeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.routeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRoute.getRoutes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Route", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.routeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmRoute.enable();
    this.frmRoute.controls.routeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.routeName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmRoute.markAllAsTouched();
      if (!this.frmRoute.invalid) {
        this.svcWaitDlg.open({});
        var formData: Route = this.frmRoute.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcRoute.save(formData).subscribe(
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
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcRoute.get(Id).subscribe(
        route => {
          if (route) {
            this.frmRoute.disable();
            this.frmRoute.controls['routeId'].setValue(route.routeId);
            this.frmRoute.controls['routeName'].setValue(route.routeName);
            this.frmRoute.controls['originId'].setValue(route.originId);
            this.frmRoute.controls['destinationId'].setValue(route.destinationId);
            this.frmRoute.controls['consigneeStartPoint'].setValue(route.consigneeStartPoint);
            this.frmRoute.controls['consigneeFinishPoint'].setValue(route.consigneeFinishPoint);
            this.frmRoute.controls['stdKMs'].setValue(route.stdKMs);
            this.frmRoute.controls['stdTT'].setValue(route.stdTT);
            this.frmRoute.controls['hillyKMs'].setValue(route.hillyKMs);
            this.frmRoute.controls['isActive'].setValue(route.isActive);
            this.frmRoute.controls['tollTaxApplicable'].setValue(route.tollTaxApplicable);
            this.frmRoute.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
            this.footer = route.footer;
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
      this.svcRoute.getLookup().subscribe(
        data => {
          this.lstCity = data.lstCity;
          this.lstConsignee = data.lstConsignee;
          this.lstShipper = data.lstShipper;
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

  private validate(r: Route) {
    this.errors = [];

    if (this.enablePartialDelivery == true) {
      if (r.consigneeStartPoint == null || r.consigneeFinishPoint == null ) {
        this.errors.push('Please Select Start Point/ Finish Point   must have value ');
      }
    }
    else if (this.enablePartialDelivery== false) {
      if (r.originId == null || r.destinationId == null) {
        this.errors.push('Please Select Start Point/ Finish Point   must have value ');
      }
    }
  }

  private initForm() {
    this.frmRoute.reset();
    this.frmRoute.disable();
    this.frmRoute.patchValue({ isActive: true, enablePartialDelivery: this.enablePartialDelivery, tollTaxApplicable: false});   
  }
  //#endregion local functions
}
