"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let ARInvoiceComponent = class ARInvoiceComponent {
    //#endregion
    constructor(router, formbulider, svcARInvoice, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcARInvoice = svcARInvoice;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        this.optionName = 'AR Invoice';
        this.colSearch = [
            { headerName: 'Invoice #', field: 'invoiceNo', },
            { headerName: 'Invoice Date', field: 'invoiceDate' },
            { headerName: 'Client Name', field: 'clientName' },
            { headerName: 'Client Inv #', field: 'clientInvNo' },
            { headerName: 'Amount', field: 'amount' },
            { headerName: 'Period', field: 'periodName' },
            { headerName: 'Reverser Document #', field: 'sourceInvNo' },
        ];
        this.detailData = [];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region detail grid Definition & functions
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
        this.arId = agFormHelper_1.agFormHelper.arId();
    }
    ngOnInit() {
        this.frmInvoice = this.formbulider.group({
            invoiceNo: [null, [forms_1.Validators.required]],
            invoiceDate: [null, [forms_1.Validators.required]],
            clientId: [null, [forms_1.Validators.required]],
            clientInvNo: [null, [forms_1.Validators.required]],
            clientInvDate: [null, [forms_1.Validators.required]],
            amount: [null, [forms_1.Validators.required]],
            narration: [null],
            periodId: [null, [forms_1.Validators.required]],
            periodName: [null],
            reversedInvoiceNo: [null],
            sourceInvoiceNo: [null],
        });
        this.frmInvoice.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInvoice.reset();
        this.frmInvoice.enable();
        this.frmInvoice.controls.invoiceNo.disable();
        this.frmInvoice.patchValue({ invoiceDate: new Date(), clientInvDate: new Date(), periodId: this.periodId });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.goDetail.api.applyTransaction({
            add: [{
                    accountId: this.arId, branchId: null, departmentId: null, debit: 0, credit: 0, description: null, readOnly: true
                }]
        });
        this.clientId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcARInvoice.getInvoices().subscribe(r => {
                this.svcSearchDlg.open("Search & Select AR Invoice", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.invoiceNo);
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
        this.frmInvoice.controls.invoiceNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.invoiceNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmInvoice.enable();
        this.frmInvoice.controls.invoiceNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        this.frmInvoice.controls.clientId.disable();
    }
    tbSave() {
        try {
            this.frmInvoice.markAllAsTouched();
            if (!this.frmInvoice.invalid) {
                var formData = this.frmInvoice.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcARInvoice.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('AR invoice saved Successfully');
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
    tbReverse(invoiceNo) {
        if (confirm('You are about to reverse AR Invoice # ' + invoiceNo + '. Are you sure you want to reverse this transaction?')) {
            this.svcWaitDlg.open({});
            this.svcARInvoice.reverse(invoiceNo).subscribe(() => {
                this.svcToaster.showSuccess('AR Invoice # ' + invoiceNo + ' reversed successfully!');
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    setFooter() {
        try {
            let _debit = 0, _credit = 0, _delta = 0, arNode, arId = this.arId;
            this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId != undefined) {
                    _debit += rowNode.data.debit, _credit += rowNode.data.credit;
                }
                if (rowNode.data.accountId == arId) {
                    arNode = rowNode;
                }
            });
            if (arNode) {
                _delta = _debit - _credit - arNode.data.debit + arNode.data.credit;
                arNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
                arNode.setDataValue("credit", _delta > 0 ? _delta : 0);
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
        if (Id) {
            this.svcWaitDlg.open({});
            try {
                this.svcARInvoice.get(Id).subscribe(ar => {
                    if (ar) {
                        this.frmInvoice.disable();
                        this.frmInvoice.controls['invoiceNo'].setValue(ar.invoiceNo);
                        this.frmInvoice.controls['invoiceDate'].setValue(new Date(ar.invoiceDate));
                        this.frmInvoice.controls['clientId'].setValue(ar.clientId);
                        this.frmInvoice.controls['clientInvNo'].setValue(ar.clientInvNo);
                        this.frmInvoice.controls['clientInvDate'].setValue(new Date(ar.clientInvDate));
                        this.frmInvoice.controls['narration'].setValue(ar.narration);
                        this.frmInvoice.controls['amount'].setValue(ar.amount);
                        this.frmInvoice.controls['reversedInvoiceNo'].setValue(ar.reversedInvoiceNo);
                        this.frmInvoice.controls['sourceInvoiceNo'].setValue(ar.sourceInvoiceNo);
                        this.frmInvoice.controls['periodId'].setValue(ar.periodId);
                        this.frmInvoice.controls['periodName'].setValue(ar.periodName);
                        this.detailData = ar.details;
                        this.footer = ar.footer;
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
    }
    loadLookup() {
        try {
            this.svcARInvoice.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
                this.lstPeriod = data.lstPeriod;
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
    validate(ari) {
        this.errors = [];
        if (Object.keys(ari.details).length == 0) {
            this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
        }
        else if (ari.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
            this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
        }
        else if (ari.details.some(x => x.debit < 0 || x.credit < 0)) {
            this.errors.push('None of Debit & Credit value could be less than zero');
        }
        let debit = 0;
        ari.details.forEach(a => debit += a.debit);
        if (debit != ari.amount) {
            this.errors.push('The total of Debit / Credit entry in Invoice detail must match Customer Invoice Amount');
        }
    }
    initForm() {
        this.frmInvoice.reset();
        this.frmInvoice.disable();
        this.errors = [];
        this.detailData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        this.frmInvoice.patchValue({ invoiceDate: new Date(), clientInvDate: new Date(), periodId: this.periodId });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('clientId', { static: true })
], ARInvoiceComponent.prototype, "clientId", void 0);
__decorate([
    core_1.ViewChild('invoiceNo', { static: true })
], ARInvoiceComponent.prototype, "invoiceNo", void 0);
ARInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-arinvoice',
        templateUrl: './arinvoice.component.html',
        styleUrls: ['./arinvoice.component.css']
    })
], ARInvoiceComponent);
exports.ARInvoiceComponent = ARInvoiceComponent;
//# sourceMappingURL=arinvoice.component.js.map