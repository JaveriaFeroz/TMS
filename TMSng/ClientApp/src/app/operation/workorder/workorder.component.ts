import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { forkJoin, Observable } from 'rxjs';
import { Recipient } from '../../common/recipient/recipient';
import { RecipientService } from '../../common/recipient/recipient.service';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { FormSubmissionDialogService } from '../../helper/formsubmissionDialog/formsubmission-dialog.service';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { Submission } from '../../helper/submission';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ServiceRequest } from '../servicerequest/servicerequest';
import { WOEstInventory } from './woestinventory';
import { WOEstOtherCharges } from './woestothercharges';
import { WOInventory } from './woinventory';
import { WOOtherCharges } from './woothercharges';
import { WorkOrder } from './workorder';
import { WorkOrderService } from './workorder.service';

@Component({
  selector: 'app-workorder',
  templateUrl: './workorder.component.html',
  styleUrls: ['./workorder.component.css']
})

export class WorkOrderComponent implements OnInit {
  //#region form variables
  //submission: Submission = new Submission();
  public goEstInventory: GridOptions;
  public goEstOtherChgs: GridOptions;
  public goInventory: GridOptions;
  public goOtherChgs: GridOptions;
  public goWOActivity: GridOptions;
  readonly optionName: string = 'Work Order';
  readonly colSearch =
    [
      { headerName: 'WO #', field: 'woNo' },
      { headerName: 'WO Date', field: 'woDate'  },
      { headerName: 'Asset #', field: 'assetNo' },
      { headerName: 'Priority', field: 'priorityName' },
      { headerName: 'SVR #', field: 'requestId' },
      { headerName: 'Branch', field: 'branchName' },
      { headerName: 'Status', field: 'stateName' }
    ];

  readonly assetColDefs =
    [
      { headerName: 'WO #', field: 'woNo', width: 150 },
      { headerName: 'WODate', field: 'woDate' },
      { headerName: 'SR #', field: 'requestId' },
      { headerName: 'WO Type', field: 'woTypeName' },
      { headerName: 'Status', field: 'stateName' },
      { headerName: 'SR Created By', field: 'createdBy' },
      { headerName: 'MTR Reading', field: 'kMsReading' },
      { headerName: 'Estimates', field: 'estimates' },
      { headerName: 'Details', field: 'activityDetail' },
    ];

  readonly srColDefs =
    [
      { headerName: 'SR #', field: 'requestId' },
      { headerName: 'SR Date', field: 'requestDate'  },
      { headerName: 'Asset #', field: 'vehicleNo' },
      { headerName: 'Priority', field: 'priorityName' },
      { headerName: 'Branch', field: 'branchName' },
      { headerName: 'KM Reading', field: 'kMsReading' },
      { headerName: 'Detail', field: 'detail' },
    ];

  frmWorkOrder: any;
  estInventoryData: WOEstInventory[];
  estOtherChgsData: WOEstOtherCharges[];
  inventoryData:WOInventory[];
  otherChgsData: WOOtherCharges[];
  activityData: any[];
  lstSupplier: any;
  lstBranch: any;
  lstPriority: any;
  lstAsset: any;
  lstWOType: any;
  lstSubCategory: any;
  lstRecipient: any;
  errors: string[] = [];
  currentUserId: string;
  currentUserRoleId: number;
  MinDate = new Date(new Date().getDate() - 30);
  MaxDate = new Date();
  isDisabled = true;
  submissionButtonsStatus = "";
  footer: agFooter = new agFooter();
  @ViewChild('assetId', { static: true }) assetId: MatSelect;
  @ViewChild('woNo', { static: true }) woNo: ElementRef;
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
  //#endregion

