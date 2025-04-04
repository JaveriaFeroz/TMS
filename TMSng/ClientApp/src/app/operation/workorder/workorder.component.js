"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const AgilityEnum_1 = require("../../helper/AgilityEnum");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let WorkOrderComponent = class WorkOrderComponent {
    //#endregion
    constructor(route, router, formbulider, svcWO, svcToaster, svcWaitDlg, svcSearchDlg, svcHistoryDlg, svcRecipient, svcFormSubmissionDlg, Enum, svcAuth) {
        this.route = route;
        this.router = router;
        this.formbulider = formbulider;
        this.svcWO = svcWO;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcRecipient = svcRecipient;
        this.svcFormSubmissionDlg = svcFormSubmissionDlg;
        this.Enum = Enum;
        this.svcAuth = svcAuth;
        this.optionName = 'Work Order';
        this.colSearch = [
            { headerName: 'WO #', field: 'woNo' },
            { headerName: 'WO Date', field: 'woDate' },
            { headerName: 'Asset #', field: 'assetNo' },
            { headerName: 'Priority', field: 'priorityName' },
            { headerName: 'SVR #', field: 'requestId' },
            { headerName: 'Branch', field: 'branchName' },
            { headerName: 'Status', field: 'stateName' }
        ];
        this.assetColDefs = [
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
        this.srColDefs = [
            { headerName: 'SR #', field: 'requestId' },
            { headerName: 'SR Date', field: 'requestDate' },
            { headerName: 'Asset #', field: 'vehicleNo' },
            { headerName: 'Priority', field: 'priorityName' },
            { headerName: 'Branch', field: 'branchName' },
            { headerName: 'KM Reading', field: 'kMsReading' },
            { headerName: 'Detail', field: 'detail' },
        ];
        this.errors = [];
        this.MinDate = new Date(new Date().getDate() - 30);
        this.MaxDate = new Date();
        this.isDisabled = true;
        this.submissionButtonsStatus = "";
        this.footer = new footer_1.agFooter();
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnEdit').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        //#region Estimate grid setup
        //#region estimated inventory Grid Definition & functions
        this.colEstInv = [
            {
                headerName: 'Estimated Inventory',
                children: [
                    {
                        headerName: "Product", field: "productId", width: 180, cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Product', class: "180" }, valueFormatter: agGridHelper_1.agGridHelper.getProductName,
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "UoM", field: "uoMName", width: 80, editable: false },
                    {
                        headerName: "Price", field: "price", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80, editable: false
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
        //#endregion 
        //#region estimated other charges Grid Definition & functions
        this.colEstOtherChgs = [
            {
                headerName: 'Estimated Charges',
                children: [
                    {
                        headerName: "Charge", field: "chargeId", width: 150, cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'WOCharge', class: "150" }, valueFormatter: agGridHelper_1.agGridHelper.getWOChargeName,
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80
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
        //#endregion 
        //#endregion
        //#region Actual grid setup
        //#region actual inventory Grid Definition & functions
        this.colInventory = [
            {
                headerName: 'Actual Inventory',
                children: [
                    {
                        headerName: "Product", field: "productId", width: 200, cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Product', class: "tb200" }, valueFormatter: agGridHelper_1.agGridHelper.getProductName,
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "UoM", field: "uoMName", width: 80, editable: false
                    },
                    { headerName: "UomId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
                    {
                        headerName: "Price", field: "price", type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80, editable: false
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
        //#endregion 
        //#region Actual other charges  Grid Definition & functions
        this.colOtherChgs = [
            {
                headerName: 'Actual Charges',
                children: [
                    {
                        headerName: "Charge", field: "chargeId", width: 150, cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'WOCharge', class: "150" }, valueFormatter: agGridHelper_1.agGridHelper.getWOChargeName,
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100
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
        //#endregion 
        //#region WO Activity Grid Definition & functions
        this.colActivity = [
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
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    {
                        headerName: "Activity", field: "activityName", width: 200
                    }
                ]
            }
        ];
        this.currentUserId = svcAuth.getUserId();
        this.currentUserRoleId = parseInt(svcAuth.getUserRole());
        this.loadLookup();
        this.initGrid();
        var _formid = (this.route.snapshot.queryParamMap.get("formId"));
        if (_formid != null) {
            this.get(_formid.toString());
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    ngOnInit() {
        this.frmWorkOrder = this.formbulider.group({
            woNo: [null, [forms_1.Validators.required]],
            woId: [null],
            woDate: [null, [forms_1.Validators.required]],
            branchId: [null, [forms_1.Validators.required]],
            supplierId: [null, [forms_1.Validators.required]],
            priorityId: [null, [forms_1.Validators.required]],
            vehicleId: [null, [forms_1.Validators.required]],
            woTypeId: [null, [forms_1.Validators.required]],
            requestId: [null, [forms_1.Validators.required]],
            kMsReading: [null, [forms_1.Validators.required]],
            estDuration: [null, [forms_1.Validators.required]],
            activityDetail: [null, [forms_1.Validators.required]],
            subCategoryId: [null],
            stateName: [null],
            stateId: [0],
            owner: [null],
            completed: [null],
        });
        this.frmWorkOrder.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        document.getElementById("btnSearchSR").disabled = true;
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divHToolbar'); //document.body;//document.getElementById('btnSave') as Node;
        this.observer.observe(this.targetNode, this.config);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmWorkOrder.reset();
        this.frmWorkOrder.enable();
        this.frmWorkOrder.controls.woNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmWorkOrder.patchValue({ woDate: new Date(), stateId: 0, completed: false, stateName: "New", owner: this.svcAuth.getUserId() });
        this.frmWorkOrder.controls.requestId.disable();
        this.frmWorkOrder.controls.stateName.disable();
        document.getElementById("btnSearchSR").disabled = false;
        this.footer.createdBy = this.svcAuth.getUserId();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        this.loadWOActivity();
        this.assetId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmWorkOrder.controls.woNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.woNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcWO.getWorkOrders().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Work Order", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.woNo);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmWorkOrder.enable();
        this.frmWorkOrder.controls.woNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.frmWorkOrder.controls.requestId.disable();
        this.frmWorkOrder.controls.stateName.disable();
        if (this.frmWorkOrder.controls.stateId.value >= 2) {
            this.frmWorkOrder.controls.vehicleId.disable();
            this.frmWorkOrder.controls.branchId.disable();
            this.frmWorkOrder.controls.supplierId.disable();
            this.frmWorkOrder.controls.priorityId.disable();
            this.frmWorkOrder.controls.subCategoryId.disable();
            document.getElementById("btnSearchSR").disabled = true;
        }
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.assetId.focus();
    }
    tbSave() {
        try {
            this.frmWorkOrder.markAllAsTouched();
            if (!this.frmWorkOrder.invalid) {
                var formData = this.frmWorkOrder.getRawValue();
                formData.estInventories = this.getEstInventoryFromGrid();
                formData.estOtherChgs = this.getEstOtherChgsFromGrid();
                formData.activities = this.getActivityFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcWO.save(formData).subscribe(data => {
                        this.svcToaster.showSuccess('Work Order # ' + data.woNo + ' saved successfully. Press press Submit button to submit request to workshop now!');
                        this.frmWorkOrder.controls['woNo'].setValue(data.woNo);
                        this.frmWorkOrder.controls['owner'].setValue(data.owner);
                        this.frmWorkOrder.controls['woId'].setValue(data.woId);
                        this.frmWorkOrder.controls['stateId'].setValue(1);
                        this.frmWorkOrder.controls['stateName'].setValue('Saved');
                        this.footer.createdBy = data.owner;
                        formData.estInventories.forEach(o => { o.add = false, o.edit = false, o.delete = false; });
                        formData.estOtherChgs.forEach(o => { o.add = false, o.edit = false, o.delete = false; });
                        this.frmWorkOrder.disable();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                        document.getElementById("btnSearchSR").disabled = true;
                        this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                        agFormHelper_1.agFormHelper.setGridToolbar(false);
                        agFormHelper_1.agFormHelper.setGridStatus(false);
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        sessionStorage.removeItem("lstProduct");
        sessionStorage.removeItem("lstCharge");
        this.router.navigate(['/MainForm']);
    }
    tbHistory(formid) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(AgilityEnum_1.AgilityEnum.WorkFlow.WorkOrder, formid).subscribe(r => {
                this.svcHistoryDlg.open("Work Order" + formid, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbAssetSearch(assetid) {
        try {
            this.svcWaitDlg.open({});
            this.svcWO.getMaintenaceHistory(assetid).subscribe(r => {
                this.svcHistoryDlg.open("Work Order" + assetid, this.assetColDefs, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbSRSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcWO.getServiceRequests().subscribe(r => {
                this.svcSearchDlg.open("Search and Select Service Request", this.srColDefs, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.loadSVRDetail(r);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
    //#region FormSubmission
    tbFormSubmission(formId, stateId, woTypeId) {
        this.svcWaitDlg.open({});
        let recipients, nextStateId;
        return new Promise((resolve, reject) => {
            try {
                if (stateId == 2 || stateId == 11 || stateId == 8 || stateId == 5) {
                    recipients = this.svcRecipient.getWORecipients(formId, stateId);
                }
                else if (stateId == 4 || stateId == 7) {
                    console.log(stateId);
                    console.log(AgilityEnum_1.AgilityEnum.WorkFlow.WorkOrder);
                    console.log(formId);
                    recipients = this.svcRecipient.getOwner(AgilityEnum_1.AgilityEnum.WorkFlow.WorkOrder, formId);
                }
                //if (stateId == 8) {
                //  recipients = this.svcRecipient.getWorkShopStaffs();
                //}
                (0, rxjs_1.forkJoin)([recipients]).subscribe(results => {
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
                        this.svcFormSubmissionDlg.open(AgilityEnum_1.AgilityEnum.getWorkOrderState(nextStateId) + " - WO# " + this.frmWorkOrder.controls.woNo.value, AgilityEnum_1.AgilityEnum.getWorkOrderState(nextStateId), recipients);
                        let sub = new submission_1.Submission();
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
                        }, error => { this.svcWaitDlg.close(); this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); this.svcFormSubmissionDlg.close(); });
                    }
                }, () => { }, () => { this.svcWaitDlg.close(); });
                resolve(true);
            }
            catch (e) {
                this.svcWaitDlg.close();
                this.svcToaster.showFailure(e);
                reject(e);
            }
        });
    }
    tbResolve(formId, stateId, woTypeId) {
        let nextStateId, recipients;
        return new Promise((resolve, reject) => {
            try {
                if (stateId == 6) {
                    var formData = this.frmWorkOrder.getRawValue();
                    formData.estInventories = this.getEstInventoryFromGrid();
                    formData.estOtherChgs = this.getEstOtherChgsFromGrid();
                    formData.inventories = this.getInventoryFromGrid();
                    formData.otherCharges = this.getOtherChgsFromGrid();
                    this.validateActual(formData);
                    if (this.errors.length > 0) {
                        return;
                    }
                    else {
                        this.svcWO.saveActual(formData).subscribe(() => {
                            formData.inventories.forEach(o => { o.add = false, o.edit = false, o.delete = false; });
                            formData.otherCharges.forEach(o => { o.add = false, o.edit = false, o.delete = false; });
                        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                    }
                    recipients = this.svcRecipient.getWORecipients(formId, stateId);
                }
                (0, rxjs_1.forkJoin)([recipients]).subscribe(results => {
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
                        this.svcFormSubmissionDlg.open(AgilityEnum_1.AgilityEnum.getWorkOrderState(nextStateId) + " - WO# " + this.frmWorkOrder.controls.woNo.value, AgilityEnum_1.AgilityEnum.getWorkOrderState(nextStateId), recipients);
                        let sub = new submission_1.Submission();
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
                        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcFormSubmissionDlg.close(); });
                    }
                });
                resolve(true);
            }
            catch (e) {
                this.svcToaster.showFailure(e);
                reject(e);
            }
        });
    }
    submit(sub) {
        if (sub.stateId == 4 || sub.stateId == 7) {
            sub.completed = true;
        }
        this.svcWO.submit(sub).subscribe(() => {
            this.svcToaster.showSuccess('Work Order # ' + sub.formNo +
                ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
            this.initForm();
            this.router.navigate(['/MainForm']);
        }, error => { this.svcToaster.showFailure(error); }, () => { });
    }
    //#endregion FormSubmission
    //#region grid setup
    initGrid() {
        //#region estimated grid options
        this.goEstInventory = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
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
                        var product = lstProduct.filter(x => x.productId == params.data.productId)[0];
                        params.node.setDataValue('price', product.purchasePrice);
                        params.node.setDataValue('uoMId', product.uomId);
                        params.node.setDataValue('uoMName', product.uomName);
                        params.node.setDataValue("productId", parseInt(params.data.productId));
                    }
                }
            }
        };
        this.goEstOtherChgs = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
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
        this.goInventory = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
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
                        var product = lstProduct.filter(x => x.productId == params.data.productId)[0];
                        params.node.setDataValue('price', product.purchasePrice);
                        params.node.setDataValue('uoMName', product.uomName);
                        params.node.setDataValue('uoMId', product.uomId);
                        params.node.setDataValue("productId", parseInt(params.data.productId));
                    }
                }
            }
        };
        this.goOtherChgs = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
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
        this.goWOActivity = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
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
    onAddEstInventory() {
        try {
            var res = this.goEstInventory.api.applyTransaction({
                add: [{
                        productId: null, quantity: 0, uoMId: null, price: 0, remarks: null, add: true, edit: false, delete: false
                    }]
            });
            this.goEstInventory.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteEstInventory() {
        try {
            if (this.goEstInventory.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goEstInventory.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goEstInventory.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getEstInventoryFromGrid() {
        let rowData = [];
        this.goEstInventory.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddEstOtherCharge() {
        try {
            var res = this.goEstOtherChgs.api.applyTransaction({
                add: [{
                        chargeId: null, quantity: 0, amount: 0, remarks: null, add: true, edit: false, delete: false
                    }]
            });
            this.goEstOtherChgs.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteEstOtherCharge() {
        try {
            if (this.goEstOtherChgs.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goEstOtherChgs.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goEstOtherChgs.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getEstOtherChgsFromGrid() {
        let rowData = [];
        this.goEstOtherChgs.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddInventory() {
        try {
            var res = this.goInventory.api.applyTransaction({
                add: [{
                        productId: null, quantity: 0, uoMName: null, price: 0, remarks: null, add: true, edit: false, delete: false
                    }]
            });
            this.goInventory.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteInventory() {
        try {
            if (this.goInventory.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goInventory.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goInventory.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getInventoryFromGrid() {
        let rowData = [];
        this.goInventory.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddOtherCharge() {
        try {
            var res = this.goOtherChgs.api.applyTransaction({
                add: [{
                        chargeId: null, quantity: 0, amount: 0, remarks: null, add: true, edit: false, delete: false
                    }]
            });
            this.goOtherChgs.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteOtherCharge() {
        try {
            if (this.goOtherChgs.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goOtherChgs.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goOtherChgs.api);
                }
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getOtherChgsFromGrid() {
        let rowData = [];
        this.goOtherChgs.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
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
        agFormHelper_1.agFormHelper.setGridStatus(!rd);
        agFormHelper_1.agFormHelper.setGridToolbar(!rd);
    }
    get(woNo) {
        this.svcWaitDlg.open({});
        try {
            this.svcWO.get(woNo).subscribe(workorder => {
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
                    workorder.stateName = AgilityEnum_1.AgilityEnum.getWorkOrderState(workorder.stateId);
                    this.frmWorkOrder.controls['stateName'].setValue(workorder.stateName);
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
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    loadSVRDetail(sr) {
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
        catch (e) {
            this.svcToaster.showFailure(e);
            this.svcWaitDlg.close();
        }
    }
    loadLookup() {
        try {
            this.svcWO.getLookups().subscribe(data => {
                this.lstBranch = data.lstBranch;
                this.lstAsset = data.lstAsset.filter(x => x.assetTypeId === 1);
                this.lstPriority = data.lstPriority;
                this.lstWOType = data.lstWOType;
                this.lstSupplier = data.lstSupplier;
                this.lstSubCategory = data.lstSubCategory;
                sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
                sessionStorage.setItem("lstCharge", JSON.stringify(data.lstCharge));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(wo) {
        this.errors = [];
        if (wo.completed || (wo.stateName != 'New' && wo.stateName != 'Saved') ||
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
        if (wo.estOtherChgs.some(x => !x.delete && !x.chargeId)) {
            this.errors.push('Please Select valid Charge for each row of Other Charges Grid');
        }
        if (wo.estOtherChgs.some(x => !x.delete && x.quantity <= 0 || x.amount <= 0)) {
            this.errors.push('The Estimated quantity and amount under other charges cannot be -ve or zero');
        }
        if (Object.keys(wo.estInventories.filter(x => !x.delete)).length != 0) {
            var valueArr = wo.estInventories.filter(x => !x.delete).map(function (item) { return item.productId; });
            var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx;
            });
            if (isDuplicate) {
                this.errors.push('Inventory used in Estimated Inventory list must be unique');
            }
        }
        if (Object.keys(wo.estOtherChgs.filter(x => !x.delete)).length != 0) {
            var valueOCArr = wo.estOtherChgs.filter(x => !x.delete).map(function (item) { return item.chargeId; });
            var isDuplicate = valueOCArr.some(function (item, idx) {
                return valueOCArr.indexOf(item) != idx;
            });
            if (isDuplicate) {
                this.errors.push('Charges used in Estimated Other Charges must be unique');
            }
        }
    }
    validateActual(wo) {
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
        if (wo.inventories.filter(x => !x.delete).length != 0) {
            var valueArr = wo.inventories.filter(x => !x.delete).map(function (item) { return item.productId; });
            var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx;
            });
            if (isDuplicate === true) {
                this.errors.push('Product used in Actual Inventory list must be unique');
            }
        }
        if (wo.otherCharges.filter(x => !x.delete).length != 0) {
            var valueAOArr = wo.otherCharges.filter(x => !x.delete).map(function (item) { return item.chargeId; });
            var isDuplicate = valueAOArr.some(function (item, idx) {
                return valueAOArr.indexOf(item) != idx;
            });
            if (isDuplicate) {
                this.errors.push('Charge heads used in Actual Other Charges must be unique');
            }
        }
        if (wo.inventories.filter(x => !x.delete).length > 0) {
            var estAMArr = wo.estInventories.map(function (item) { return item.productId; });
            var actAMArr = wo.inventories.filter(x => !x.delete).map(function (item) { return item.productId; });
            if (estAMArr.filter(arr1Item => !actAMArr.includes(arr1Item)).length > 0) {
                this.errors.push('You cannot add new product in Actual Inventory at this stage');
            }
            var actAMArr1 = wo.inventories.filter(x => !x.delete).map(function (item) { return item; });
            let ActProQty = actAMArr1.filter(e => {
                return wo.estInventories.some(item => item.productId === e.productId && item.quantity > e.quantity); // take the ! out and you're done
            });
            if (ActProQty.length > 0) {
                this.errors.push('Quantity for Actual Inventory must be equal or lesser than estimated Quantity for each of the product');
            }
        }
        if (wo.otherCharges.filter(x => !x.delete).length > 0) {
            var arrEstOC = wo.estOtherChgs.map(function (item) { return item.chargeId; });
            var arrActOC = wo.otherCharges.filter(x => !x.delete).map(function (item) { return item.chargeId; });
            if (arrEstOC.filter(x => !arrActOC.includes(x)).length > 0) {
                this.errors.push('You cannot add new product in Actual Other Charges at this stage');
            }
        }
        let actQty = wo.otherCharges.filter(x => !x.delete).filter(e => {
            return wo.estOtherChgs.some(item => item.chargeId === e.chargeId
                && item.quantity > e.quantity || item.amount > e.amount);
        });
        if (actQty.length > 0) {
            this.errors.push('Quantity for Actual Other Charges must be equal or lesser than estimated Quantity for each of the Charge');
        }
    }
    setActionBarVisibility(formMode) {
        this.submissionButtonsStatus = (formMode != agFormHelper_1.agFormMode.ReadOnly && formMode != agFormHelper_1.agFormMode.Review) ? "disabled" : "";
    }
    loadWOActivity() {
        try {
            this.svcWO.getActivities().subscribe((rowData) => {
                this.activityData = rowData;
            }, error => { this.svcToaster.showFailure(error); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    isReadOnly() {
        return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
    }
    disableSave() {
        if (document.getElementById("btnSave"))
            document.getElementById("btnSave").disabled = true;
    }
    initForm() {
        this.frmWorkOrder.reset();
        this.frmWorkOrder.disable();
        this.frmWorkOrder.patchValue({ stateId: 0 });
        this.errors = [];
        this.activityData = [];
        this.estInventoryData = [];
        this.estOtherChgsData = [];
        this.inventoryData = [];
        this.otherChgsData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        document.getElementById("btnSearchSR").disabled = true;
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    (0, core_1.ViewChild)('assetId', { static: true })
], WorkOrderComponent.prototype, "assetId", void 0);
__decorate([
    (0, core_1.ViewChild)('woNo', { static: true })
], WorkOrderComponent.prototype, "woNo", void 0);
__decorate([
    (0, core_1.ViewChild)('btnEdit', { static: true })
], WorkOrderComponent.prototype, "btnEdit", void 0);
WorkOrderComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-workorder',
        templateUrl: './workorder.component.html',
        styleUrls: ['./workorder.component.css']
    })
], WorkOrderComponent);
exports.WorkOrderComponent = WorkOrderComponent;
//# sourceMappingURL=workorder.component.js.map