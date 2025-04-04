"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryTransferComponent = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let InventoryTransferComponent = class InventoryTransferComponent {
    constructor(route, router, formbulider, inventorytransferService, toaster, helper, waitDlg, searchDlg, historyDlg, Gridhelper, recipientService, Enum, formsubmissionDlg) {
        this.route = route;
        this.router = router;
        this.formbulider = formbulider;
        this.inventorytransferService = inventorytransferService;
        this.toaster = toaster;
        this.helper = helper;
        this.waitDlg = waitDlg;
        this.searchDlg = searchDlg;
        this.historyDlg = historyDlg;
        this.Gridhelper = Gridhelper;
        this.recipientService = recipientService;
        this.Enum = Enum;
        this.formsubmissionDlg = formsubmissionDlg;
        // public submission: Submission;
        this.submission = new submission_1.Submission();
        //#region constant variables
        this.optionName = 'Inventory Transfer';
        this.searchColDefs = [
            { headerName: 'IT #', field: 'transferNoteNo', width: 70 },
            { headerName: 'Date', field: 'transferNoteDate' },
            { headerName: 'FromBranch', field: 'fromBranch' },
            { headerName: 'ToBranch', field: 'toBranch' },
        ];
        this.historyColDefs = [
            { headerName: 'Sender', field: 'sender' },
            { headerName: 'Recipient', field: 'recipient' },
            { headerName: 'State', field: 'status' },
            { headerName: 'Activity Date', field: 'activityDate' },
            { headerName: 'Comments', field: 'remarks' },
        ];
        this.lstRecipientList = null;
        this.errors = [];
        this.LoginUserId = null;
        this.footer = new footer_1.agFooter();
        this.MaxDate = new Date();
        this.MinDate = new Date();
        //@ViewChild('transferDate', { static: true }) transferDate: MatDatepicker;
        this.isDisabled = true;
        this.isFormbuttonDisabled = true;
        //#endregion FormSubmission
        //#region grid setup
        //#region Inventory Adjustment Grid Definition & functions
        this.colIT = [
            {
                headerName: "Product", field: "productId",
                cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'Product', class: "220" },
                valueFormatter: agGridHelper_1.agGridHelper.getProductName, width: 220,
            },
            {
                headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser
            },
            {
                headerName: "Uom", field: "uomName", width: 80, editable: false
            },
            { headerName: "UomId", field: "uomId", hide: true, suppressToolPanel: true },
            {
                headerName: "Price", field: "price", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, editable: false
            },
            { headerName: "Add", field: "add", hide: true, suppressToolPanel: true },
            { headerName: "Edit", field: "edit", hide: true, suppressToolPanel: true },
            { headerName: "Delete", field: "delete", hide: true, suppressToolPanel: true }
        ];
        this.onAddLine = function () {
            try {
                var res = this.gridIT.api.updateRowData({
                    add: [{
                            productId: null, quantity: 0, uOMName: null, price: 0, add: true, edit: false, delete: false
                        }]
                });
                this.gridIT.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
            }
            catch (exception) {
                this.toaster.showFailure(exception);
            }
        };
        this.onDeleteLine = function () {
            try {
                if (this.gridIT.api.getSelectedRows().length > 0) {
                    if (confirm("Are you sure you want to Delete selected row?")) {
                        this.gridIT.api.getSelectedRows().forEach(x => x.delete = true);
                        this.gridIT.api.getFilterInstance('delete').onFilterChanged();
                    }
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.gridIT.api);
                }
                else
                    this.toaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!');
            }
            catch (exception) {
                this.toaster.showFailure(exception);
            }
        };
        this.LoginUserId = null;
        sessionStorage.removeItem("lstProduct");
        this.LoginUserId = sessionStorage.getItem("UserId");
        this.LoadDropdown();
        this.FormGrid();
        this.MinDate.setDate(this.MinDate.getDate() - 30);
        this.MaxDate.setDate(this.MaxDate.getDate());
    }
    ngOnInit() {
        this.inventorytransferForm = this.formbulider.group({
            TransferNoteNo: [null, [forms_1.Validators.required]],
            TransferNoteDate: [null, [forms_1.Validators.required]],
            FromBranchCode: [null, [forms_1.Validators.required]],
            ToBranchCode: [null, [forms_1.Validators.required]],
            DocumentStatus: [null],
            StateId: [null],
            Owner: [null],
            IsCompleted: [null],
        });
        this.inventorytransferForm.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        //(<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = true;
        //(<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = true;
        this.HistoryVisibility(agFormHelper_1.agFormMode.Initialize);
        this.DisableGridButton();
        var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        if (_formid > 0) {
            this.get(_formid);
        }
    }
    //#region toolbar functions
    tbAdd() {
        this.inventorytransferForm.reset();
        this.inventorytransferForm.enable();
        this.inventorytransferForm.controls.TransferNoteNo.disable();
        this.inventorytransferForm.patchValue({ TransferNoteDate: new Date(), StateId: 0, DocumentStatus: "New", IsCompleted: false });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        //(<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = false;
        //(<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = false;
        this.inventorytransferForm.controls.DocumentStatus.disable();
        this.EnableGridButton();
        this.branch.focus();
    }
    tbEdit() {
        this.inventorytransferForm.enable();
        this.inventorytransferForm.controls.TransferNoteNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.HistoryVisibility(agFormHelper_1.agFormMode.Edit);
        this.EnableGridButton();
        //(<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = false;
        //(<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = false;
        this.inventorytransferForm.controls.DocumentStatus.disable();
        this.branch.focus();
    }
    tbSearch() {
        try {
            this.waitDlg.open({});
            this.inventorytransferService.GetList().subscribe(r => {
                this.searchDlg.open("Search & Select Inventory Transfer", this.searchColDefs, r);
                this.searchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.transferNoteNo);
                    }
                });
            }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
        }
        catch (e) {
            this.searchDlg.close();
            this.toaster.showFailure(e);
        }
    }
    tbHistory(formid) {
        try {
            this.waitDlg.open({});
            this.recipientService.GetFormHistory(this.Enum.WorkFlow('InventoryTransfer'), formid).subscribe(r => {
                this.historyDlg.open("Inventory Transfer" + formid, this.historyColDefs, r);
            }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
        }
        catch (e) {
            this.historyDlg.close();
            this.toaster.showFailure(e);
        }
    }
    tbRecall() {
        this.initializeForm();
        this.inventorytransferForm.controls.TransferNoteNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.transferNo.nativeElement.focus();
    }
    tbUndo() {
        this.initializeForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbSave() {
        try {
            this.inventorytransferForm.markAllAsTouched();
            if (!this.inventorytransferForm.invalid) {
                const InventoryTransfers = this.inventorytransferForm.getRawValue();
                InventoryTransfers.TransferNoteDate = common_1.formatDate(InventoryTransfers.TransferNoteDate, 'dd/MM/yyyy', 'en-US');
                InventoryTransfers.details = this.getITDataFromGrid();
                InventoryTransfers.footer = this.footer;
                this.Validate(InventoryTransfers);
                if (this.errors.length > 0) { return; }
                else {
                    this.waitDlg.open({});
                    this.inventorytransferService.Save(InventoryTransfers).subscribe(data => {
                        //this.initializeForm();          
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                        this.toaster.showSuccess('Inventory Transfer # ' + data.ItNo +
                            ' saved successfully. Press Click Transfer  button to Transfer this Inventory!');
                        this.inventorytransferForm.controls['TransferNoteNo'].setValue(data.itNo);
                        this.inventorytransferForm.controls['Owner'].setValue(data.owner);
                        this.inventorytransferForm.controls['StateId'].setValue(1);
                        this.inventorytransferForm.controls['DocumentStatus'].setValue('Saved');
                        this.footer.createdBy = data.owner;
                        InventoryTransfers.details.forEach(o => o.add = false);
                        InventoryTransfers.details.forEach(o => o.edit = false);
                        InventoryTransfers.details.forEach(o => o.delete = false);
                        this.inventorytransferForm.enable();
                        this.HistoryVisibility(agFormHelper_1.agFormMode.ReadOnly);
                    }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.waitDlg.close();
            this.toaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
    //#region FormSubmission
    tbFormSubmission(formid, stateid) {
        this.waitDlg.open({});
        let rlist;
        return new Promise((resolve, reject) => {
            try {
                if (stateid == 9) {
                    rlist = this.recipientService.GetInventoryTransferRecipientList(formid);
                }
                else if (stateid == 10) {
                    rlist = this.recipientService.GetInventoryTransferOwnerList(formid);
                }
                rxjs_1.forkJoin([rlist]).subscribe(results => {
                    this.lstRecipientList = results[0];
                    if (this.lstRecipientList === undefined || this.lstRecipientList.length == 0) {
                        this.toaster.showWarning("No submission user is configured for selected Form State." +
                            "Submission process can not be executed while submission users are missing" +
                            "Please raise Service Request through eForms if you require any support from IT Department");
                        this.waitDlg.close();
                        return;
                    }
                    else {
                        this.formsubmissionDlg.open(this.Enum.DocumentStatus(stateid) + "--" + formid, this.Enum.DocumentStatus(stateid), this.lstRecipientList);
                        this.formsubmissionDlg.selected().subscribe(r => {
                            if (r) {
                                if (r.recipientId !== undefined) {
                                    this.submission.formId = formid;
                                    this.submission.comments = r.SubmissionComment;
                                    this.submission.owner = r.recipientId;
                                    this.submission.stateId = stateid;
                                    this.submission.userId = this.LoginUserId;
                                    this.FormSubmitted(this.submission);
                                }
                                else {
                                    this.toaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                                        "Submission process can not be executed while submission users are missing");
                                    return;
                                }
                            }
                        }, error => { this.toaster.showFailure(error); }, () => { this.formsubmissionDlg.close(); this.waitDlg.close(); });
                    }
                });
                resolve(true);
            }
            catch (e) {
                this.waitDlg.close();
                this.toaster.showFailure(e);
                reject(e);
            }
        });
    }
    FormSubmitted(sub) {
        if (sub.stateId == 9) {
            this.inventorytransferService.Transfer(sub).subscribe(() => {
                alert('Submit operation was successful. Inventory Transfer # ' + sub.formId +
                    ' was successfully submitted to ' + this.submission.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
                this.router.navigate(['/MainForm']);
            }, error => { this.toaster.showFailure(error); }, () => { });
        }
        else {
            sub.completed = true;
            this.inventorytransferService.Receive(sub).subscribe(() => {
                alert('Submit operation was successful. Inventory Transfer # ' + sub.formId +
                    ' was successfully submitted to ' + this.submission.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
                this.router.navigate(['/MainForm']);
            }, error => { this.toaster.showFailure(error); }, () => { });
        }
    }
    getITDataFromGrid() {
        let rowData = [];
        this.gridIT.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    FormGrid() {
        this.gridIT = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                sortable: true,
                filter: true,
                resizable: true
            },
            columnDefs: this.colIT,
            rowData: [],
            rowSelection: 'single',
            enableSorting: true,
            //alwaysShowVerticalScroll: true,
            onCellClicked: function (event) {
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                // var RowNo = params.rowIndex;
                // const rowNode = this.gridInventoryTransfer.api.getDisplayedRowAtIndex(RowNo);
                if (params.colDef.field == "productId") {
                    var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
                    var Price = lstProduct.filter(function (item) {
                        return item.productId == params.data.productId;
                    }).map(function (lstProduct) {
                        return lstProduct.purchasePrice;
                    });
                    var UOMName = lstProduct.filter(function (item) {
                        return item.productId == params.data.productId;
                    }).map(function (lstProduct) {
                        return lstProduct.uomName;
                    });
                    var UOMId = lstProduct.filter(function (item) {
                        return item.productId == params.data.productId;
                    }).map(function (lstProduct) {
                        return lstProduct.uomId;
                    });
                    Price = Price[0];
                    UOMName = UOMName[0];
                    UOMId = UOMId[0];
                    params.node.setDataValue('price', Price);
                    params.node.setDataValue('uomName', UOMName);
                    params.node.setDataValue('uomId', UOMId);
                    params.node.setDataValue("productId", parseInt(params.data.productId));
                }
            },
            onGridReady: () => {
                //this.gridIT.api.sizeColumnsToFit();
            }
        };
    }
    //setGridData() {
    //  if (this.InventoryTransfers != null) {
    //    this.gridIT.api.setRowData(this.InventoryTransfers.details);
    //    agGridHelper.setGridDeleteFilter(this.gridIT.api);
    //  }
    //  else {
    //    this.gridIT.api.setRowData([]);
    //  }
    //}
    //#endregion
    //#region local functions
    get(Id) {
        this.waitDlg.open({});
        try {
            this.inventorytransferService.Get(Id).subscribe(it => {
                if (it) {
                    this.inventorytransferForm.disable();
                    this.inventorytransferForm.controls['TransferNoteNo'].setValue(it.transferNoteNo);
                    this.inventorytransferForm.controls['TransferNoteDate'].setValue(new Date(it.transferNoteDate));
                    this.inventorytransferForm.controls['FromBranchCode'].setValue(it.fromBranchCode);
                    this.inventorytransferForm.controls['ToBranchCode'].setValue(it.toBranchCode);
                    this.inventorytransferForm.controls['StateId'].setValue(it.stateId);
                    if (it.stateId == 1) {
                        it.documentStatus = "Saved";
                    }
                    else if (it.stateId == 9) {
                        it.documentStatus = "Transferred (InTransit)";
                    }
                    else if (it.stateId == 10) {
                        it.documentStatus = "Received";
                    }
                    this.inventorytransferForm.controls['DocumentStatus'].setValue(it.documentStatus);
                    this.inventorytransferForm.controls['Owner'].setValue(it.owner);
                    this.inventorytransferForm.controls['IsCompleted'].setValue(it.isCompleted);
                    this.rowITDetailData = it.details;
                    this.footer = it.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.HistoryVisibility(agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.toaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.toaster.showFailure(error); }, () => { this.waitDlg.close(); });
        }
        catch (e) {
            this.waitDlg.close();
            this.toaster.showFailure(e);
        }
    }
    LoadDropdown() {
        try {
            this.inventorytransferService.GetLookup().subscribe(data => {
                this.lstFromBranch = data.lstFBranch;
                this.lstToBranch = data.lstTBranch;
                sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
            }, error => {
                this.toaster.showFailure(error);
            });
        }
        catch (e) {
            this.toaster.showFailure(e);
        }
    }
    DisableGridButton() {
        this.isDisabled = true;
        //if (document.getElementById('btnGridAdd') as HTMLInputElement != null) {
        //  (<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = true;
        //  (<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = true;
        //}
    }
    EnableGridButton() {
        this.isDisabled = false;
        //if (document.getElementById('btnGridAdd') as HTMLInputElement != null) {
        //  (<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = false;
        //  (<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = false;
        //}
    }
    Validate(IT) {
        this.errors = [];
        if (IT.StateId > 1) {
            this.errors.push('No further changes can be made to this Inventory Transfer at this stage!');
        }
        if (IT.TransferNoteDate == null) {
            this.errors.push('Please Select Transfer Date');
        }
        if (IT.FromBranchCode == IT.ToBranchCode) {
            this.errors.push('From & To Branch cant be same for transfer operation');
        }
        // else if (IT.DocumentStatus != Enums.DocumentStatus.New && it.DocumentStatus != Enums.DocumentStatus.Saved)
        // {
        //  this.errors.push('No changes can be made to Inventory Transfer transaction at this stage');
        // }
        else if (Object.keys(IT.details).length == 0) {
            this.errors.push('Atleast one product must exist in Inventory Transfer Transaction to perform save operation');
        }
        if (IT.details.some(x => x.productId == null)) {
            this.errors.push('No row in Transfer Transaction can have empty Product');
        }
        else if (Object.keys(IT.details).length != 0) {
            var valueArr = IT.details.filter(x => !x.delete).map(function (item) { return item.productId; });
            var isDuplicate = valueArr.some(function (item, idx) {
                return valueArr.indexOf(item) != idx;
            });
            if (isDuplicate) {
                this.errors.push('Product used in IT must be unique');
            }
        }
        if (IT.details.some(x => x.quantity <= 0)) {
            this.errors.push('No row in Transfer Transaction can contain zero quantity');
        }
    }
    HistoryVisibility(formMode) {
        if (formMode == agFormHelper_1.agFormMode.ReadOnly || formMode == agFormHelper_1.agFormMode.Review) {
            // document.getElementById('btnHistory').style.visibility = 'visible'; // show
            //if (document.getElementById('btnHistory') as HTMLInputElement != null) {
            //  (<HTMLInputElement>document.getElementById("btnHistory")).disabled = false;
            //}
            //if (document.getElementById('btnTransfer') as HTMLInputElement != null) {
            //  (<HTMLInputElement>document.getElementById("btnTransfer")).disabled = false;
            //}
            //if (document.getElementById('btnReceived') as HTMLInputElement != null) {
            //  (<HTMLInputElement>document.getElementById("btnReceived")).disabled = false;
            //}
            this.isFormbuttonDisabled = false;
        }
        else {
            this.isFormbuttonDisabled = true;
            //if (document.getElementById('btnHistory') as HTMLInputElement != null) {
            //  (<HTMLInputElement>document.getElementById("btnHistory")).disabled = true;
            //}
            //if (document.getElementById('btnTransfer') as HTMLInputElement != null) {
            //  (<HTMLInputElement>document.getElementById("btnTransfer")).disabled = true;
            //}
            //if (document.getElementById('btnReceived') as HTMLInputElement != null) {
            //  (<HTMLInputElement>document.getElementById("btnReceived")).disabled = true;
            //}
        }
    }
    initializeForm() {
        this.inventorytransferForm.reset();
        this.inventorytransferForm.disable();
        this.inventorytransferForm.patchValue({ StateId: 0 });
        this.errors = [];
        this.gridIT.api.setRowData([]);
        this.HistoryVisibility(agFormHelper_1.agFormMode.Initialize);
        this.DisableGridButton();
    }
};
__decorate([
    core_1.ViewChild('branch', { static: true })
], InventoryTransferComponent.prototype, "branch", void 0);
__decorate([
    core_1.ViewChild('transferNo', { static: true })
], InventoryTransferComponent.prototype, "transferNo", void 0);
InventoryTransferComponent = __decorate([
    core_1.Component({
        selector: 'app-inventorytransfer',
        templateUrl: './inventorytransfer.component.html',
        styleUrls: ['./inventorytransfer.component.css']
    })
], InventoryTransferComponent);
exports.InventoryTransferComponent = InventoryTransferComponent;
//# sourceMappingURL=inventorytransfer.component.js.map
