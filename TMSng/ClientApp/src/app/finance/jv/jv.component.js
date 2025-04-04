"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JVComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let JVComponent = class JVComponent {
    //#endregion
    constructor(router, formbulider, svcJV, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcJV = svcJV;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        this.optionName = 'Journal Voucher';
        this.colSearch = [
            { headerName: 'Voucher #', field: 'voucherNo', },
            { headerName: 'Voucher Date', field: 'voucherDate' },
            { headerName: 'Period', field: 'periodName' },
            { headerName: 'Source #', field: 'sourceVoucherNo' },
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
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'red' }
            },
            {
                headerName: "Credit", field: "credit", type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
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
                this.svcToaster.showFailure(exception, 'Add Line:');
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
        this.periodId = agFormHelper_1.agFormHelper.glPeriodId();
    }
    ngOnInit() {
        this.frmJV = this.formbulider.group({
            voucherNo: [null, [forms_1.Validators.required]],
            voucherDate: [null, [forms_1.Validators.required]],
            periodId: [null, [forms_1.Validators.required]],
            periodName: [null],
            narration: [null],
            reversedVoucherNo: [null],
            sourceVoucherNo: [null]
        });
        this.frmJV.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
    }
    //#region toolbar functions
    tbAdd() {
        this.frmJV.reset();
        this.frmJV.enable();
        this.frmJV.controls.voucherNo.disable();
        this.frmJV.patchValue({ voucherDate: new Date(), periodId: this.periodId });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.narration.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcJV.getVouchers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Journal Voucher", this.colSearch, r);
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
        this.frmJV.controls.voucherNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.voucherNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmJV.enable();
        this.frmJV.controls.voucherNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.narration.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    tbSave() {
        try {
            this.frmJV.markAllAsTouched();
            if (!this.frmJV.invalid) {
                var formData = this.frmJV.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcJV.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
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
        if (confirm('You are about to reverse Journal Voucher # ' + voucherNo + '. Are you sure you want to reverse this transaction?')) {
            this.svcWaitDlg.open({});
            this.svcJV.reverse(voucherNo).subscribe(() => {
                this.svcToaster.showSuccess('Journal Voucher # ' + voucherNo + ' reversed sucessfully!');
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
            this.svcJV.get(Id).subscribe(jv => {
                if (jv) {
                    this.frmJV.disable();
                    this.frmJV.controls['voucherNo'].setValue(jv.voucherNo);
                    this.frmJV.controls['voucherDate'].setValue(new Date(jv.voucherDate));
                    this.frmJV.controls['narration'].setValue(jv.narration);
                    this.frmJV.controls['periodId'].setValue(jv.periodId);
                    this.frmJV.controls['periodName'].setValue(jv.periodName);
                    this.frmJV.controls['reversedVoucherNo'].setValue(jv.reversedVoucherNo);
                    this.frmJV.controls['sourceVoucherNo'].setValue(jv.sourceVoucherNo);
                    this.detailData = jv.details;
                    this.footer = jv.footer;
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
    loadLookup() {
        try {
            this.svcJV.getLookup().subscribe(data => {
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
    validate(jv) {
        this.errors = [];
        if (Object.keys(jv.details).length == 0) {
            this.errors.push('Atleast one entry must exist in JV detail to perform save operation');
        }
        if (jv.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
            this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
        }
        if (jv.details.some(x => x.debit < 0 || x.credit < 0)) {
            this.errors.push('None of Debit & Credit value could be less than zero');
        }
        var rn = this.goDetail.api.getPinnedBottomRow(0);
        if (rn.data.debit != rn.data.credit || rn.data.debit == 0 || rn.data.credit == 0) {
            this.errors.push('The total of Debit and Credit must match and non-zero.');
        }
    }
    initForm() {
        this.frmJV.reset();
        this.frmJV.disable();
        this.errors = [];
        this.detailData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        this.footer = new footer_1.agFooter();
        this.frmJV.patchValue({ voucherDate: new Date(), periodId: this.periodId });
    }
};
__decorate([
    core_1.ViewChild('narration', { static: true })
], JVComponent.prototype, "narration", void 0);
__decorate([
    core_1.ViewChild('voucherNo', { static: true })
], JVComponent.prototype, "voucherNo", void 0);
JVComponent = __decorate([
    core_1.Component({
        selector: 'app-journalvoucher',
        templateUrl: './jv.component.html',
        styleUrls: ['./jv.component.css']
    })
], JVComponent);
exports.JVComponent = JVComponent;
//# sourceMappingURL=jv.component.js.map