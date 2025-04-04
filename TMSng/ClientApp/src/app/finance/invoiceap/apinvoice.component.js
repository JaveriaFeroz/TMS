"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let APInvoiceComponent = class APInvoiceComponent {
    //#endregion
    constructor(router, formbulider, svcPIV, svcToaster, Enum, svcWaitDlg, svcSearchDlg, svcOSSlip) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcPIV = svcPIV;
        this.svcToaster = svcToaster;
        this.Enum = Enum;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcOSSlip = svcOSSlip;
        this.optionName = 'Purchase Invoice';
        this.colSearch = [
            { headerName: 'PIV #', field: 'pivNo', },
            { headerName: 'PIV Date', field: 'pivDate' },
            { headerName: 'Supplier Name', field: 'supplierName' },
            { headerName: 'Supplier Inv #', field: 'supplierInvNo' },
            { headerName: 'Amount', field: 'Amount' },
            { headerName: 'Period', field: 'periodName' },
            { headerName: 'Source PIV #', field: 'sourcePIVNo' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region PIV Detail Grid Definition & functions
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
        this.periodId = agFormHelper_1.agFormHelper.apPeriodId();
        this.fuelExpACId = agFormHelper_1.agFormHelper.fuelExpACId();
        this.apId = agFormHelper_1.agFormHelper.apId();
    }
    ngOnInit() {
        this.frmPIV = this.formbulider.group({
            pivNo: [null, [forms_1.Validators.required]],
            pivDate: [null, [forms_1.Validators.required]],
            supplierId: [null, [forms_1.Validators.required]],
            supplierInvNo: [null, [forms_1.Validators.required]],
            supplierInvDate: [null, [forms_1.Validators.required]],
            amount: [null, [forms_1.Validators.required]],
            narration: [null],
            periodId: [null, [forms_1.Validators.required]],
            periodName: [null],
            reversedPIVNo: [null],
            sourcePIVNo: [null],
            hasSlip: [null],
            slipDateFrom: [null],
            slipDateTo: [null]
        });
        this.frmPIV.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmPIV.reset();
        this.frmPIV.enable();
        this.frmPIV.controls.pivNo.disable();
        this.frmPIV.patchValue({ pivDate: new Date(), supplierInvDate: new Date(), periodId: this.periodId, hasSlip: false });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.goDetail.api.applyTransaction({
            add: [{
                    accountId: this.apId, branchId: null, departmentId: null, debit: 0, credit: 0, description: null, readOnly: true
                }]
        });
        this.supplierId.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcPIV.getPIVs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Payment Invoice", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.pivNo);
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
        this.frmPIV.controls.pivNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.pivNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmPIV.enable();
        this.frmPIV.controls.pivNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.frmPIV.controls.hasSlip.disable();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        if (this.frmPIV.controls['hasSlip'].value) {
            document.getElementById("btnSlip").disabled = false;
        }
        this.frmPIV.controls.supplierId.disable();
    }
    tbSave() {
        try {
            this.frmPIV.markAllAsTouched();
            if (!this.frmPIV.invalid) {
                var formData = this.frmPIV.getRawValue();
                formData.details = this.getDetailFromGrid();
                if (formData.hasSlip) {
                    formData.slips = JSON.parse(sessionStorage.getItem("slips"));
                }
                else {
                    formData.slips = [];
                }
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcPIV.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Purchase Invoice saved Successfully');
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
    tbReverse(pivNo) {
        if (confirm('You are about to reverse Purchase Invoice # ' + pivNo + '. Are you sure you want to reverse this transaction?')) {
            this.svcWaitDlg.open({});
            this.svcPIV.reverse(pivNo).subscribe(() => {
                this.svcToaster.showSuccess('Purchase Invoice # ' + pivNo + ' reversed sucessfully!');
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    tbSlip() {
        try {
            if (!this.frmPIV.controls['supplierId'].value) {
                this.svcToaster.showFailure('Please select valid supplier before hitting slip button', 'Supplier missing');
            }
            else if (!this.frmPIV.controls['slipDateFrom'].value || !this.frmPIV.controls['slipDateTo'].value) {
                this.svcToaster.showFailure('Please select valid slip Date From & To before hitting slip button', 'Slip Date missing');
            }
            else if (this.frmPIV.controls['slipDateFrom'].value > this.frmPIV.controls['slipDateTo'].value) {
                this.svcToaster.showFailure('Date From must always be older or same as Date To', 'Invalid Date Range');
            }
            else {
                this.svcWaitDlg.open({});
                this.svcOSSlip.open(this.frmPIV.controls['supplierId'].value, this.frmPIV.controls['pivNo'].value, this.frmPIV.controls['slipDateFrom'].value, this.frmPIV.controls['slipDateTo'].value);
                this.svcOSSlip.selected().subscribe(total => {
                    if (total) {
                        if (total > 0) {
                            this.frmPIV.controls.supplierId.disable();
                            this.frmPIV.controls.hasSlip.disable();
                            this.frmPIV.controls.slipDateFrom.disable();
                            this.frmPIV.controls.slipDateTo.disable();
                            this.frmPIV.controls['amount'].setValue(Math.abs(total));
                            var fuelId = this.fuelExpACId, fuelNode;
                            this.goDetail.api.forEachNode(function (rowNode, index) {
                                if (rowNode.data.accountId == fuelId && rowNode.data.readOnly) {
                                    fuelNode = rowNode;
                                }
                            });
                            if (fuelNode) {
                                fuelNode.setDataValue("debit", total);
                                fuelNode.setDataValue("credit", 0);
                            }
                            else {
                                this.goDetail.api.applyTransaction({
                                    add: [{
                                            accountId: this.fuelExpACId, departmentId: null, branchId: null, clientId: null, debit: total, credit: 0, description: null, readOnly: true
                                        }]
                                });
                            }
                            this.setFooter();
                        }
                    }
                });
                () => { };
            }
        }
        catch (e) {
            this.svcOSSlip.close();
            this.svcToaster.showFailure(e);
        }
        finally {
            this.svcWaitDlg.close();
        }
    }
    onAddLine() {
        try {
            var res = this.goDetail.api.applyTransaction({
                add: [{
                        accountId: null, branchId: null, deptId: null, clientId: null, debit: 0, credit: 0, description: null, readOnly: false
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
    setFooter() {
        try {
            let _debit = 0, _credit = 0, _delta = 0, apNode, apId = this.apId;
            this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId != undefined) {
                    _debit += rowNode.data.debit, _credit += rowNode.data.credit;
                }
                if (rowNode.data.accountId == apId) {
                    apNode = rowNode;
                }
            });
            if (apNode) {
                _delta = _debit - _credit - apNode.data.debit + apNode.data.credit;
                apNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
                apNode.setDataValue("credit", _delta > 0 ? _delta : 0);
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
    //#endregion
    //#region local functions
    get(Id) {
        if (Id) {
            this.svcWaitDlg.open({});
            try {
                this.svcPIV.get(Id).subscribe(ia => {
                    if (ia) {
                        this.frmPIV.disable();
                        this.frmPIV.controls['pivNo'].setValue(ia.pivNo);
                        this.frmPIV.controls['pivDate'].setValue(new Date(ia.pivDate));
                        this.frmPIV.controls['supplierId'].setValue(ia.supplierId);
                        this.frmPIV.controls['supplierInvNo'].setValue(ia.supplierInvNo);
                        this.frmPIV.controls['supplierInvDate'].setValue(new Date(ia.supplierInvDate));
                        this.frmPIV.controls['narration'].setValue(ia.narration);
                        this.frmPIV.controls['amount'].setValue(ia.amount);
                        this.frmPIV.controls['reversedPIVNo'].setValue(ia.reversedPIVNo);
                        this.frmPIV.controls['sourcePIVNo'].setValue(ia.sourcePIVNo);
                        this.frmPIV.controls['periodId'].setValue(ia.periodId);
                        this.frmPIV.controls['periodName'].setValue(ia.periodName);
                        this.frmPIV.controls['hasSlip'].setValue(ia.hasSlip);
                        this.frmPIV.controls['slipDateFrom'].setValue(ia.slipDateFrom);
                        this.frmPIV.controls['slipDateTo'].setValue(ia.slipDateTo);
                        this.detailData = ia.details;
                        if (ia.hasSlip) {
                            sessionStorage.setItem("slips", JSON.stringify(ia.slips));
                        }
                        this.footer = ia.footer;
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
            this.svcPIV.getLookup().subscribe(data => {
                this.lstSupplier = data.lstSupplier;
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
    validate(piv) {
        this.errors = [];
        if (Object.keys(piv.details).length == 0) {
            this.errors.push('Atleast one entry must exist in AP Invoice detail to perform save operation');
        }
        else if (piv.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
            this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
        }
        else if (piv.details.some(x => x.debit < 0 || x.credit < 0)) {
            this.errors.push('None of Debit & Credit value could be less than zero');
        }
        let debit = 0;
        piv.details.forEach(a => debit += a.debit);
        if (debit != piv.amount) {
            this.errors.push('The total of Debit / Credit entry in Invoice detail must match Supplier Invoice Amount');
        }
    }
    grdDetailCellValueChanged(params) {
        if (!params.data.readOnly && (params.column.getId() === "credit" || params.column.getId() === "debit")) {
            this.setFooter();
        }
    }
    initForm() {
        this.frmPIV.reset();
        this.frmPIV.disable();
        this.errors = [];
        this.detailData = [];
        sessionStorage.removeItem("slips");
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        this.frmPIV.patchValue({ pivDate: new Date(), supplierInvDate: new Date(), periodId: this.periodId });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('supplierId', { static: true })
], APInvoiceComponent.prototype, "supplierId", void 0);
__decorate([
    core_1.ViewChild('pivNo', { static: true })
], APInvoiceComponent.prototype, "pivNo", void 0);
APInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-apinvoice',
        templateUrl: './apinvoice.component.html',
        styleUrls: ['./apinvoice.component.css']
    })
], APInvoiceComponent);
exports.APInvoiceComponent = APInvoiceComponent;
//# sourceMappingURL=apinvoice.component.js.map