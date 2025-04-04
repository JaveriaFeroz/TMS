import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute,Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { forkJoin } from 'rxjs';
import { RecipientService } from '../../common/recipient/recipient.service';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { FormSubmissionDialogService } from '../../helper/formsubmissionDialog/formsubmission-dialog.service';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AuthService } from '../../helper/service/auth.service';  
import { agToasterService } from '../../helper/service/toaster.service';
import { Submission } from '../../helper/submission';
import { WF_ClientRate } from './wf_clientrate';
import { WF_ClientRateService } from './wf_clientrate.service';

@Component({
  selector: 'app-wf_clientrate',
  templateUrl: './wf_clientrate.component.html',
  styleUrls: ['./wf_clientrate.component.css']
})

export class WF_ClientRateComponent implements OnInit {
  // #region form variables
  myForm: boolean = false;
  public goDedicatedRent: GridOptions;
  public goDedicatedVar: GridOptions;
  public goDedicatedKM: GridOptions;
  public goDedicatedToll: GridOptions;
  public goDetention: GridOptions;
  public goHandling: GridOptions;
  public goKLTon: GridOptions;
  public goTrip: GridOptions;
  public goTripTon: GridOptions;
  readonly optionName: string = 'Client Rate Setup Request';
  frmWFClientRate: FormGroup;
  dedicatedRentData: any[];
  dedicatedVarData: any[];
  dedicatedKMData: any[];
  dedicatedTollData: any[];
  detentionData: any[];
  handlingData: any[];
  tripData: any[];
  tripTonData: any[];
  klTonData: any[];
  lstRateType: any[];
  lstClient: any[];
  lstInvoiceMode: any[];
  lstWayType: any = [
    { id: 1, name: 'One Way' },
    { id: 2, name: 'Two Way' },
  ];
  errors: string[] = [];
  currentUserId: string;
  footer: agFooter = new agFooter();
  submissionButtonsStatus = "";
  minDate = new Date().setDate(new Date().getDate() - 365);
  maxDate = new Date().setDate(new Date().getDate() + 730);
  frameworkComponents = { 'agDateEditor': agGridDateEditor }
  @ViewChild('formId', { static: true }) formId: ElementRef;
  @ViewChild('clientId', { static: true }) clientId: MatSelect;
  @ViewChild('btnEdit', { static: true }) btnEdit: HTMLButtonElement;
  targetNode: Node;
  config = { childList: true, subtree: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (<HTMLInputElement>document.getElementById('btnEdit')).disabled === false) {
          mutation.addedNodes[0].disabled = true;
        }
      }
    }
  };
  observer = new MutationObserver(this.callback);

  readonly colSearch =
    [
      { headerName: 'Id', field: 'formId', width: 70 },
      { headerName: 'Client Name', field: 'clientName' },
      { headerName: 'State', field: 'stateName' },
    ];
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private route: ActivatedRoute,
    private svcWFClientRate: WF_ClientRateService, private svcToaster: agToasterService, private Enum: AgilityEnum,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private svcAuth: AuthService,
    private svcHistoryDlg: HistoryDialogService, private svcRecipient: RecipientService, private svcSubmission: FormSubmissionDialogService) {
    this.loadLookup();
    this.initGrid();
    this.currentUserId = svcAuth.getUserId();
    var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
    if (_formid > 0) {
      this.get(_formid)
      this.myForm = true;
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngOnInit() {
    this.frmWFClientRate = this.formbulider.group({
      formId: [null],
      clientId: [null, [Validators.required]],
      rateTypeId: [null, [Validators.required]],
      invoiceModeId: [null, [Validators.required]],
      waiverTon: [null],
      maxInvAmount: [null],
      maxShipmentsPerInvoice: [null],
      detGraceHrs: [null],
      detGraceHRsFromRWB: [null],
      invoiceByRoute: [null],
      invoiceByCategory: [null],
      invoiceByOrigin: [null],
      separateDetInv: [null],
      separateOtherChgsInv: [null],
      validateRoute: [null],
      validateVehicle: [null],
      consigneeMandatory: [null],
      categoryMandatory: [null],
      productMandatory: [null],
      invMandatoryOnPoD: [null],
      oBDMandatoryOnPoD: [null],
      shipmentNoMandatoryOnPoD: [null],
      allowZeroRate: [null],
      stateId: [null],
      stateName: [null],
      owner: [null],
      completed: [null],
    });
    this.frmWFClientRate.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.frmWFClientRate.patchValue({ stateId: 0, stateName: 'New', completed: false });
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divHToolbar');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmWFClientRate.reset();
    this.frmWFClientRate.enable();
    this.frmWFClientRate.controls.formId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmWFClientRate.patchValue({
      stateId: 0, completed: false, stateName: "New", owner: this.svcAuth.getUserId(), maxInvAmount: 0, maxShipmentsPerInvoice: 0,
      waiverTon: 0, detGraceHrs:0, detGraceHRsFromRWB: false, invoiceByRoute: false, invoiceByOrigin: false, invoiceByCategory: false, separateDetInv: false,
      separateOtherChgsInv: false, validateRoute: false, validateVehicle: false, categoryMandatory: false, productMandatory: false,
      invMandatoryOnPoD: false, oBDMandatoryOnPoD: false, shipmentNoMandatoryOnPoD: false, allowZeroRate: false,
    });
    this.footer.createdBy = this.svcAuth.getUserId();
    this.clientId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWFClientRate.getClientRates().subscribe(r => {
        this.svcSearchDlg.open("Search & Select WIP Client Rate", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.formId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbRecall() {
    this.initForm();
    this.frmWFClientRate.controls.formId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.formId.nativeElement.focus();
  }

  tbEdit() {
    this.frmWFClientRate.enable();
    this.frmWFClientRate.controls.clientId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    var formData = this.frmWFClientRate.getRawValue();
    if (formData.rateTypeId != null) {
      this.frmWFClientRate.controls.invoiceModeId.disable();
      this.frmWFClientRate.controls.rateTypeId.disable();
    }
    if (formData.stateId > 1) {
      this.frmWFClientRate.controls.showPreviousRate.disable();
    }
    agFormHelper.setGridStatus(true);
    agFormHelper.setGridToolbar(true);
    this.setActionBarVisibility(agFormMode.Initialize);
  }

  tbSave() {
    try {
      this.frmWFClientRate.markAllAsTouched();
      if (!this.frmWFClientRate.invalid) {
        var formData: WF_ClientRate = this.frmWFClientRate.getRawValue();
        switch (formData.rateTypeId) {
          case 0:
            formData.dedicatedRents = this.getDedicatedRentFromGrid();
            formData.dedicatedVariables = this.getDedicatedVariableFromGrid();
            formData.dedicatedKMs = this.getDedicatedKMFromGrid();
            formData.dedicatedTollTax = this.getDedicatedTollFromGrid();
            break;
          case 1:
            formData.trips = this.getTripFromGrid();
            formData.detentions = this.getDetentionFromGrid();
            break;
          case 3:
            formData.tripTonSlabs = this.getTripTonFromGrid();
            formData.detentions = this.getDetentionFromGrid();
            break;
          case 6:
            formData.freightKLTons = this.getKLTonFromGrid();
            formData.detentions = this.getDetentionFromGrid();
        }
        formData.handling = this.getHandlingFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcWFClientRate.save(formData).subscribe(
            data => {
              this.svcToaster.showSuccess('Client Rate Request # ' + data.formId + ' saved Successfully, click submit to progress this request further in the workflow!');
              this.get(data.formId);
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
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else {
      this.initForm();
      agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
  }

  tbExit() {
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else
      this.router.navigate(['/MainForm']);
  }

  tbHistory(formId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(AgilityEnum.WorkFlow.RateSetup, formId).subscribe(r => {
        this.svcHistoryDlg.open("Rate Request # " + formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions

  //#region FormSubmission - to be reviewed later
  tbFormSubmission(formId: number, stateId: number) {
    this.svcWaitDlg.open({});
    let recipients, nextStateId, submission: Submission = new Submission();
    return new Promise((resolve, reject) => {
      try {
        if (stateId == 2 || stateId == 5) {
          recipients = this.svcRecipient.getClientRates(formId, stateId);
        }
        else {
          recipients = this.svcRecipient.getOwner(AgilityEnum.WorkFlow.RateSetup, formId);
        }        
        forkJoin([recipients]).subscribe(results => {
          var data = results[0];

          if (stateId == 4 || stateId == 99) {           
            recipients = data["recipient"];
            nextStateId = stateId;
          }
          else {
            recipients = data["recipient"];
            nextStateId = data["nextState"];
          }
          if (recipients === undefined || recipients.length == 0) {
            this.svcToaster.showWarning("No submission user(s) are configured for current State of this Form. " +
              "Submission process can not continue while users are missing.");
            this.svcWaitDlg.close();
            return;
          }
          else {
            this.svcSubmission.open("Client Rate Setup Request # " + formId, AgilityEnum.getClientRateState(nextStateId), recipients);
            this.svcSubmission.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  submission.formId = formId;
                  submission.comments = r.SubmissionComment;
                  submission.owner = r.recipientId;
                  submission.stateId = nextStateId;
                  this.submit(submission);
                }
                else {
                  this.svcToaster.showWarning("No submission user selected. Please select user to try again. " +
                    "Submission process can not be executed while submission users are missing");
                  return;
                }
              }
            },
              error => { this.svcWaitDlg.close(); this.svcToaster.showFailure(error); },
              () => { this.svcWaitDlg.close(); this.svcSubmission.close(); }
            );
          }
        }, error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); });
        resolve(true);
      }
      catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); reject(e); }
    });
  }

  submit(sub: Submission) {
    if (sub.stateId == 3) {
      sub.completed = true;
      sub.approved = true;
    }
    else if (sub.stateId == 4 || sub.stateId == 99) {
      sub.completed = true;
      sub.rejected = true;
      sub.approved = false;
    }
    this.svcWFClientRate.submit(sub).subscribe(
      () => {
        this.svcToaster.showSuccess('Client Rate Request # ' + sub.formId +
          ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments))
        this.initForm();
        this.router.navigate(['/MainForm']);
      },
      error => { this.svcToaster.showFailure(error); },
      () => { }
    );
  }
  //#endregion FormSubmission

  //#region grid setup
  //#region dedicated rent Grid Definition & functions
  colDedicatedRent = [
    {
      headerName: 'Fixed Monthly Rental',
      children: [
        {
          headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Vehicle #", field: "vehicleId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Asset', class: "85" }, valueFormatter: agGridHelper.getAssetName, width: 85
        },
        {
          headerName: "Vehicle Group", field: "vehicleGroupId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'VehicleGroup', class: "160" }, valueFormatter: agGridHelper.getVehicleGroupName, width: 160
        },
        {
          headerName: "Monthly Chgs", field: "amount", type: "numericColumn", width: 120,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddDR = function () {
    try {
      var res = this.goDedicatedRent.api.applyTransaction({
        add: [{
          fromDate: null, assetId: null, vehicleGroupId: null, amount: 0, add: true, edit: false, delete: false
        }]
      });
      this.goDedicatedRent.api.getDisplayedRowAtIndex(res.add[0].rowIndex).setSelected(true);
      this.goDedicatedRent.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure('Add Line: ', exception, 'error');
    }
  };

  onDeleteDR() {
    try {
      if (this.goDedicatedRent.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDedicatedRent.api.getSelectedRows().filter(y => !y.delete).forEach(x => x.delete = true);
          this.goDedicatedRent.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goDedicatedRent.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Error');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line Item: ');
    }
  };

  getDedicatedRentFromGrid() {
    let rowData = [];
    this.goDedicatedRent.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region dedicated variable Grid Definition & functions
  colDedicatedVar = [
    {
      headerName: 'Variable Charges (Running)',
      children: [
        { headerName: "Eff Date", field: "fromDate", width: 80, cellEditor: 'agDateEditor', valueFormatter: agGridHelper.dateFormatter },
        {
          headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'VehicleCapacity', class: "125" }, valueFormatter: agGridHelper.getCapacityName, width: 125
        },
        {
          headerName: "Std KM?", field: "applyStdKM", width: 80, editable: false,
          cellRenderer: params => {
            if (params.value) {
              return "<input type='checkbox' checked />";
            }
            else {
              return "<input type='checkbox'/>";
            }
          },
          cellEditor: agGridHelper.getCellCheckBox()
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 70,
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddDV = function () {
    try {
      var res = this.goDedicatedVar.api.applyTransaction({
        add: [{
          fromDate: null, capacityId: null, applyStdKM: false, rate: 0, add: true, edit: false, delete: false
        }]
      });
      this.goDedicatedVar.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure('Add Line: ', exception, 'error');
    }
  };

  onDeleteDV() {
    try {
      if (this.goDedicatedVar.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDedicatedVar.api.getSelectedRows().forEach(x => x.delete = true);
          this.goDedicatedVar.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goDedicatedVar.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line Item:');
    }
  };

  getDedicatedVariableFromGrid() {
    let rowData = [];
    this.goDedicatedVar.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region dedicated KMs Grid Definition & functions
  colDedicatedKM = [
    {
      headerName: 'Route-wise Agreed Distance',
      children: [
        {
          headerName: "Route", field: "routeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Route', class: "125" }, valueFormatter: agGridHelper.getRouteName, width: 125
        },
        {
          headerName: "Route Group", field: "routeGroupId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'RouteGroup', class: "140" }, valueFormatter: agGridHelper.getRouteGroupName, width: 140
        },
        {
          headerName: "Dist(KM)", field: "distance", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddDKM = function () {
    try {
      var res = this.goDedicatedKM.api.applyTransaction({
        add: [{
          routeId: null, routeGroupId: null, distance: 0, add: true, edit: false, delete: false
        }]
      });
      this.goDedicatedKM.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "routeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure('Add Line: ', exception, 'error');
    }
  };

  onDeleteDKM() {
    try {
      if (this.goDedicatedKM.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDedicatedKM.api.getSelectedRows().forEach(x => x.delete = true);
          this.goDedicatedKM.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goDedicatedKM.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line Item: ');
    }
  };

  getDedicatedKMFromGrid() {
    let rowData = [];
    this.goDedicatedKM.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region dedicated Tolltax Grid Definition & functions
  colDedicatedToll = [
    {
      headerName: 'Fixed Agreed Toll Tax',
      children: [
        {
          headerName: "Eff Date", field: "fromDate", width: 75, cellEditor: 'agDateEditor', valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Toll/KM", field: "tollPerKM", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 70,
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddToll = function () {
    try {
      var res = this.goDedicatedToll.api.applyTransaction({
        add: [{
          fromDate: null, tollPerKM: 0, add: true, edit: false, delete: false
        }]
      });
      this.goDedicatedToll.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line:');
    }
  };

  onDeleteToll() {
    try {
      if (this.goDedicatedToll.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDedicatedToll.api.getSelectedRows().forEach(x => x.delete = true);
          this.goDedicatedToll.api.onFilterChanged();//getFilterInstance('delete').onAnyFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goDedicatedToll.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line Item:');
    }
  };

  getDedicatedTollFromGrid() {
    let rowData = [];
    this.goDedicatedToll.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Detention Grid Definition & functions
  colDetention = [
    {
      headerName: 'Detention Charges',
      children: [
        { headerName: "Eff Date", field: "fromDate", width: 85, cellEditor: 'agDateEditor', valueFormatter: agGridHelper.dateFormatter },
        {
          headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper.getCapacityName, width: 140
        },
        {
          headerName: "Det Slab", field: "detentionId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Detention', class: "125" }, valueFormatter: agGridHelper.getDetentionName, width: 125
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100, headerTooltip: "Loading Charges"
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddDetention = function () {
    try {
      var res = this.goDetention.api.applyTransaction({
        add: [{
          fromDate: null, capacityId: null, detentionId: null, amount: 0, add: true, edit: false, delete: false
        }]
      });
      this.goDetention.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Detention Line: ');
    }
  };

  onDeleteDetention = function () {
    try {
      if (this.goDetention.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDetention.api.getSelectedRows().forEach(x => x.delete = true);
          this.goDetention.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goDetention.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Detention error:');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
    }
  };

  getDetentionFromGrid() {
    let rowData = [];
    this.goDetention.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Handling Grid Definition & functions
  colHandling = [
    {
      headerName: 'Handling Charges',
      children: [
        { headerName: "Eff Date", field: "fromDate", width: 85, cellEditor: 'agDateEditor', valueFormatter: agGridHelper.dateFormatter },
        {
          headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper.getCapacityName, width: 140
        },
        {
          headerName: "Ldg Chgs", field: "loadingChgs", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100, headerTooltip: "Loading Charges"
        },
        {
          headerName: "Off Ldg Chgs", field: "offLoadingChgs", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 125, headerTooltip: "Off Loading Charges"
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddHandling = function () {
    try {
      var res = this.goHandling.api.applyTransaction({
        add: [{
          fromDate: null, capacityId: null, loadingChgs: 0, offLoadingChgs: 0, add: true, edit: false, delete: false
        }]
      });
      this.goHandling.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line Error: ');
    }
  };

  onDeleteHandling = function () {
    try {
      if (this.goHandling.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goHandling.api.getSelectedRows().forEach(x => x.delete = true);
          this.goHandling.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goHandling.api);
      }
      else
        this.svcToaster.showFailure('', 'No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
    }
  };

  getHandlingFromGrid() {
    let rowData = [];
    this.goHandling.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Trip basis Grid Definition & functions
  colTrip = [
    {
      headerName: 'Trip Charges',
      children: [
        {
          headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Route", field: "routeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Route', class: "140" }, valueFormatter: agGridHelper.getRouteName, width: 140
        },
        {
          headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper.getCapacityName, width: 140
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 70,
        },
        {
          headerName: "Rate (ex)", field: "rateExWtKg", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 90, headerTooltip: "Rate/Kg for excess weight"
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddTrip = function () {
    try {
      var res = this.goTrip.api.applyTransaction({
        add: [{
          fromDate: null, routeId: null, capacityId: null, rate: 0, rateExWtKg: 0, add: true, edit: false, delete: false
        }]
      });
      this.goTrip.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Trip Charges Line: ');
    }
  };

  onDeleteTrip = function () {
    try {
      if (this.goTrip.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goTrip.api.getSelectedRows().forEach(x => x.delete = true);
          this.goTrip.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goTrip.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
    }
  };

  getTripFromGrid() {
    let rowData = [];
    this.goTrip.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Trip Tonnage Definition & functions
  colTripTon = [
    {
      headerName: 'Trip Charges',
      children: [
        {
          headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Route", field: "routeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Route', class: "140" }, valueFormatter: agGridHelper.getRouteName, width: 140
        },
        {
          headerName: "Capacity", field: "capacityId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'VehicleCapacity', class: "140" }, valueFormatter: agGridHelper.getCapacityName, width: 140
        },
        {
          headerName: "Way Type", field: "wayTypeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'WayType', class: "100" }, valueFormatter: agGridHelper.getWayTypeName, width: 100
        },
        {
          headerName: "Wt. From", field: "weightFrom", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100,
        },
        {
          headerName: "Wt. To", field: "weightTo", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100,
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 70,
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddTripTon = function () {
    try {
      var res = this.goTripTon.api.applyTransaction({
        add: [{
          fromDate: null, routeId: null, capcityId: null, wayTypeId: 1, weightFrom: 0, weightTo: 0,
          rate: 0, add: true, edit: false, delete: false
        }]
      });
      this.goTripTon.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line Trip Ton: ');
    }
  };

  onDeleteTripTon = function () {
    try {
      if (this.goTripTon.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goTripTon.api.getSelectedRows().forEach(x => x.delete = true);
          this.goTripTon.api.onFilterChanged();
        }
        agGridHelper.setGridDeleteFilter(this.goTripTon.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Trip Ton');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete Line Item: ');
    }
  };

  getTripTonFromGrid() {
    let rowData = [];
    this.goTripTon.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region Freight KL Ton Grid Definition & functions
  colKLTon = [
    {
      headerName: 'Charges By Freight Type',
      children: [
        {
          headerName: "Eff Date", field: "fromDate", width: 90, cellEditor: 'agDateEditor',
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Route", field: "routeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Route', class: "140" }, valueFormatter: agGridHelper.getRouteName, width: 140
        },
        {
          headerName: "Frt. Type", field: "freightTypeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'FreightType', class: "140" }, valueFormatter: agGridHelper.getFreightTypeName, width: 140
        },
        {
          headerName: "Rate/Ton", field: "tonRate", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 90,
        },
        { headerName: "A", field: "action", width: 40, filter: false, editable: false },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true },
        { headerName: "DetailId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "CDetailId", field: "cdetailId", hide: true, suppressColumnsToolPanel: true }]
    }
  ];

  onAddKLTon = function () {
    try {
      var res = this.goKLTon.api.applyTransaction({
        add: [{
          fromDate: null, routeId: null, freightTypeId: null, tonRate: 0, add: true, edit: false, delete: false
        }]
      });
      this.goKLTon.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add KL Ton Row');
    }
  };

  onDeleteKLTon = function () {
    try {
      if (this.goKLTon.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goKLTon.api.getSelectedRows().forEach(x => x.delete = true);
          //this.goKLTon.api.onFilterChanged();
          agGridHelper.setGridDeleteFilter(this.goKLTon.api);
        }
        //agGridHelper.setGridDeleteFilter(this.goKLTon.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'error');
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Delete KL Ton Row:');
    }
  };

  getKLTonFromGrid() {
    let rowData = [];
    this.goKLTon.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  initGrid() {
    this.goDedicatedRent = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.cdetailId == null)
          params.data.add = true;
        if (params.colDef.field == "vehicleId") {
          params.node.setDataValue("vehicleId", parseInt(params.data.vehicleId));
        }
        if (params.colDef.field == "vehicleGroupId") {
          params.node.setDataValue("vehicleGroupId", parseInt(params.data.vehicleGroupId));
        }
      },
    };

    this.goDedicatedVar = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "capacityId") {
          params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
        }
      },
    };

    this.goDedicatedKM = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "routeId") {
          if (params.data.routeId != "") {
            params.node.setDataValue("routeId", parseInt(params.data.routeId));
          }
          else {
            params.node.setDataValue("routeId", 0);
          }          
        }
        //if (params.colDef.field == "consigneeId") {
        //  params.node.setDataValue("consigneeId", parseInt(params.data.vehicleGroupId));
        //}
        if (params.colDef.field == "routeGroupId") {
          if (params.data.routeId != "") {
            params.node.setDataValue("routeGroupId", parseInt(params.data.routeGroupId));
          }
          else {
            params.node.setDataValue("routeGroupId", 0);
          }
        }
      },
    };

    this.goDedicatedToll = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
      },
    };

    this.goHandling = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color':'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "capacityId") {
          params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
        }
      },
      onRowDataChanged: () => {
        //this grid is common among all rate types that's grid status is called from this grid as it will be loaded anyway
        agFormHelper.setGridToolbar(false);
        agFormHelper.setGridStatus(false);
      }
    };

    this.goTrip = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "routeId") {
          params.node.setDataValue("routeId", parseInt(params.data.routeId));
        }
        if (params.colDef.field == "capacityId") {
          params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
        }         
      },
    };

    this.goDetention = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "capacityId") {
          params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
        }
        if (params.colDef.field == "detentionId") {
          params.node.setDataValue("detentionId", parseInt(params.data.detentionId));
        }
      },
    };

    this.goTripTon = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "routeId") {
          params.node.setDataValue("routeId", parseInt(params.data.routeId));
        }
        if (params.colDef.field == "capacityId") {
          params.node.setDataValue("capacityId", parseInt(params.data.capacityId));
        }
        if (params.colDef.field == "wayTypeId") {
          params.node.setDataValue("wayTypeId", parseInt(params.data.wayTypeId));
        }
       
      },
    };

    this.goKLTon = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowRateRowEdit.bind(this),
        sortable: true,
        filter: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.data.action === "D") {
          return { 'background-color': 'red', 'color': 'white', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.data.detailId != 0 && !params.data.add)
          params.data.edit = true;
        if (params.data.detailId == null)
          params.data.add = true;
        if (params.colDef.field == "routeId") {
          params.node.setDataValue("routeId", parseInt(params.data.routeId));
        }
        if (params.colDef.field == "freightTypeId") {
          params.node.setDataValue("freightTypeId", parseInt(params.data.freightTypeId));
        }
      },
    };
  }

  validateGridStatus() {
    var rd = this.isReadOnly();
    agFormHelper.setGridStatus(!rd);
    agFormHelper.setGridToolbar(!rd);
  }
  //#endregion

  //#region local functions
  get(id: number) {
    try {
      this.svcWFClientRate.get(id).subscribe(
        cr => {
          if (cr) {
            this.setFormData(cr);
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
            this.disableSave();
          }
          else {          
            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
          }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcWFClientRate.getLookup().subscribe(
        data => {
          this.lstRateType = data.lstRateType;
          this.lstClient = data.lstClient;
          this.lstInvoiceMode = data.lstInvoiceMode;
          sessionStorage.setItem("lstRoute", JSON.stringify(data.lstRoute));
          sessionStorage.setItem("lstAsset", JSON.stringify(data.lstAsset));
          sessionStorage.setItem("lstVehicleGroup", JSON.stringify(data.lstVehicleGroup));
          sessionStorage.setItem("lstRouteGroup", JSON.stringify(data.lstRouteGroup));
          sessionStorage.setItem("lstCapacity", JSON.stringify(data.lstCapacity));
          sessionStorage.setItem("lstWayType", JSON.stringify(this.lstWayType));
          sessionStorage.setItem("lstDetention", JSON.stringify(data.lstDetention));
          sessionStorage.setItem("lstFreightType", JSON.stringify(data.lstFreightType));
        },
        error => {
          this.svcToaster.showFailure(error);
        },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  //validation to be applied for multiple keys later
  private validate(cr: WF_ClientRate) {
    this.errors = [];
    if (cr.completed || (cr.stateName != 'New' && cr.stateName != 'Saved') || cr.owner != cr.footer.createdBy || cr.owner != this.svcAuth.getUserId()) {
      this.errors.push('No further changes can be made to this Client Rate at this stage!');
    }

    if (cr.invoiceByCategory && !cr.categoryMandatory) {
      this.errors.push('To enable category wise invoice, it is required that you also keep category field mandatory on RWB');
    }
    else if (cr.rateTypeId > 0 && (cr.validateVehicle)) {
      this.errors.push('Validation flag for Vehicle could only be turned on for Rate Type Dedicated Fleet');
    }
    else if (cr.rateTypeId != 3 && (cr.allowZeroRate)) {
      this.errors.push('Zero Rate could only be turned on for Rate Type Charge on Trip & Tonnage');
    }

    if (cr.rateTypeId == 0) {
      if (cr.dedicatedRents.filter(x => !x.delete).length == 0) {
        this.errors.push('Atleast one entry must exist in Fixed Monthly Rental grid to perform save operation');
      }
      else if (cr.dedicatedVariables.filter(x => !x.delete).length == 0) {
        this.errors.push('Atleast one entry must exist in Fixed Monthly variable charges grid to perform save operation');
      }
      else if (cr.dedicatedRents.some(x => !x.delete && x.amount < 0)) {
        this.errors.push('No rental in Fixed Montly Rent can contain less than zero values');
      }

      else if (cr.dedicatedVariables.filter(x => !x.delete).length > 0) {
        var valueArr = cr.dedicatedVariables.filter(x => !x.delete).map(function (item) { return item.fromDate })
        var isDuplicate = valueArr.some(function (item, idx) {
          return valueArr.indexOf(item) != idx
        });
        if (isDuplicate) {
          this.errors.push('Effective Date Must be unique in Fixed Montly Variable');
        }

        else if (cr.dedicatedVariables.some(x => !x.delete && x.rate <= 0)) {
          this.errors.push('Rate Per KM for Fixed Montly Variable can not contain zero or less values');
        }
      }

      else if (cr.dedicatedKMs.filter(x => !x.delete).length > 0) {
        var valueArrN = cr.dedicatedKMs.filter(x => !x.delete).map(function (item) { return item.routeId })
        var isDuplicate = valueArrN.some(function (item, idx) {
          return valueArrN.indexOf(item) != idx
        });
        if (isDuplicate) {
          this.errors.push('Route Must be unique in Fixed Montly Distance');
        }

        else if (cr.dedicatedKMs.some(x => !x.delete && x.distance <= 0)) {
          this.errors.push('Distance in Fixed Montly Distance Grid can not contain zero or less values');
        }
      }

      else if (cr.dedicatedRents.filter(x => !x.delete).length > 0) {
        //var valueArr = cr.trips.filter(x => !x.delete).map(function (item) { return item.fromDate })
        //var isDuplicate = valueArr.some(function (item, idx) {
        //  return valueArr.indexOf(item) != idx
        //});
        //if (isDuplicate) {
        //  this.errors.push('Effective Date Must be unique in Trip Charges');
        //}

        var drDuplicate = cr.dedicatedRents.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, vehicleId: item.vehicleId })).slice().sort();
        for (var i = 0; i < drDuplicate.length - 1; i++) {
          if (drDuplicate[i + 1]['fromDate'] === drDuplicate[i]['fromDate']) {
            if (drDuplicate[i + 1]['vehicleId'] === drDuplicate[i]['vehicleId']) {
              {
                this.errors.push('Dedicated Rent charges must be unique for specific effective date and Asset!');
                i = drDuplicate.length;
              }
            }
          }

          if (cr.dedicatedRents.some(x => !x.delete && (!x.vehicleId))) {
            this.errors.push('Please select valid vehicle for each entry in Dedicated Rent');
          }
        }
      }
    }

    else if (cr.rateTypeId == 1) {
      if (cr.trips.filter(x => !x.delete).length == 0) {
        this.errors.push('Atleast one entry must exist in Trip charges grid to perform save operation');
      }
      else if (cr.trips.filter(x => !x.delete).length > 0) {
        //var valueArr = cr.trips.filter(x => !x.delete).map(function (item) { return item.fromDate })
        //var isDuplicate = valueArr.some(function (item, idx) {
        //  return valueArr.indexOf(item) != idx
        //});
        //if (isDuplicate) {
        //  this.errors.push('Effective Date Must be unique in Trip Charges');
        //}

        var tDuplicate = cr.trips.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, routeId: item.routeId, capacityId: item.capacityId })).slice().sort();
        for (var i = 0; i < tDuplicate.length - 1; i++) {
          if (tDuplicate[i + 1]['fromDate'] === tDuplicate[i]['fromDate']) {
            if (tDuplicate[i + 1]['routeId'] === tDuplicate[i]['routeId']) {
              if (tDuplicate[i + 1]['capacityId'] === tDuplicate[i]['capacityId']) {
                this.errors.push('Trip Charges charges must be unique for specific effective date, route and Capacity!');
                i = tDuplicate.length;
              }
            }
          }
        }

        if (cr.trips.some(x => !x.delete && (x.rate <= 0 || x.rateExWtKg < 0))) {
          this.errors.push('Rate in Trip Charges can not contain zero or less values');
        }
        if (cr.trips.some(x => !x.delete && (!x.routeId || !x.capacityId))) {
          this.errors.push('Please select valid Route and vehicle Capacity for each entry in Trip Charges');
        }
      }      
    }

    else if (cr.rateTypeId == 3) {
      if (cr.tripTonSlabs.filter(x => !x.delete).length == 0) {
        this.errors.push('Atleast one entry must exist in Trip & Tonnage grid to perform save operation');
      }
      if (cr.tripTonSlabs.filter(x => !x.delete).length > 0) {
        //var valueArr = cr.tripTonSlabs.filter(x => !x.delete).map(function (item) { return item.fromDate })
        //var isDuplicate = valueArr.some(function (item, idx) {
        //  return valueArr.indexOf(item) != idx
        //});
        //if (isDuplicate) {
        //  this.errors.push('Effective Date Must be unique in Trip Tonnage Charges');
        //}

        var ttDuplicate = cr.tripTonSlabs.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, routeId: item.routeId, capacityId: item.capacityId })).slice().sort();
        for (var i = 0; i < ttDuplicate.length - 1; i++) {
          if (ttDuplicate[i + 1]['fromDate'] === ttDuplicate[i]['fromDate']) {
            if (ttDuplicate[i + 1]['routeId'] === ttDuplicate[i]['routeId']) {
              if (ttDuplicate[i + 1]['capacityId'] === ttDuplicate[i]['capacityId']) {
                this.errors.push('Freight KL/KM charges must be unique for specific effective date, route and Capacity!');
                i = ttDuplicate.length;
              }              
            }
          }
        }

        if (cr.tripTonSlabs.some(x => !x.delete && (x.weightFrom < 0 || x.weightTo <= 0 || x.rate <= 0))) {
          this.errors.push('Weight & Rate can not contain zero or less values in Trip &B Tonnage charges grid');
        }
        if (cr.tripTonSlabs.some(x => !x.delete && x.weightFrom > x.weightTo)) {
          this.errors.push('Weight From must be same or lesser than Weight To Trip &B Tonnage charges grid');
        }
        if (cr.tripTonSlabs.some(x => !x.delete && (!x.routeId || !x.capacityId || !x.wayTypeId))) {
          this.errors.push('Route, Vehicle capacity and Way Type is mandatory for Trip Tonnage Charges');
        }
      }
      
    }

    else if (cr.rateTypeId == 6) {
      if (cr.freightKLTons.filter(x => !x.delete).length == 0 ) {
        this.errors.push('Atleast one entry must exist in Freight KL/KM charges grid to perform save operation');
      }
      if (cr.freightKLTons.filter(x => !x.delete).length > 0) {     
        //var valueArr = cr.freightKLTons.filter(x => !x.delete).map(function (item) { return item.fromDate })
        //var isDuplicate = valueArr.some(function (item, idx) {
        //  return valueArr.indexOf(item) != idx
        //});
        //if (isDuplicate) {
        //  this.errors.push('Effective Date Must be unique in Freight KL/KM charges Grid');
        //}

        var fDuplicate = cr.freightKLTons.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, routeId: item.routeId })).slice().sort();
        for (var i = 0; i < fDuplicate.length - 1; i++) {
          if (fDuplicate[i + 1]['fromDate'] === fDuplicate[i]['fromDate']) {
            if (fDuplicate[i + 1]['routeId'] === fDuplicate[i]['routeId']) { 
              this.errors.push('Freight KL/KM charges must be unique for specific effective date and route!');
              i = fDuplicate.length;
            }
          }
        }

        if (cr.freightKLTons.some(x => !x.delete && x.tonRate <= 0)) {
          this.errors.push('No row in freight KL/KM charges can contain zero or less values in Rate');
        }
        else if (cr.freightKLTons.some(x => !x.delete && !x.routeId)) {
          this.errors.push('Selection of route is mandatory for each line item of Freight KL/KM charges grid');
        }
      }
      
    }

    //#region detention
    else if (cr.rateTypeId !=0) {
      if (cr.detentions.length != 0) {
        if (cr.detentions.some(x => !x.delete && (!x.detentionId || !x.capacityId))) {
          this.errors.push('Detention Type & Vehicle Capacity can not be blank');
        }
        if (cr.detentions.some(x => !x.delete && x.amount <= 0)) {
          this.errors.push('Detention Charges can not contain zero or less values');
        }

        if (cr.detentions.filter(x => !x.delete).length > 0) {
          var detDuplicate = cr.detentions.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, capacityId: item.capacityId, detentionId: item.detentionId })).slice().sort();
          for (var i = 0; i < detDuplicate.length - 1; i++) {
            if (detDuplicate[i + 1]['fromDate'] === detDuplicate[i]['fromDate']) {
              if (detDuplicate[i + 1]['capacityId'] === detDuplicate[i]['capacityId']) {
                if (detDuplicate[i + 1]['detentionId'] === detDuplicate[i]['detentionId']) {
                  this.errors.push('Detention slabs must be unique for specific effective date and vehicle capacity!');
                  i = detDuplicate.length;
                }
              }
            }
          }
        }
      }

    }
   
    
    //#endregion detention

    //#region handling
    if (cr.handling.length != 0) {
      if (cr.handling.some(x => !x.delete && (!x.capacityId))) {
        this.errors.push('Vehicle Capacity can not be blank for handling data');
      }

      if (cr.handling.some(x => !x.delete && (x.loadingChgs < 0 || x.offLoadingChgs < 0 || (x.loadingChgs == 0 && x.offLoadingChgs == 0)))) {
        this.errors.push('Loading & Offloading charges can not contain zero or less than zero values');
      }

      if (cr.handling.filter(x => !x.delete).length > 0) {
        var hdlgDuplicate = cr.handling.filter(x => !x.delete).map(item => ({ fromDate: item.fromDate, capacityId: item.capacityId })).slice().sort();
        for (var i = 0; i < hdlgDuplicate.length - 1; i++) {
          if (hdlgDuplicate[i + 1]['fromDate'] === hdlgDuplicate[i]['fromDate']) {
            if (hdlgDuplicate[i + 1]['capacityId'] === hdlgDuplicate[i]['capacityId']) {
              this.errors.push('Handling entry must be unique for specific effective date and vehicle capacity!');
              i = hdlgDuplicate.length;
            }
          }
        }
      }
    }
    
    //#endregion
  }

  getExistingRate(event) {
    var clientId = event.value;
    this.svcWaitDlg.open({});
    try {
      this.svcWFClientRate.getExistingRate(clientId).subscribe(
        cr => {
          if (cr.inProcessForm) {
            this.svcToaster.showWarning("Client Rates Setup request is already in process for selected Client. Only one request could be active for one client at a time.");
            this.initForm();
            this.frmWFClientRate.controls['clientId'].setValue(clientId);
            //this.frmWFClientRate.controls["clientId"].setValue(null);
          }
          else {
            this.setFormData(cr, true);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
        },
        error => {
          this.svcToaster.showFailure(error);
        },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private initForm() {
    this.frmWFClientRate.reset();
    this.frmWFClientRate.disable();
    this.errors = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
    this.dedicatedVarData = [];
    this.dedicatedRentData = [];
    this.dedicatedKMData = [];
    this.dedicatedTollData = [];
    this.handlingData = [];
    this.tripData = [];
    this.detentionData = [];
    this.tripTonData = [];
    this.klTonData = [];
    this.footer = new agFooter();
    this.myForm = false;
  }

  private setActionBarVisibility(formMode: agFormMode) {
    this.submissionButtonsStatus = (formMode != agFormMode.ReadOnly && formMode != agFormMode.Review) ? "disabled" : "";
  }

  private isReadOnly() {
    return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
  }

  private disableSave() {
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  private setFormData(cr: WF_ClientRate, recall: boolean = false) {
    if (!recall) {
      this.frmWFClientRate.disable();
      this.frmWFClientRate.controls['formId'].setValue(cr.formId);
      this.frmWFClientRate.controls['clientId'].setValue(cr.clientId);
    }   
    this.frmWFClientRate.controls['rateTypeId'].setValue(cr.rateTypeId);
    if (cr.rateTypeId != null) {
      this.frmWFClientRate.get('rateTypeId').disable();
    }
    this.frmWFClientRate.controls['invoiceModeId'].setValue(cr.invoiceModeId);
    this.frmWFClientRate.controls['waiverTon'].setValue(cr.waiverTon);
    this.frmWFClientRate.controls['maxInvAmount'].setValue(cr.maxInvAmount);
    this.frmWFClientRate.controls['maxShipmentsPerInvoice'].setValue(cr.maxShipmentsPerInvoice);
    this.frmWFClientRate.controls['detGraceHrs'].setValue(cr.detGraceHrs);
    this.frmWFClientRate.controls['detGraceHRsFromRWB'].setValue(cr.detGraceHRsFromRWB);
    this.frmWFClientRate.controls['invoiceByRoute'].setValue(cr.invoiceByRoute);
    this.frmWFClientRate.controls['invoiceByCategory'].setValue(cr.invoiceByCategory);
    this.frmWFClientRate.controls['invoiceByOrigin'].setValue(cr.invoiceByOrigin);
    this.frmWFClientRate.controls['separateDetInv'].setValue(cr.separateDetInv);
    this.frmWFClientRate.controls['separateOtherChgsInv'].setValue(cr.separateOtherChgsInv);
    this.frmWFClientRate.controls['validateRoute'].setValue(cr.validateRoute);
    this.frmWFClientRate.controls['validateVehicle'].setValue(cr.validateVehicle);
    this.frmWFClientRate.controls['categoryMandatory'].setValue(cr.categoryMandatory);
    this.frmWFClientRate.controls['productMandatory'].setValue(cr.productMandatory);
    this.frmWFClientRate.controls['invMandatoryOnPoD'].setValue(cr.invMandatoryOnPoD);
    this.frmWFClientRate.controls['oBDMandatoryOnPoD'].setValue(cr.oBDMandatoryOnPoD);
    this.frmWFClientRate.controls['shipmentNoMandatoryOnPoD'].setValue(cr.shipmentNoMandatoryOnPoD);
    this.frmWFClientRate.controls['allowZeroRate'].setValue(cr.allowZeroRate);
    if (!cr.stateId) {
      this.frmWFClientRate.controls['stateId'].setValue(0);
      this.frmWFClientRate.controls['stateName'].setValue(AgilityEnum.getClientRateState(0));
      this.frmWFClientRate.controls['completed'].setValue(false);
    }
    else {
      this.frmWFClientRate.controls['stateId'].setValue(cr.stateId);
      this.frmWFClientRate.controls['stateName'].setValue(cr.stateName); /*.stateName = this.Enum.RateStatus(cr.stateId);*/
      this.frmWFClientRate.controls['owner'].setValue(cr.owner);
      this.frmWFClientRate.controls['completed'].setValue(cr.completed);
    }
    switch (cr.rateTypeId) {
      case 0:
        this.dedicatedRentData = cr.dedicatedRents;
        this.dedicatedVarData = cr.dedicatedVariables;
        this.dedicatedKMData = cr.dedicatedKMs;
        this.dedicatedTollData = cr.dedicatedTollTax;
        break;
      case 1:
        this.tripData = cr.trips;
        this.detentionData = cr.detentions;
        break;
      case 3:
        this.tripTonData = cr.tripTonSlabs;
        this.detentionData = cr.detentions;
        break;
      case 6:
        this.klTonData = cr.freightKLTons;
        this.detentionData = cr.detentions;
        break;
    }
    this.handlingData = cr.handling;
    if (cr.formId != null) {
      this.footer = cr.footer;
    }
    else {
      this.footer.createdBy = this.svcAuth.getUserId();
    }    
  }
  //#endregion local functions
}