  constructor(private route: ActivatedRoute, private router: Router, private formbulider: FormBuilder,
    private svcWO: WorkOrderService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService,
    private svcSearchDlg: SearchDialogService, private svcHistoryDlg: HistoryDialogService,
    private svcRecipient: RecipientService, private svcFormSubmissionDlg: FormSubmissionDialogService,
    private Enum: AgilityEnum, private svcAuth: AuthService) {
    this.currentUserId = svcAuth.getUserId();
    this.currentUserRoleId = parseInt(svcAuth.getUserRole());
    this.loadLookup();
    this.initGrid();
    var _formid = (this.route.snapshot.queryParamMap.get("formId"));
    if (_formid != null) {
      this.get(_formid.toString())
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngOnInit() {
    this.frmWorkOrder = this.formbulider.group({
      woNo: [null, [Validators.required]],
      woId: [null],
      woDate: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      priorityId: [null, [Validators.required]],
      vehicleId: [null, [Validators.required]],
      woTypeId: [null, [Validators.required]],
      requestId: [null, [Validators.required]],
      kMsReading: [null, [Validators.required]],
      estDuration: [null, [Validators.required]],
      activityDetail: [null, [Validators.required]],
      subCategoryId: [null],
      stateName: [null],
      stateId: [0],
      owner: [null],
      completed: [null],
    });
    this.frmWorkOrder.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.setActionBarVisibility(agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    (<HTMLInputElement>document.getElementById("btnSearchSR")).disabled = true;
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divHToolbar');//document.body;//document.getElementById('btnSave') as Node;
    this.observer.observe(this.targetNode, this.config);
    agFormHelper.setGridToolbar(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmWorkOrder.reset();
    this.frmWorkOrder.enable();
    this.frmWorkOrder.controls.woNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmWorkOrder.patchValue({ woDate: new Date(), stateId: 0, completed: false, stateName: "New", owner: this.svcAuth.getUserId() });
    this.frmWorkOrder.controls.requestId.disable();
    this.frmWorkOrder.controls.stateName.disable();
    (<HTMLInputElement>document.getElementById("btnSearchSR")).disabled = false;
    this.footer.createdBy = this.svcAuth.getUserId();
    agFormHelper.setGridToolbar(true);
    this.loadWOActivity();
    this.assetId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmWorkOrder.controls.woNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.woNo.nativeElement.focus();
  }  

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWO.getWorkOrders().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Work Order", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.woNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmWorkOrder.enable();
    this.frmWorkOrder.controls.woNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.setActionBarVisibility(agFormMode.Edit);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.frmWorkOrder.controls.requestId.disable();
    this.frmWorkOrder.controls.stateName.disable();

    if (this.frmWorkOrder.controls.stateId.value >= 2) {
      this.frmWorkOrder.controls.vehicleId.disable();
      this.frmWorkOrder.controls.branchId.disable();
      this.frmWorkOrder.controls.supplierId.disable();
      this.frmWorkOrder.controls.priorityId.disable();
      this.frmWorkOrder.controls.subCategoryId.disable();
      (<HTMLInputElement>document.getElementById("btnSearchSR")).disabled = true;
    }
    this.setActionBarVisibility(agFormMode.Initialize);
    this.assetId.focus();
  }

  tbSave() {
    try {
      this.frmWorkOrder.markAllAsTouched();
      if (!this.frmWorkOrder.invalid) {
        var formData: WorkOrder = this.frmWorkOrder.getRawValue();
        formData.estInventories = this.getEstInventoryFromGrid();
        formData.estOtherChgs = this.getEstOtherChgsFromGrid();
        formData.activities = this.getActivityFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        else {
          this.svcWaitDlg.open({});
          this.svcWO.save(formData).subscribe(
            data => {           
              this.svcToaster.showSuccess('Work Order # ' + data.woNo + ' saved successfully. Press press Submit button to submit request to workshop now!');
              this.frmWorkOrder.controls['woNo'].setValue(data.woNo);
              this.frmWorkOrder.controls['owner'].setValue(data.owner);
              this.frmWorkOrder.controls['woId'].setValue(data.woId);
              this.frmWorkOrder.controls['stateId'].setValue(1);
              this.frmWorkOrder.controls['stateName'].setValue('Saved');
              this.footer.createdBy = data.owner;
              formData.estInventories.forEach(o => { o.add = false, o.edit = false, o.delete=false });
              formData.estOtherChgs.forEach(o => { o.add = false, o.edit = false, o.delete = false });
              this.frmWorkOrder.disable();
              agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
              (<HTMLInputElement>document.getElementById("btnSearchSR")).disabled = true;
              this.setActionBarVisibility(agFormMode.ReadOnly);
              agFormHelper.setGridToolbar(false);
              agFormHelper.setGridStatus(false);
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); }
          );
        }
      }
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    sessionStorage.removeItem("lstProduct");
    sessionStorage.removeItem("lstCharge");
    this.router.navigate(['/MainForm']);
  }

  tbHistory(formid: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(AgilityEnum.WorkFlow.WorkOrder, formid).subscribe(r => {
        this.svcHistoryDlg.open("Work Order" + formid, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbAssetSearch(assetid: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWO.getMaintenaceHistory(assetid).subscribe(r => {
        this.svcHistoryDlg.open("Work Order" + assetid, this.assetColDefs, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbSRSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWO.getServiceRequests().subscribe(r => {
        this.svcSearchDlg.open("Search and Select Service Request", this.srColDefs, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.loadSVRDetail(r);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions

  //#region FormSubmission
  tbFormSubmission(formId: number, stateId: number, woTypeId: number) {
    this.svcWaitDlg.open({});
    let recipients: Observable<Recipient[]>, nextStateId: number;
    return new Promise((resolve, reject) => {
      try {
        
        if (stateId == 2 || stateId == 11 || stateId == 8 || stateId == 5) {
          recipients = this.svcRecipient.getWORecipients(formId, stateId);
        }
        else if (stateId == 4 || stateId == 7) {
          console.log(stateId);
          console.log(AgilityEnum.WorkFlow.WorkOrder);
          console.log(formId);
          recipients = this.svcRecipient.getOwner(AgilityEnum.WorkFlow.WorkOrder, formId);
        }
        //if (stateId == 8) {
        //  recipients = this.svcRecipient.getWorkShopStaffs();
        //}

        forkJoin([recipients]).subscribe(results => {
          var data = results[0];
          recipients = data["recipient"];
          if (stateId == 2 || stateId == 11 || (stateId == 5)) {
            nextStateId = data["nextState"];           
          }
          else {
            if (stateId == 4 || stateId == 7 || (stateId == 8)) {
              nextStateId = stateId;
            }
          }
          if (recipients === undefined || Object.keys(recipients).length == 0) {
            this.svcToaster.showWarning("No submission user is configured for selected Form State." +
              "Submission process can not be executed while submission users are missing" +
              "Please raise Service Request through eForms if you require any support from IT Department");
            this.svcWaitDlg.close();
            return;
          }
          else {
            this.svcFormSubmissionDlg.open(AgilityEnum.getWorkOrderState(nextStateId) + " - WO# " + this.frmWorkOrder.controls.woNo.value,
              AgilityEnum.getWorkOrderState(nextStateId), recipients);
            let sub: Submission = new Submission();
            this.svcFormSubmissionDlg.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  sub.formId = formId;
                  sub.formNo = this.frmWorkOrder.controls.woNo.value;
                  sub.comments = r.submissionComment;
                  sub.owner = r.recipientId;
                  sub.stateId = nextStateId;
                  this.submit(sub);
                }
                else {
                  this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                    "Submission process can not be executed while submission users are missing");
                  return;
                }
              }
            },
              error => { this.svcWaitDlg.close(); this.svcToaster.showFailure(error); },
              () => { this.svcWaitDlg.close();this.svcFormSubmissionDlg.close(); }
            );
          }
        }, () => { }, () => { this.svcWaitDlg.close(); });
        resolve(true);
      }
      catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); reject(e); }
    });
  }

  tbResolve(formId: number, stateId: number, woTypeId: number) {
    let nextStateId, recipients;
    return new Promise((resolve, reject) => {
      try {
        if (stateId == 6) {
          var formData: WorkOrder = this.frmWorkOrder.getRawValue();
          formData.estInventories = this.getEstInventoryFromGrid();
          formData.estOtherChgs = this.getEstOtherChgsFromGrid();
          formData.inventories = this.getInventoryFromGrid();
          formData.otherCharges = this.getOtherChgsFromGrid();
          this.validateActual(formData);
          if (this.errors.length > 0) { return }
          else {
            this.svcWO.saveActual(formData).subscribe(() => {
              formData.inventories.forEach(o => { o.add = false, o.edit = false, o.delete =false });
              formData.otherCharges.forEach(o => { o.add = false, o.edit = false, o.delete = false });
            },
              error => { this.svcToaster.showFailure(error); },
              () => { this.svcWaitDlg.close(); });
          }
          recipients = this.svcRecipient.getWORecipients(formId, stateId);
        }
        forkJoin([recipients]).subscribe(results => {
          var data = results[0];
          recipients = data["recipient"];
          nextStateId = data["nextState"];
          if (recipients == null) {
            this.svcToaster.showWarning("No submission user is configured for selected Form State." +
              "Submission process can not be executed while submission users are missing" +
              "Please raise Service Request through eForms if you require any support from IT Department");
            return;
          }
          else {
            this.svcFormSubmissionDlg.open(AgilityEnum.getWorkOrderState(nextStateId) + " - WO# " + this.frmWorkOrder.controls.woNo.value,
              AgilityEnum.getWorkOrderState(nextStateId), recipients);
            let sub: Submission = new Submission();
            this.svcFormSubmissionDlg.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  sub.formId = formId;
                  sub.formNo = this.frmWorkOrder.controls.woNo.value;
                  sub.comments = r.submissionComment;
                  sub.owner = r.recipientId;
                  sub.stateId = nextStateId;
                  this.submit(sub);
                }
                else {
                  this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                    "Submission process can not be executed while submission users are missing");
                  return;
                }
              }
            },
              error => { this.svcToaster.showFailure(error); },
              () => { this.svcFormSubmissionDlg.close(); }
            );
          }
        });
        resolve(true);
      }
      catch (e) { this.svcToaster.showFailure(e); reject(e); }
    });
  }

  private submit(sub: Submission) {
    if (sub.stateId == 4 || sub.stateId == 7) {
      sub.completed = true;
    }
    this.svcWO.submit(sub).subscribe(
      () => {
        this.svcToaster.showSuccess('Work Order # ' + sub.formNo +
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
  private initGrid() {
    //#region estimated grid options
    this.goEstInventory = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "productId") {
          if (params.data.productId == "") {
            params.node.setDataValue("productId", null);
          }
          else {
            var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
            var product = lstProduct.filter(x=> x.productId == params.data.productId)[0];
            params.node.setDataValue('price', product.purchasePrice);
            params.node.setDataValue('uoMId', product.uomId);
            params.node.setDataValue('uoMName', product.uomName);
            params.node.setDataValue("productId", parseInt(params.data.productId));
          }
        }
      }
    };

    this.goEstOtherChgs = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "chargeId") {
          if (params.data.chargeId != "") {
            params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
          }
          else {
            params.node.setDataValue("chargeId", null);
          }
        }
      }
    };
    //#endregion

    //#region Actual grid options//
    this.goInventory = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "productId") {
          if (params.data.productId == "") {
            params.node.setDataValue("productId", null);
          }
          else {
            var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
            var product = lstProduct.filter(x=> x.productId == params.data.productId)[0];
            params.node.setDataValue('price', product.purchasePrice);
            params.node.setDataValue('uoMName', product.uomName);
            params.node.setDataValue('uoMId', product.uomId);
            params.node.setDataValue("productId", parseInt(params.data.productId));
          }         
        }
      }
    };

    this.goOtherChgs = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "chargeId") {
          if (params.data.chargeId != "") {
            params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
          }
          else {
            params.node.setDataValue("chargeId", null);
          }
        }
      },
    };
    //#endregion

    this.goWOActivity = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'multiple',
      onCellClicked: function (event) {
        if (event.colDef.field == "selected") {
          if (!event.data.selected) {
            event.node.setDataValue('selected', true);
          }
          else {
            event.node.setDataValue('selected', false);
          }
        }
      },
    };
  }

  //#region Estimate grid setup
  //#region estimated inventory Grid Definition & functions
  colEstInv = [
    {
      headerName: 'Estimated Inventory',
      children: [
        {
          headerName: "Product", field: "productId", width: 180, cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Product', class: "180" }, valueFormatter: agGridHelper.getProductName,
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "UoM", field: "uoMName", width: 80, editable: false },
        {
          headerName: "Price", field: "price", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 80, editable: false
        },
        {
          headerName: "Remarks", field: "remarks", width: 240, cellEditor: "agLargeTextCellEditor"
        },
        { headerName: "UoMId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddEstInventory () {
    try {
      var res = this.goEstInventory.api.applyTransaction({
        add: [{
          productId: null, quantity: 0, uoMId: null, price: 0, remarks :null, add: true, edit: false, delete: false
        }]
      });
      this.goEstInventory.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteEstInventory  () {
    try {
      if (this.goEstInventory.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goEstInventory.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goEstInventory.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getEstInventoryFromGrid() {
    let rowData = [];
    this.goEstInventory.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion 

  //#region estimated other charges Grid Definition & functions
  colEstOtherChgs = [
    {
      headerName: 'Estimated Charges',
      children: [
        {
          headerName: "Charge", field: "chargeId", width: 150, cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'WOCharge', class: "150" }, valueFormatter: agGridHelper.getWOChargeName,
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 80
        },
        {
          headerName: "Remarks", field: "remarks", width: 200, cellEditor: "agLargeTextCellEditor"
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddEstOtherCharge  () {
    try {
      var res = this.goEstOtherChgs.api.applyTransaction({
        add: [{
          chargeId: null, quantity: 0, amount: 0, remarks:null,  add: true, edit: false, delete: false
        }]
      });
      this.goEstOtherChgs.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteEstOtherCharge  () {
    try {
      if (this.goEstOtherChgs.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goEstOtherChgs.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goEstOtherChgs.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getEstOtherChgsFromGrid() {
    let rowData = [];
    this.goEstOtherChgs.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion 
  //#endregion

  //#region Actual grid setup
  //#region actual inventory Grid Definition & functions
  colInventory = [
    {
      headerName: 'Actual Inventory',
      children: [
        {
          headerName: "Product", field: "productId", width: 200, cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Product', class: "tb200" }, valueFormatter: agGridHelper.getProductName,
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "UoM", field: "uoMName", width: 80, editable: false
        },
        { headerName: "UomId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
        {
          headerName: "Price", field: "price", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 80, editable: false
        },
        {
          headerName: "Remarks", field: "remarks", width: 150, cellEditor: "agLargeTextCellEditor"
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  ];

  onAddInventory  () {
    try {
      var res = this.goInventory.api.applyTransaction({
        add: [{
          productId: null, quantity: 0, uoMName: null, price: 0, remarks:null, add: true, edit: false, delete: false
        }]
      });
      this.goInventory.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteInventory  () {
    try {
      if (this.goInventory.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goInventory.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goInventory.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getInventoryFromGrid() {
    let rowData = [];
    this.goInventory.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion 

  //#region Actual other charges  Grid Definition & functions
  colOtherChgs = [
    {
      headerName: 'Actual Charges',
      children: [
        {
          headerName: "Charge", field: "chargeId", width: 150, cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'WOCharge', class: "150" }, valueFormatter: agGridHelper.getWOChargeName,
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100
        },
        {
          headerName: "Remarks", field: "remarks", width: 150, cellEditor: "agLargeTextCellEditor"
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddOtherCharge  () {
    try {
      var res = this.goOtherChgs.api.applyTransaction({
        add: [{
          chargeId: null, quantity: 0, amount: 0, remarks:null, add: true, edit: false, delete: false
        }]
      });
      this.goOtherChgs.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteOtherCharge  () {
    try {
      if (this.goOtherChgs.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goOtherChgs.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goOtherChgs.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getOtherChgsFromGrid() {
    let rowData = [];
    this.goOtherChgs.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion 

  //#region WO Activity Grid Definition & functions
  colActivity = [
    {
      headerName: 'Maintenance Activites',
      children: [
        {
          headerName: 'S', field: 'selected', width: 70, editable: false,
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
          headerName: "Activity", field: "activityName", width: 200
        }
      ]
    }    
  ];

  getActivityFromGrid() {
    let rowData = [];
    this.goWOActivity.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion  
  //#endregion
  //#endregion

  //#region local functions
  validateGridStatus() {
    var rd = this.isReadOnly();
    agFormHelper.setGridStatus(!rd);
    agFormHelper.setGridToolbar(!rd);
  }

  get(woNo: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcWO.get(woNo).subscribe(
        workorder => {
          if (workorder) {
            this.frmWorkOrder.disable();
            this.frmWorkOrder.controls['woNo'].setValue(workorder.woNo);
            this.frmWorkOrder.controls['woId'].setValue(workorder.woId);
            this.frmWorkOrder.controls['woDate'].setValue(workorder.woDate);
            this.frmWorkOrder.controls['branchId'].setValue(workorder.branchId);
            this.frmWorkOrder.controls['supplierId'].setValue(workorder.supplierId);
            this.frmWorkOrder.controls['priorityId'].setValue(workorder.priorityId);
            this.frmWorkOrder.controls['vehicleId'].setValue(workorder.vehicleId);
            this.frmWorkOrder.controls['woTypeId'].setValue(workorder.woTypeId);
            this.frmWorkOrder.controls['subCategoryId'].setValue(workorder.subCategoryId);
            this.frmWorkOrder.controls['requestId'].setValue(workorder.requestId);
            this.frmWorkOrder.controls['kMsReading'].setValue(workorder.kMsReading);
            this.frmWorkOrder.controls['estDuration'].setValue(workorder.estDuration);
            this.frmWorkOrder.controls['activityDetail'].setValue(workorder.activityDetail);
            this.frmWorkOrder.controls['stateId'].setValue(workorder.stateId);
            workorder.stateName = AgilityEnum.getWorkOrderState(workorder.stateId);
            this.frmWorkOrder.controls['stateName'].setValue( workorder.stateName);
            this.frmWorkOrder.controls['owner'].setValue(workorder.owner);
            this.frmWorkOrder.controls['completed'].setValue(workorder.completed);
            this.estInventoryData = workorder.estInventories;
            this.estOtherChgsData = workorder.estOtherChgs;
            this.activityData = workorder.activities;
            if (workorder.stateId >= 3) {
              this.inventoryData = workorder.inventories;
              this.otherChgsData = workorder.otherCharges;
            }
            this.footer = workorder.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private loadSVRDetail(sr: ServiceRequest) {
    this.svcWaitDlg.open({});
    try {
      this.frmWorkOrder.controls['requestId'].setValue(sr.requestId);
      this.frmWorkOrder.controls['vehicleId'].setValue(sr.vehicleId);
      this.frmWorkOrder.controls['branchId'].setValue(sr.branchId);
      this.frmWorkOrder.controls['priorityId'].setValue(sr.priorityId);
      this.frmWorkOrder.controls['kMsReading'].setValue(sr.kMsReading);
      this.frmWorkOrder.controls['activityDetail'].setValue(sr.requestDetail);
      this.svcWaitDlg.close();
    }
    catch (e) { this.svcToaster.showFailure(e); this.svcWaitDlg.close(); }
  }

  private loadLookup() {
    try {
      this.svcWO.getLookups().subscribe(
        data => {
          this.lstBranch = data.lstBranch;
          this.lstAsset = data.lstAsset.filter(x => x.assetTypeId === 1);
          this.lstPriority = data.lstPriority;
          this.lstWOType = data.lstWOType;
          this.lstSupplier = data.lstSupplier;
          this.lstSubCategory = data.lstSubCategory;
          sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
          sessionStorage.setItem("lstCharge", JSON.stringify(data.lstCharge));
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

  private validate(wo: WorkOrder) {
    this.errors = [];
    if (wo.completed || (wo.stateName != 'New' && wo.stateName != 'Saved' ) ||
      wo.owner != wo.footer.createdBy || wo.owner != this.svcAuth.getUserId()) {
      this.errors.push('No further changes can be made to this Work Order at this stage!');
    }
    if (wo.stateId == 5 && wo.owner != wo.footer.createdBy) {
      this.errors.push('The current owner of this WorkOrder is ' + wo.owner +
        '!. ' + wo.footer.createdBy + ' can make changes to WO contents provided it is returned to that user!');
    }  
    if (!wo.subCategoryId && (wo.woTypeId == 2 || wo.woTypeId == 3)) {
      this.errors.push('Work order sub category must be classified');
    }    
    if (Object.keys(wo.estInventories.filter(x => !x.delete)).length == 0 && Object.keys(wo.estOtherChgs.filter(x => !x.delete)).length == 0) {
      this.errors.push('Atleast one entry must exist in either of material/other charges window to continue with workorder save operation');
    }

    if (wo.estInventories.some(x => !x.delete && !x.productId)) {
      this.errors.push('Please Select valid Product for each row of Estimate Inventory Grid');
    }
    if (wo.estInventories.some(x => !x.delete && x.quantity <= 0)) {
      this.errors.push('No row in Estimated material list may contain zero or -ve quantity');
    }

    if (Object.keys(wo.estOtherChgs.filter(x => !x.delete)).length > 0 && wo.supplierId == null) {
      this.errors.push('Supplier must be selected if one or more other Charges are mentioned');
    }

    if  (wo.estOtherChgs.some(x => !x.delete && !x.chargeId )) {
      this.errors.push('Please Select valid Charge for each row of Other Charges Grid');
    }
    if  (wo.estOtherChgs.some(x => !x.delete && x.quantity <= 0 || x.amount <= 0)) {
      this.errors.push('The Estimated quantity and amount under other charges cannot be -ve or zero');
    }

    if (Object.keys(wo.estInventories.filter(x => !x.delete)).length != 0) {
      var valueArr = wo.estInventories.filter(x => !x.delete).map(function (item) { return item.productId })
      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      if (isDuplicate) {
        this.errors.push('Inventory used in Estimated Inventory list must be unique');
      }
    }
    
    if (Object.keys(wo.estOtherChgs.filter(x => !x.delete)).length  != 0) {
      var valueOCArr = wo.estOtherChgs.filter(x => !x.delete).map(function (item) { return item.chargeId })
      var isDuplicate = valueOCArr.some(function (item, idx) {
        return valueOCArr.indexOf(item) != idx
      });
      if (isDuplicate) {
        this.errors.push('Charges used in Estimated Other Charges must be unique');
      }
    }
   
  }
  private validateActual(wo: WorkOrder) {
    this.errors = [];
      
    if (wo.inventories.some(x => !x.delete && !x.productId)) {
      this.errors.push('Please Select valid  Actual Product for each row of Inventory Grid');
    }

    if (wo.inventories.some(x => !x.delete && x.quantity <= 0)) {
      this.errors.push('No row in Actual Inventory list can contain zero or -ve quantity');
    }
    if (Object.keys(wo.otherCharges.filter(x => !x.delete)).length > 0 && wo.supplierId == null) {
      this.errors.push('Supplier must be selected if one or more Other Charges are mentioned');
    }
    if (wo.estOtherChgs.some(x => !x.delete && !x.chargeId)) {
      this.errors.push('Please Select valid Charge for for each row of Actual Other Charges Grid');
    }
    if (wo.otherCharges.some(x => !x.delete && x.quantity <= 0 || x.amount <= 0)) {
      this.errors.push('The Actual quantity and Amount under Actual Other Charges cannot be -ve or zero');
    }

    if (wo.inventories.filter(x => !x.delete).length  != 0) {
      var valueArr = wo.inventories.filter(x => !x.delete).map(function (item) { return item.productId })
      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
       if (isDuplicate===true) {
         this.errors.push('Product used in Actual Inventory list must be unique');
      }
    }
   
    if (wo.otherCharges.filter(x => !x.delete).length  != 0) {
      var valueAOArr = wo.otherCharges.filter(x => !x.delete).map(function (item) { return item.chargeId })
      var isDuplicate = valueAOArr.some(function (item, idx) {
        return valueAOArr.indexOf(item) != idx
      });
      if (isDuplicate) {
        this.errors.push('Charge heads used in Actual Other Charges must be unique');
      }
    }
   
    if (wo.inventories.filter(x => !x.delete).length > 0) {
      var estAMArr = wo.estInventories.map(function (item) { return item.productId })
      var actAMArr = wo.inventories.filter(x => !x.delete).map(function (item) { return item.productId })

      if (estAMArr.filter(arr1Item => !actAMArr.includes(arr1Item)).length > 0) {
        this.errors.push('You cannot add new product in Actual Inventory at this stage');
      }
      var actAMArr1 = wo.inventories.filter(x => !x.delete).map(function (item) { return item })
      let ActProQty = actAMArr1.filter(e =>  {
        return wo.estInventories.some(item => item.productId === e.productId && item.quantity > e.quantity); // take the ! out and you're done
      });

      if (ActProQty.length > 0) {
        this.errors.push('Quantity for Actual Inventory must be equal or lesser than estimated Quantity for each of the product');
      }
    }
    if (wo.otherCharges.filter(x => !x.delete).length > 0) {
        var arrEstOC = wo.estOtherChgs.map(function (item) { return item.chargeId })
        var arrActOC = wo.otherCharges.filter(x => !x.delete).map(function (item) { return item.chargeId })

      if (arrEstOC.filter(x => !arrActOC.includes(x)).length > 0) {
        this.errors.push('You cannot add new product in Actual Other Charges at this stage');
      }
    }

    let actQty = wo.otherCharges.filter(x => !x.delete).filter(e => {
      return wo.estOtherChgs.some(item => item.chargeId === e.chargeId
        && item.quantity > e.quantity || item.amount  > e.amount); 
    });

    if (actQty.length > 0) {
      this.errors.push('Quantity for Actual Other Charges must be equal or lesser than estimated Quantity for each of the Charge');
    }
  }

  private setActionBarVisibility(formMode: agFormMode) {
    this.submissionButtonsStatus = (formMode != agFormMode.ReadOnly && formMode != agFormMode.Review) ? "disabled" : "";
  }

  private loadWOActivity() {
    try {
      this.svcWO.getActivities().subscribe((rowData) => {
        this.activityData = rowData;
      },
        error => { this.svcToaster.showFailure(error) });
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private isReadOnly() {
    return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
  }

  private disableSave() {
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  private initForm() {   
    this.frmWorkOrder.reset();
    this.frmWorkOrder.disable();
    this.frmWorkOrder.patchValue({ stateId: 0 });
    this.errors = [];
    this.activityData = [];
    this.estInventoryData = [];
    this.estOtherChgsData = [];
    this.inventoryData= [];
    this.otherChgsData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
    (<HTMLInputElement>document.getElementById("btnSearchSR")).disabled = true;
    this.footer = new agFooter();
  }
  //#endregion local functions
}
