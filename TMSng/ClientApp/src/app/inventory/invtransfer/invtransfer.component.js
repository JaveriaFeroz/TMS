"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvTransferComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const AgilityEnum_1 = require("../../helper/AgilityEnum");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let InvTransferComponent = class InvTransferComponent {
    //#endregion
    constructor(route, router, formbulider, svcInvTransfer, svcToaster, svcWaitDlg, svcSearchDlg, svcAuth, svcHistoryDlg, svcRecipient, formsubmissionDlg) {
        this.route = route;
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvTransfer = svcInvTransfer;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcRecipient = svcRecipient;
        this.formsubmissionDlg = formsubmissionDlg;
        this.optionName = 'Inventory Transfer';
        this.colSearch = [
            { headerName: 'Transfer #', field: 'transferId', width: 90 },
            { headerName: 'Date', field: 'transferDate', width: 75 },
            { headerName: 'Origin Branch', field: 'fromBranchName' },
            { headerName: 'Destination Branch', field: 'toBranchName' },
            { headerName: 'State', field: 'stateName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        this.submissionButtonsStatus = "";
        this.colTransfer = [
            {
                headerName: 'Inventory Transfer',
                children: [
                    {
                        headerName: "Product", field: "productId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Product', class: "300" },
                        valueFormatter: agGridHelper_1.agGridHelper.getProductName, width: 300, lockPinned: true
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "UoM", field: "uoMName", width: 80, editable: false
                    },
                    { headerName: "UoMId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
                    {
                        headerName: "Price", field: "price", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, editable: false
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.currentUserId = null;
        this.currentUserId = svcAuth.getUserId();
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmInvTransfer = this.formbulider.group({
            transferId: [null, [forms_1.Validators.required]],
            transferDate: [null, [forms_1.Validators.required]],
            fromBranchId: [null, [forms_1.Validators.required]],
            toBranchId: [null, [forms_1.Validators.required]],
            statusName: [null],
            stateId: [null],
            owner: [null],
            completed: [null],
        });
        this.frmInvTransfer.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        if (_formid > 0) {
            this.get(_formid);
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInvTransfer.reset();
        this.frmInvTransfer.enable();
        this.frmInvTransfer.controls.transferId.disable();
        this.frmInvTransfer.patchValue({ transferDate: new Date(), stateId: 0, statusName: "New", completed: false });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmInvTransfer.controls.statusName.disable();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.branchId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmInvTransfer.controls.transferId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.transferId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInvTransfer.getInvTransfers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Inventory Transfer", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.transferId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbHistory(formid) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(AgilityEnum_1.AgilityEnum.WorkFlow.InventoryTransfer, formid).subscribe(r => {
                this.svcHistoryDlg.open("Inventory Transfer" + formid, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmInvTransfer.enable();
        this.frmInvTransfer.controls.transferId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.frmInvTransfer.controls.statusName.disable();
        document.getElementById("btnSave").disabled = true;
        this.branchId.focus();
    }
    tbSave() {
        try {
            this.frmInvTransfer.markAllAsTouched();
            if (!this.frmInvTransfer.invalid) {
                var formData = this.frmInvTransfer.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcInvTransfer.save(formData).subscribe(data => {
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                        this.svcToaster.showSuccess('Inventory Transfer # ' + data.transferId +
                            ' saved successfully. Please click Transfer button to initiate Inventory Transfer to Destination!');
                        this.frmInvTransfer.controls['transferId'].setValue(data.transferId);
                        this.frmInvTransfer.controls['owner'].setValue(data.owner);
                        this.frmInvTransfer.controls['stateId'].setValue(1);
                        this.frmInvTransfer.controls['statusName'].setValue('Saved');
                        this.footer.createdBy = data.owner;
                        this.frmInvTransfer.enable();
                        this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                        agFormHelper_1.agFormHelper.setGridToolbar(false);
                        agFormHelper_1.agFormHelper.setGridStatus(false);
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        sessionStorage.removeItem("lstProduct");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region FormSubmission
    tbFormSubmission(formid, stateid) {
        this.svcWaitDlg.open({});
        let recipients;
        return new Promise((resolve, reject) => {
            try {
                if (stateid == 9) {
                    recipients = this.svcRecipient.getInvTransferRecipients(formid);
                }
                else if (stateid == 10) {
                    recipients = this.svcRecipient.getInvTransferOwners(formid);
                }
                else if (stateid == 99) {
                    recipients = this.svcRecipient.getOwner(AgilityEnum_1.AgilityEnum.WorkFlow.InventoryTransfer, formid);
                }
                rxjs_1.forkJoin([recipients]).subscribe(results => {
                    var data = results[0];
                    recipients = data["recipient"];
                    if (!recipients || Object.keys(recipients).length == 0) {
                        this.svcToaster.showWarning("No submission user is configured for selected Form State." +
                            "Submission process can not be executed while submission users are missing" +
                            "Please raise Service Request through eForms if you require any support from IT Department");
                        this.svcWaitDlg.close();
                        return;
                    }
                    else {
                        this.formsubmissionDlg.open(AgilityEnum_1.AgilityEnum.getWorkFlowState(stateid) + " - Transfer # " + formid, AgilityEnum_1.AgilityEnum.getWorkFlowState(stateid), recipients);
                        let sub = new submission_1.Submission();
                        this.formsubmissionDlg.selected().subscribe(r => {
                            if (r) {
                                if (r.recipientId !== undefined) {
                                    sub.formId = formid;
                                    sub.comments = r.submissionComment;
                                    sub.owner = r.recipientId;
                                    sub.stateId = stateid;
                                    this.submit(sub);
                                }
                                else {
                                    this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                                        "Submission process can not be executed while submission users are missing");
                                    return;
                                }
                            }
                        }, error => { this.svcToaster.showFailure(error); }, () => { this.formsubmissionDlg.close(); this.svcWaitDlg.close(); });
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
    submit(sub) {
        if (sub.stateId == 9) {
            this.svcInvTransfer.transfer(sub).subscribe(() => {
                alert('Submit operation was successful. Inventory Transfer # ' + sub.formId +
                    ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
                this.router.navigate(['/MainForm']);
            }, error => { this.svcToaster.showFailure(error); }, () => { });
        }
        else {
            if (sub.stateId == 99) {
                sub.completed = true;
                sub.rejected = true;
                this.svcInvTransfer.cancel(sub).subscribe(() => {
                    alert('Cancel operation was successful. Inventory Transfer # ' + sub.formId +
                        ' was successfully Cancel by ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
                    this.router.navigate(['/MainForm']);
                }, error => { this.svcToaster.showFailure(error); }, () => { });
            }
            else {
                sub.completed = true;
                this.svcInvTransfer.receive(sub).subscribe(() => {
                    alert('Submit operation was successful. Inventory Transfer # ' + sub.formId +
                        ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
                    this.router.navigate(['/MainForm']);
                }, error => { this.svcToaster.showFailure(error); }, () => { });
            }
        }
    }
    //#endregion FormSubmission
    //#region grid setup
    initGrid() {
        this.goTransfer = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
            },
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
    }
    onAddLine() {
        try {
            var res = this.goTransfer.api.applyTransaction({
                add: [{
                        productId: null, quantity: 0, uOMName: null, price: 0
                    }]
            });
            this.goTransfer.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    onDeleteLine() {
        try {
            if (confirm("Are you sure you want to Delete selected row?")) {
                const selectedRow = this.goTransfer.api.getFocusedCell();
                if (selectedRow) {
                    var rowNode = this.goTransfer.api.getRowNode(selectedRow.rowIndex.toString());
                    this.goTransfer.api.selectNode(rowNode);
                    this.goTransfer.api.applyTransaction({ remove: this.goTransfer.api.getSelectedRows() });
                }
                else
                    this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
            }
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getDetailFromGrid() {
        let rowData = [];
        this.goTransfer.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcInvTransfer.get(Id).subscribe(it => {
                if (it) {
                    this.frmInvTransfer.disable();
                    this.frmInvTransfer.controls['transferId'].setValue(it.transferId);
                    this.frmInvTransfer.controls['transferDate'].setValue(it.transferDate);
                    this.frmInvTransfer.controls['fromBranchId'].setValue(it.fromBranchId);
                    this.frmInvTransfer.controls['toBranchId'].setValue(it.toBranchId);
                    this.frmInvTransfer.controls['stateId'].setValue(it.stateId);
                    if (it.stateId == 1) {
                        it.statusName = "Saved";
                    }
                    else if (it.stateId == 9) {
                        it.statusName = "Transferred (InTransit)";
                    }
                    else if (it.stateId == 10) {
                        it.statusName = "Received";
                    }
                    else if (it.stateId == 99) {
                        it.statusName = "Cancelled";
                    }
                    this.frmInvTransfer.controls['statusName'].setValue(it.statusName);
                    this.frmInvTransfer.controls['owner'].setValue(it.owner);
                    this.frmInvTransfer.controls['completed'].setValue(it.completed);
                    this.transferData = it.details;
                    this.footer = it.footer;
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
    loadLookup() {
        try {
            this.svcInvTransfer.getLookup().subscribe(data => {
                this.lstFBranch = data.lstFBranch;
                this.lstTBranch = data.lstTBranch;
                sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(it) {
        this.errors = [];
        if (it.stateId > 1) {
            this.errors.push('No further changes can be made to this Inventory Transfer at this stage!');
        }
        if (it.transferDate == null) {
            this.errors.push('Please select valid Transfer date');
        }
        if (it.fromBranchId == it.toBranchId) {
            this.errors.push('From & To Branches cant be same for transfer operation');
        }
        if (Object.keys(it.details).length == 0) {
            this.errors.push('Atleast one product must exist in Inventory Transfer Transaction to perform save operation');
        }
        if (it.details.some(x => !x.productId)) {
            this.errors.push(' Product must be selected in each row of Grid, please remove unnecessary rows');
        }
        if (it.details.some(x => x.quantity <= 0)) {
            this.errors.push('No row in Transfer Transaction can contain zero quantity');
        }
        if (Object.keys(it.details).length != 0) {
            var valueArr = it.details.map(function (item) { return item.productId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Product must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    setActionBarVisibility(formMode) {
        this.submissionButtonsStatus = (formMode != agFormHelper_1.agFormMode.ReadOnly && formMode != agFormHelper_1.agFormMode.Review) ? "disabled" : "";
    }
    initForm() {
        this.frmInvTransfer.reset();
        this.frmInvTransfer.disable();
        this.errors = [];
        this.transferData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('branchId', { static: true })
], InvTransferComponent.prototype, "branchId", void 0);
__decorate([
    core_1.ViewChild('transferId', { static: true })
], InvTransferComponent.prototype, "transferId", void 0);
InvTransferComponent = __decorate([
    core_1.Component({
        selector: 'app-inventorytransfer',
        templateUrl: './invtransfer.component.html',
        styleUrls: ['./invtransfer.component.css']
    })
], InvTransferComponent);
exports.InvTransferComponent = InvTransferComponent;
//# sourceMappingURL=invtransfer.component.js.map