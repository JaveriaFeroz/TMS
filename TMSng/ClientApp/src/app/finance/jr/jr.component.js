"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JRComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let JRComponent = class JRComponent {
    //#endregion
    constructor(router, formbulider, Enum, svcWaitDlg, svcJR, svcToaster, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.Enum = Enum;
        this.svcWaitDlg = svcWaitDlg;
        this.svcJR = svcJR;
        this.svcToaster = svcToaster;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Journal Receipt';
        this.colSearch = [
            { headerName: 'Voucher #', field: 'voucherNo', },
            { headerName: 'Voucher Date', field: 'voucherDate' },
            { headerName: 'Cheque #', field: 'chequeNo' },
            { headerName: 'Payer Name', field: 'payerName' },
            { headerName: 'Period', field: 'periodName' },
            { headerName: 'Source JR #', field: 'sourceJRNo' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region Detail Grid Definition & functions
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
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
            },
            {
                headerName: "Credit", field: "credit", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'red' }
            },
            { headerName: "Readonly", field: "readOnly", hide: true, suppressColumnsToolPanel: true }
        ];
        this.onAddLine = function () {
            try {
                var res = this.goDetail.api.applyTransaction({
                    add: [{
                            accountId: null, branchId: null, deptId: null, clientId: null, debit: 0, credit: 0, description: null, readOnly: false
                        }]
                });
                this.goDetail.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "accountId" });
            }
            catch (exception) {
                this.svcToaster.showFailure(exception, 'Add Line');
            }
        };
        this.onDeleteLine = function () {
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
        };
        this.loadLookup();
        this.initGrid();
        this.periodId = agFormHelper_1.agFormHelper.arPeriodId();
        // this.arId = agFormHelper.arId();
    }
    ngOnInit() {
        this.frmJR = this.formbulider.group({
            voucherNo: [null, [forms_1.Validators.required]],
            voucherDate: [null, [forms_1.Validators.required]],
            bankAccountId: [null, [forms_1.Validators.required]],
            chequeNo: [null, [forms_1.Validators.required]],
            chequeDate: [null, [forms_1.Validators.required]],
            payerName: [null, [forms_1.Validators.required]],
            amount: [null, [forms_1.Validators.required]],
            narration: [null],
            periodId: [null, [forms_1.Validators.required]],
            periodName: [null],
            reversedJRNo: [null],
            sourceJRNo: [null],
        });
        this.frmJR.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmJR.reset();
        this.frmJR.enable();
        this.frmJR.controls.voucherNo.disable();
        this.frmJR.patchValue({ voucherDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.accountId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcJR.getReceipts().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Journal Reciept", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.voucherNo);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbRecall() {
        this.initForm();
        this.frmJR.controls.voucherNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.voucherNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmJR.enable();
        this.frmJR.controls.voucherNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.accountId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    tbSave() {
        try {
            this.frmJR.markAllAsTouched();
            if (!this.frmJR.invalid) {
                var formData = this.frmJR.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcJR.save(formData).subscribe(() => {
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
    tbReverse(voucherNo) {
        if (confirm('You are about to reverse JR # ' + voucherNo + '. Are you sure you want to reverse this transaction?')) {
            this.svcWaitDlg.open({});
            this.svcJR.reverse(voucherNo).subscribe(() => {
                this.svcToaster.showSuccess('Journal Receipt # ' + voucherNo + ' reversed successfully!');
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    setFooter() {
        try {
            let _debit = 0, _credit = 0;
            this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId != undefined) {
                    _debit += rowNode.data.debit, _credit += rowNode.data.credit;
                }
            });
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
            this.svcJR.get(Id).subscribe(jr => {
                if (jr) {
                    this.frmJR.disable();
                    this.frmJR.controls['voucherNo'].setValue(jr.voucherNo);
                    this.frmJR.controls['voucherDate'].setValue(new Date(jr.voucherDate));
                    this.frmJR.controls['bankAccountId'].setValue(jr.bankAccountId);
                    this.frmJR.controls['chequeNo'].setValue(jr.chequeNo);
                    this.frmJR.controls['chequeDate'].setValue(new Date(jr.chequeDate));
                    this.frmJR.controls['payerName'].setValue(jr.payerName);
                    this.frmJR.controls['amount'].setValue(jr.amount);
                    this.frmJR.controls['narration'].setValue(jr.narration);
                    this.frmJR.controls['reversedJRNo'].setValue(jr.reversedJRNo);
                    this.frmJR.controls['sourceJRNo'].setValue(jr.sourceJRNo);
                    this.frmJR.controls['periodId'].setValue(jr.periodId);
                    this.frmJR.controls['periodName'].setValue(jr.periodName);
                    this.detailData = jr.details;
                    this.footer = jr.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
    onBankChanged() {
        try {
            if (!this.frmJR.controls.voucherNo.value) {
                var bankNode, bankAccount, amount;
                bankAccount = this.frmJR.controls.bankAccountId.value;
                amount = this.frmJR.controls.amount.value;
                this.goDetail.api.forEachNode(function (rowNode, index) {
                    if (rowNode.data.readOnly) {
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
    onBankAmountChanged() {
        try {
            let bankNode, bankId = this.frmJR.controls.bankAccountId.value, amount = this.frmJR.controls.amount.value;
            this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId == bankId && rowNode.data.readOnly) {
                    bankNode = rowNode;
                }
            });
            if (bankNode) {
                bankNode.setDataValue("debit", amount > 0 ? amount : 0);
                bankNode.setDataValue("credit", amount < 0 ? Math.abs(amount) : 0);
                this.setFooter();
            }
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    loadLookup() {
        try {
            this.svcJR.getLookup().subscribe(data => {
                this.lstPeriod = data.lstPeriod;
                this.lstBankAccount = data.lstAccount.filter(x => x.parentAccountId === agFormHelper_1.agFormHelper.bankControlId());
                sessionStorage.setItem("lstAccount", JSON.stringify(data.lstAccount));
                sessionStorage.setItem("lstDepartment", JSON.stringify(data.lstDepartment));
                sessionStorage.setItem("lstBranch", JSON.stringify(data.lstBranch));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(jr) {
        this.errors = [];
        if (Object.keys(jr.details).length == 0) {
            this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
        }
        else if (jr.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
            this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
        }
        else if (jr.details.some(x => x.debit < 0 || x.credit < 0)) {
            this.errors.push('None of Debit & Credit value could be less than zero');
        }
        let debit = 0, credit = 0;
        jr.details.forEach(a => { debit += a.debit; credit += a.credit; });
        if (debit != jr.amount || credit != debit) {
            this.errors.push('The total of Debit / Credit entry must match Bank Amount');
        }
    }
    initForm() {
        this.frmJR.reset();
        this.frmJR.disable();
        this.errors = [];
        this.detailData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        //this.frmJR.patchValue({ voucherDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('bankAccountId', { static: true })
], JRComponent.prototype, "accountId", void 0);
__decorate([
    core_1.ViewChild('voucherNo', { static: true })
], JRComponent.prototype, "voucherNo", void 0);
JRComponent = __decorate([
    core_1.Component({
        selector: 'app-journalreceipt',
        templateUrl: './jr.component.html',
        styleUrls: ['./jr.component.css']
    })
], JRComponent);
exports.JRComponent = JRComponent;
//# sourceMappingURL=jr.component.js.map