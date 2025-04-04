"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReceiptComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let ReceiptComponent = class ReceiptComponent {
    //#endregion
    constructor(router, formbulider, svcReceipt, svcToaster, Enum, svcWaitDlg, svcSearchDlg, svcOSInvoice) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcReceipt = svcReceipt;
        this.svcToaster = svcToaster;
        this.Enum = Enum;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcOSInvoice = svcOSInvoice;
        this.optionName = 'Receipt';
        this.colSearch = [
            { headerName: 'Receipt #', field: 'receiptNo', },
            { headerName: 'Receipt Date', field: 'receiptDate' },
            { headerName: 'Client Name', field: 'clientName' },
            { headerName: 'Cheque #', field: 'chequeNo' },
            { headerName: 'Amount', field: 'amount' },
            { headerName: 'Period', field: 'periodName' },
            { headerName: 'Source #', field: 'sourceReceiptNo' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region receipt Grid Definition & functions
        this.colDetail = [
            {
                headerName: "Account", field: "accountId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'Account', class: "250" }, valueFormatter: agGridHelper_1.agGridHelper.getAccountName, width: 250,
                pinned: 'left', lockPinned: true
            },
            {
                headerName: "Branch", field: "branchId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'Branch', class: "150" }, valueFormatter: agGridHelper_1.agGridHelper.getBranchName, width: 150,
                pinned: 'left', lockPinned: true
            },
            {
                headerName: "Dept", field: "deptId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                cellEditorParams: { source: 'Department', class: "150" }, valueFormatter: agGridHelper_1.agGridHelper.getDepartmentName, width: 150,
                pinned: 'left', lockPinned: true
            },
            {
                headerName: "Desc", field: "description", width: 250, cellEditor: "agLargeTextCellEditor"
            },
            {
                headerName: "Debit", field: "debit", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'red' }
            },
            {
                headerName: "Credit", field: "credit", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
            },
            { headerName: "Readonly", field: "readOnly", hide: true, suppressColumnsToolPanel: true }
        ];
        this.loadLookup();
        this.initGrid();
        this.periodId = agFormHelper_1.agFormHelper.arPeriodId();
        this.arId = agFormHelper_1.agFormHelper.arId();
    }
    ngOnInit() {
        this.frmReceipt = this.formbulider.group({
            receiptNo: [null, [forms_1.Validators.required]],
            receiptDate: [null, [forms_1.Validators.required]],
            clientId: [null, [forms_1.Validators.required]],
            bankAccountId: [null, [forms_1.Validators.required]],
            chequeNo: [null, [forms_1.Validators.required]],
            chequeDate: [null, [forms_1.Validators.required]],
            narration: [null],
            amount: [null, [forms_1.Validators.required]],
            periodId: [null, [forms_1.Validators.required]],
            periodName: [null],
            reversedReceiptNo: [null],
            sourceReceiptNo: [null]
        });
        this.frmReceipt.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmReceipt.reset();
        this.frmReceipt.enable();
        this.frmReceipt.controls.receiptNo.disable();
        this.frmReceipt.patchValue({ receiptDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.accountId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
    }
    tbRecall() {
        this.initForm();
        this.frmReceipt.controls.receiptNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.receiptNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcReceipt.getReceipts().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Reciept", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.receiptNo);
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
        this.frmReceipt.enable();
        this.frmReceipt.controls.receiptNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.accountId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    tbSave() {
        try {
            this.frmReceipt.markAllAsTouched();
            if (!this.frmReceipt.invalid) {
                var formData = this.frmReceipt.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.allocations = JSON.parse(sessionStorage.getItem("allocations"));
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcReceipt.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
                        this.setFooter();
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
        this.router.navigate(['/MainForm']);
    }
    tbReverse(receiptNo) {
        if (confirm('You are about to reverse Receipt # ' + receiptNo + '. Are you sure you want to reverse this transaction?')) {
            this.svcWaitDlg.open({});
            this.svcReceipt.reverse(receiptNo).subscribe(() => {
                this.svcToaster.showSuccess('Receipt # ' + receiptNo + ' reversed sucessfully!');
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    tbAllocation() {
        try {
            if (!this.frmReceipt.controls['clientId'].value) {
                this.svcToaster.showFailure('Please select valid Client before hitting Allocation button', 'Client Missing');
            }
            else {
                this.svcWaitDlg.open({});
                this.svcOSInvoice.open(this.frmReceipt.controls['clientId'].value, this.frmReceipt.controls['receiptNo'].value);
                this.svcOSInvoice.selected().subscribe(total => {
                    if (total) {
                        if (total != 0) {
                            this.frmReceipt.controls.clientId.disable();
                            this.frmReceipt.controls.amount.disable();
                            this.frmReceipt.controls['amount'].setValue(total);
                            var arId = this.arId, arNode;
                            this.goDetail.api.forEachNode(function (rowNode, index) {
                                if (rowNode.data.accountId == arId && rowNode.data.readOnly) {
                                    arNode = rowNode;
                                }
                            });
                            if (arNode) {
                                if (total >= 0) {
                                    arNode.setDataValue("credit", total);
                                    arNode.setDataValue("debit", 0);
                                }
                                else {
                                    arNode.setDataValue("debit", Math.abs(total));
                                    arNode.setDataValue("credit", 0);
                                }
                            }
                            else {
                                this.goDetail.api.applyTransaction({
                                    add: [{
                                            accountId: this.arId, departmentId: null, branchId: null, clientId: null, debit: total < 0 ? Math.abs(total) : 0,
                                            credit: total >= 0 ? total : 0, description: null, readOnly: true
                                        }]
                                });
                            }
                            this.setFooter();
                        }
                    }
                }, () => { }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcOSInvoice.close();
            this.svcToaster.showFailure(e);
        }
    }
    onAddLine() {
        try {
            var res = this.goDetail.api.applyTransaction({
                add: [{
                        accountId: null, branchId: null, deptId: null, debit: 0, credit: 0, description: null, readOnly: false
                    }]
            });
            this.goDetail.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "accountId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line:');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (confirm("Are you sure you want to Delete selected row?")) {
                const selectedRow = this.goDetail.api.getFocusedCell();
                if (selectedRow) {
                    var rowNode = this.goDetail.api.getRowNode(selectedRow.rowIndex.toString());
                    if (!rowNode.data.readOnly && !rowNode.rowPinned) {
                        this.goDetail.api.selectNode(rowNode);
                        this.goDetail.api.applyTransaction({ remove: this.goDetail.api.getSelectedRows() });
                        this.setFooter();
                    }
                    else {
                        this.svcToaster.showFailure("The selected row is system generated row hence no changes/delete operation is allowed on this Row!");
                    }
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
    generateEntries() {
        try {
            if (!this.frmReceipt.controls.receiptNo.value) {
                var drNode, crNode, drAccount, crAccount, amount;
                amount = this.frmReceipt.controls.amount.value;
                drAccount = amount >= 0 ? this.frmReceipt.controls.bankAccountId.value : this.arId;
                crAccount = amount >= 0 ? this.arId : this.frmReceipt.controls.bankAccountId.value;
                this.goDetail.api.forEachNode(function (rowNode, index) {
                    if (rowNode.data.accountId && rowNode.data.readOnly) {
                        if (rowNode.data.debit == 0 && rowNode.data.credit == 0) {
                            if (rowNode.data.accountId == crAccount) {
                                crNode = rowNode;
                            }
                            else if (rowNode.data.accountId == drAccount) {
                                drNode = rowNode;
                            }
                        }
                        else if (rowNode.data.debit > 0) {
                            drNode = rowNode;
                        }
                        else if (rowNode.data.credit > 0) {
                            crNode = rowNode;
                        }
                    }
                });
                if (drNode) {
                    drNode.setDataValue("accountId", drAccount);
                    drNode.setDataValue("debit", amount);
                }
                else if (drAccount && amount) {
                    this.goDetail.api.applyTransaction({
                        add: [{
                                accountId: drAccount, branchId: null, departmentId: null, debit: amount, credit: 0, description: null, readOnly: true
                            }]
                    });
                }
                if (crNode) {
                    crNode.setDataValue("accountId", crAccount);
                    crNode.setDataValue("credit", amount);
                }
                else if (crAccount && amount) {
                    this.goDetail.api.applyTransaction({
                        add: [{
                                accountId: crAccount, branchId: null, departmentId: null, debit: 0, credit: amount, description: null, readOnly: true
                            }]
                    });
                }
                this.setFooter();
            }
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    setFooter() {
        try {
            let _debit = 0, _credit = 0, _delta = 0, bankNode, bankId = this.frmReceipt.controls.bankAccountId.value;
            this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId != undefined) {
                    _debit += rowNode.data.debit, _credit += rowNode.data.credit;
                }
                if (rowNode.data.readOnly && rowNode.data.accountId == bankId) {
                    bankNode = rowNode;
                }
            });
            if (bankNode) {
                _delta = _debit - _credit - bankNode.data.debit + bankNode.data.credit;
                bankNode.setDataValue("credit", _delta >= 0 ? _delta : 0);
                bankNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
                _debit = 0;
                _credit = 0;
                this.goDetail.api.forEachNode(function (rowNode, index) {
                    if (rowNode.data.accountId != undefined) {
                        _debit += rowNode.data.debit, _credit += rowNode.data.credit;
                    }
                });
            }
            this.goDetail.api.setPinnedBottomRowData([{
                    accountId: null, departmentId: null, branchId: null,
                    clientId: null, debit: _debit, credit: _credit, descrption: null, readOnly: true
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    getDetailFromGrid() {
        let rowData = [];
        this.goDetail.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goDetail = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: this.allowDetailEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
                else if (params.node.data.readOnly) {
                    return { 'color': 'darkgray', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.colDef.field == "accountId") {
                    params.node.setDataValue("accountId", parseInt(params.data.accountId));
                }
                if (params.colDef.field == "branchId") {
                    params.node.setDataValue("branchId", parseInt(params.data.branchId));
                }
                if (params.colDef.field == "deptId") {
                    params.node.setDataValue("deptId", parseInt(params.data.deptId));
                }
            },
            onRowDataChanged: () => { this.setFooter(); }
        };
    }
    allowDetailEdit(params) {
        return !params.node.isRowPinned() && !params.node.data.readOnly;
    }
    grdDetailCellValueChanged(params) {
        if (!params.data.readOnly && (params.column.getId() === "credit" || params.column.getId() === "debit")) {
            this.setFooter();
        }
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcReceipt.get(Id).subscribe(rc => {
                if (rc) {
                    this.frmReceipt.disable();
                    this.frmReceipt.controls['receiptNo'].setValue(rc.receiptNo);
                    this.frmReceipt.controls['receiptDate'].setValue(new Date(rc.receiptDate));
                    this.frmReceipt.controls['clientId'].setValue(rc.clientId);
                    this.frmReceipt.controls['bankAccountId'].setValue(rc.bankAccountId);
                    this.frmReceipt.controls['chequeNo'].setValue(rc.chequeNo);
                    this.frmReceipt.controls['chequeDate'].setValue(new Date(rc.chequeDate));
                    this.frmReceipt.controls['narration'].setValue(rc.narration);
                    this.frmReceipt.controls['amount'].setValue(rc.amount);
                    this.frmReceipt.controls['periodId'].setValue(rc.periodId);
                    this.frmReceipt.controls['periodName'].setValue(rc.periodName);
                    this.frmReceipt.controls['reversedReceiptNo'].setValue(rc.reversedReceiptNo);
                    this.frmReceipt.controls['sourceReceiptNo'].setValue(rc.sourceReceiptNo);
                    this.detailData = rc.details;
                    sessionStorage.setItem("allocations", JSON.stringify(rc.allocations));
                    this.footer = rc.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    document.getElementById('btnAllocation').disabled = true;
                    this.setFooter();
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcReceipt.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
                this.lstPeriod = data.lstPeriod;
                this.lstBankAccount = data.lstAccount.filter(x => x.parentAccountId === agFormHelper_1.agFormHelper.bankControlId());
                sessionStorage.setItem("lstAccount", JSON.stringify(data.lstAccount));
                sessionStorage.setItem("lstDepartment", JSON.stringify(data.lstDepartment));
                sessionStorage.setItem("lstBranch", JSON.stringify(data.lstBranch));
                sessionStorage.setItem("lstChequeBook", JSON.stringify(data.lstChequeBook));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(rc) {
        this.errors = [];
        if (Object.keys(rc.details).length == 0) {
            this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
        }
        if (!rc.chequeNo || !rc.chequeDate) {
            this.errors.push('Please select valid Cheque Book & relevant cheque');
        }
        if (rc.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
            this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
        }
        if (rc.details.some(x => x.debit < 0 || x.credit < 0)) {
            this.errors.push('None of Debit & Credit value could be less than zero');
        }
        let debit = 0, credit = 0;
        rc.details.forEach(a => { debit += a.debit; credit += a.credit; });
        if (debit != credit) {
            this.errors.push('The total of Debit / Credit must match');
        }
    }
    onBankChanged() {
        try {
            if (!this.frmReceipt.controls.receiptNo.value) {
                var bankNode, bankAccount = this.frmReceipt.controls.bankAccountId.value, arId = this.arId, amount = this.frmReceipt.controls.amount.value;
                this.goDetail.api.forEachNode(function (rowNode, index) {
                    if (rowNode.data.readOnly && rowNode.data.accountId != arId) {
                        bankNode = rowNode;
                    }
                });
                if (bankNode) {
                    bankNode.setDataValue("accountId", bankAccount);
                    bankNode.setDataValue("debit", amount > 0 ? amount : 0);
                    bankNode.setDataValue("credit", amount < 0 ? Math.abs(amount) : 0);
                }
                else if (bankAccount) {
                    this.goDetail.api.applyTransaction({
                        add: [{
                                accountId: bankAccount, branchId: null, departmentId: null, debit: amount > 0 ? amount : 0,
                                credit: amount < 0 ? Math.abs(amount) : 0, description: null, readOnly: true
                            }]
                    });
                }
                this.setFooter();
            }
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    initForm() {
        this.frmReceipt.reset();
        this.frmReceipt.disable();
        this.errors = [];
        this.detailData = [];
        sessionStorage.removeItem("allocations");
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        this.frmReceipt.patchValue({ receiptDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('bankAccountId', { static: true })
], ReceiptComponent.prototype, "accountId", void 0);
__decorate([
    core_1.ViewChild('receiptNo', { static: true })
], ReceiptComponent.prototype, "receiptNo", void 0);
ReceiptComponent = __decorate([
    core_1.Component({
        selector: 'app-receipt',
        templateUrl: './receipt.component.html',
        styleUrls: ['./receipt.component.css']
    })
], ReceiptComponent);
exports.ReceiptComponent = ReceiptComponent;
//# sourceMappingURL=receipt.component.js.map