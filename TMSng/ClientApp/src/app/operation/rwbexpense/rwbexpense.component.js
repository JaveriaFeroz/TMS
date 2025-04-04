"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWBExpenseComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let RWBExpenseComponent = class RWBExpenseComponent {
    //#endregion
    constructor(router, formbulider, svcRWBExpense, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRWBExpense = svcRWBExpense;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        this.optionName = 'Rwb Expense';
        this.colSearch = [
            { headerName: 'Rwb #', field: 'rwbNo' },
            { headerName: 'JobOrder #', field: 'jobNo' },
            { headerName: 'RwbDate', field: 'rwbDate' },
            { headerName: 'ShipperName', field: 'shipperName' },
            { headerName: 'StatusName', field: 'stateName' },
        ];
        this.errors = [];
        this.frameworkComponents = {
            agDateEditor: agGrid_date_component_1.agGridDateEditor
        };
        this.footer = new footer_1.agFooter();
        //#region Rwb Expense Grid Definition & functions
        this.colExpense = [
            {
                headerName: 'Expenses',
                children: [
                    {
                        headerName: "Expense", field: "expenseId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'ExpenseHead', class: "240" },
                        valueFormatter: agGridHelper_1.agGridHelper.getExpenseHeadName, width: 240, lockPinned: true
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn", width: 90,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser,
                        cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
                    },
                    { headerName: "l", field: "locked", hide: true, suppressColumnsToolPanel: true },
                ]
            }
        ];
        //#endregion
        //#region Rwb Other Grid Definition & functions
        this.colCharges = [
            {
                headerName: 'Other Charges (Chargeable to customer)',
                children: [
                    {
                        headerName: "Charge", field: "chargeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'AccCharge', class: "180" }, valueFormatter: agGridHelper_1.agGridHelper.getAccChargeName, width: 180, lockPinned: true
                    },
                    {
                        headerName: "Description", field: "description", width: 200, cellEditor: "agLargeTextCellEditor"
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90,
                        lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        //#endregion
        //#region Fuel Supplier Grid Definition & functions
        this.colFuel = [
            {
                headerName: 'Cash Fuel (enroute Filling)',
                children: [
                    {
                        headerName: "Supplier", field: "supplierId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Supplier', class: "170" }, valueFormatter: agGridHelper_1.agGridHelper.getSupplierName, width: 170, lockPinned: true
                    },
                    {
                        headerName: "Slip#", field: "slipNo", width: 80,
                    },
                    {
                        headerName: "Slip Date", field: "slipDate", width: 80, cellEditor: 'agDateEditor', editable: true,
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Ltr", field: "litre", type: "numericColumn", width: 60, valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Rate", field: "rate", type: "numericColumn", width: 60, valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmRWBExpense = this.formbulider.group({
            rwbId: [null],
            rwbNo: [null, [forms_1.Validators.required]],
            branchId: [null, [forms_1.Validators.required]],
            comments: [null],
            jobId: [null],
            jobNo: [null],
            rwbDate: [null],
            jobDate: [null],
            jobStartDate: [null],
            jobStateName: [null],
            rwbStateName: [null],
            fuelAvg: [null],
            transitTime: [null],
        });
        this.frmRWBExpense.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmRWBExpense.controls.rwbNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.rwbno.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcRWBExpense.getRWBs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Rwb", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.rwbNo);
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
        this.frmRWBExpense.enable();
        this.frmRWBExpense.controls.rwbNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.branch.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        if (this.frmRWBExpense.controls["jobStateName"].value == "Closed")
            this.disableSave();
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmRWBExpense.markAllAsTouched();
            if (!this.frmRWBExpense.invalid) {
                var formData = this.frmRWBExpense.getRawValue();
                formData.expenses = this.getExpenseDataFromGrid();
                formData.charges = this.getChargeDataFromGrid();
                if (!agFormHelper_1.agFormHelper.enableGL()) {
                    formData.cashFuels = [];
                }
                else {
                    formData.cashFuels = this.getFuelDataFromGrid();
                }
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcRWBExpense.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstExpense");
        sessionStorage.removeItem("lstSupplier");
        sessionStorage.removeItem("lstAccCharge");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goExpense = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: this.allowDetailEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
                else if (params.node.data.locked) {
                    return { 'color': 'darkgray', 'font-style': 'italic' };
                }
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "expenseId") {
                    if (params.data.expenseId != "") {
                        params.node.setDataValue("expenseId", parseInt(params.data.expenseId));
                    }
                    else {
                        params.node.setDataValue("expenseId", null);
                    }
                }
            },
            onRowDataChanged: () => { this.setExpenseFooter(); }
        };
        this.goCharges = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: this.allowDetailEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
                else if (params.node.data.locked) {
                    return { 'color': 'darkgray', 'font-style': 'italic' };
                }
            },
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
            onRowDataChanged: () => { this.setChargeFooter(); }
        };
        this.goFuel = {
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
                    return { 'font-weight': 'bold', color: 'blue', 'background-color': 'lightgray' };
                }
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "supplierId") {
                    if (params.data.supplierId != "") {
                        params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
                    }
                    else {
                        params.node.setDataValue("supplierId", null);
                    }
                }
            },
            onRowDataChanged: () => { this.setFuelFooter(); }
        };
    }
    onAddExpenseLine() {
        try {
            var res = this.goExpense.api.applyTransaction({
                add: [{
                        expenseId: null, amount: 0, add: true, locked: false
                    }]
            });
            this.goExpense.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "expenseId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    setExpenseFooter() {
        try {
            let _amount = 0;
            this.goExpense.api.forEachNode(function (rowNode, index) {
                if (!rowNode.data.delete) {
                    _amount += rowNode.data.amount;
                }
            });
            this.goExpense.api.setPinnedBottomRowData([{
                    expenseId: null, amount: _amount
                }]);
            //this.TotalVehicleFuel = _qtytotal;
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    getExpenseDataFromGrid() {
        let rowData = [];
        this.goExpense.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddChargeLine() {
        try {
            var res = this.goCharges.api.applyTransaction({
                add: [{
                        chargeId: null, description: null, amount: 0, add: true, edit: false, delete: false, locked: false
                    }]
            });
            this.goCharges.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteChargeLine() {
        try {
            if (confirm("Are you sure you want to Delete selected row?")) {
                const selectedRow = this.goCharges.api.getFocusedCell();
                if (selectedRow) {
                    var rowNode = this.goCharges.api.getRowNode(selectedRow.rowIndex.toString());
                    if (!rowNode.data.locked) {
                        this.goCharges.api.getSelectedRows().forEach(x => x.delete = true);
                        agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goCharges.api);
                        this.setChargeFooter();
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
    setChargeFooter() {
        try {
            let _amount = 0;
            this.goCharges.api.forEachNode(function (rowNode, index) {
                if (!rowNode.data.delete) {
                    _amount += rowNode.data.amount;
                }
            });
            this.goCharges.api.setPinnedBottomRowData([{
                    chargeId: null, description: null, amount: _amount, locked: true
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    getChargeDataFromGrid() {
        let rowData = [];
        this.goCharges.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddFuelLine() {
        try {
            var res = this.goFuel.api.applyTransaction({
                add: [{
                        supplierId: null, slipNo: null, slipDate: null, litre: 0, rate: 0, add: true, edit: false, delete: false
                    }]
            });
            this.goFuel.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "supplierId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteFuelLine() {
        try {
            if (this.goFuel.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goFuel.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goFuel.api);
                    this.setFuelFooter();
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
    setFuelFooter() {
        try {
            let _litre = 0;
            this.goFuel.api.forEachNode(function (rowNode, index) {
                if (!rowNode.data.delete) {
                    _litre += rowNode.data.litre;
                }
            });
            this.goFuel.api.setPinnedBottomRowData([{
                    supplierId: null, slipNo: null, slipDate: null, litre: _litre, rate: null
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    getFuelDataFromGrid() {
        let rowData = [];
        this.goFuel.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#endregion
    //#region local functions
    //validateGridStatus() {
    //  var rd = this.isReadOnly();
    //  //agFormHelper.setGridStatus(!rd);
    //  agFormHelper.setGridToolbar(!rd);
    //}
    allowDetailEdit(params) {
        return !params.node.isRowPinned() && !params.node.data.locked;
    }
    get(rwbNo) {
        rwbNo = agFormHelper_1.agFormHelper.padL(rwbNo);
        this.svcWaitDlg.open({});
        try {
            this.svcRWBExpense.get(rwbNo).subscribe(rwbexpense => {
                if (rwbexpense) {
                    this.frmRWBExpense.controls['rwbId'].setValue(rwbexpense.rwbId);
                    this.frmRWBExpense.controls['rwbNo'].setValue(rwbexpense.rwbNo);
                    this.frmRWBExpense.controls['rwbDate'].setValue(rwbexpense.rwbDate);
                    this.frmRWBExpense.controls['jobNo'].setValue(rwbexpense.jobNo);
                    this.frmRWBExpense.controls['jobId'].setValue(rwbexpense.jobId);
                    this.frmRWBExpense.controls['jobStartDate'].setValue(rwbexpense.jobStartDate);
                    this.frmRWBExpense.controls['jobDate'].setValue(rwbexpense.jobDate);
                    this.frmRWBExpense.controls['jobStateName'].setValue(rwbexpense.jobStateName);
                    this.frmRWBExpense.controls['rwbStateName'].setValue(rwbexpense.rwbStateName);
                    this.frmRWBExpense.controls['comments'].setValue(rwbexpense.comments);
                    this.frmRWBExpense.controls['branchId'].setValue(rwbexpense.branchId);
                    this.frmRWBExpense.controls['fuelAvg'].setValue(rwbexpense.fuelAvg);
                    this.frmRWBExpense.controls['transitTime'].setValue(rwbexpense.transitTime);
                    this.expenseData = rwbexpense.expenses;
                    this.chargesData = rwbexpense.charges;
                    if (agFormHelper_1.agFormHelper.enableGL()) {
                        this.fuelData = rwbexpense.cashFuels;
                        this.setFuelFooter();
                    }
                    this.footer = rwbexpense.footer;
                    this.setExpenseFooter();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
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
            this.svcRWBExpense.getLookup().subscribe(data => {
                this.lstBranch = data.lstBranch;
                sessionStorage.setItem("lstExpense", JSON.stringify(data.lstExpense));
                sessionStorage.setItem("lstSupplier", JSON.stringify(data.lstSupplier));
                sessionStorage.setItem("lstAccCharge", JSON.stringify(data.lstCharge));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //setGridToolbar(enable: boolean) {
    //  this.isDisabled = !enable;
    //}
    validate(re) {
        this.errors = [];
        if (re.jobStateName == "Closed") {
            this.errors.push('No changes can be made to RWB expense entry once Job is closed');
        }
        else {
            if (Object.keys(re.expenses).length == 0) {
                this.errors.push('Atleast one entry must exist in Rwb Expense to perform save operation');
            }
            if (re.expenses.some(x => !x.expenseId)) {
                this.errors.push('Please Select valid value for Expense in each row of RWB Expense Grid');
            }
            if (re.expenses.some(x => !x.locked && x.amount == 0)) {
                this.errors.push('No row in Expense Transaction can contain zero amount');
            }
            if (agFormHelper_1.agFormHelper.enableGL()) {
                if (re.cashFuels.some(x => !x.delete && !x.supplierId)) {
                    this.errors.push('Please Select valid value for supplier in each row of Cash Fuel Grid');
                }
                if (Object.keys(re.cashFuels.filter(x => !x.delete)).length > 0) {
                    if (re.cashFuels.some(x => !x.delete && !x.supplierId || x.slipNo == null || x.slipDate == null)) {
                        this.errors.push('No row in  Cash Fuel Supplier can be  without Supplier, Slip # or Date');
                    }
                    if (re.cashFuels.some(x => !x.delete && x.litre <= 0 || x.rate <= 0)) {
                        this.errors.push('No row in  Cash Fuel can contain zero Litre or Rate');
                    }
                    if (re.cashFuels.some(x => !x.delete && x.slipDate == null)) {
                        this.errors.push('No row in  Cash Fuel  with null slip date');
                    }
                    var valueArr = re.cashFuels.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, slipNo: item.slipNo })).slice().sort();
                    var duplicates = [];
                    for (var i = 0; i < valueArr.length - 1; i++) {
                        if (valueArr[i + 1]['supplierId'] === valueArr[i]['supplierId']) {
                            if (valueArr[i + 1]['slipNo'] === valueArr[i]['slipNo'])
                                duplicates.push(valueArr[i]);
                        }
                    }
                    if (duplicates.length > 0) {
                        this.errors.push('Fuel entries must be unique! Same Supplier and SlipNo can`t be availed twice!');
                    }
                }
            }
            if (re.charges.some(x => !x.delete && !x.locked && !x.chargeId)) {
                this.errors.push('Please Select valid value for Charge in each row of RWB Charge Grid');
            }
            if (re.charges.some(x => !x.delete && !x.locked && x.amount <= 0)) {
                this.errors.push('No row in Charges can contain zero or -ve quantity');
            }
            if (Object.keys(re.charges.filter(x => !x.delete)).length > 0) {
                var valueChargesArr = re.charges.filter(x => !x.delete).map(function (item) { return item.chargeId; }).slice().sort();
                for (var i = 0; i < valueChargesArr.length - 1; i++) {
                    if (valueChargesArr[i + 1] === valueChargesArr[i]) {
                        this.errors.push('ChargeId  must be unique!');
                        i = valueChargesArr.length;
                    }
                }
            }
        }
    }
    onExpenseCellValueChanged(params) {
        if (params.column.getId() === "amount") {
            this.setExpenseFooter();
        }
    }
    onChargeCellValueChanged(params) {
        if (params.column.getId() === "amount") {
            this.setChargeFooter();
        }
    }
    onFuelCellValueChanged(params) {
        if (params.column.getId() === "litre" || params.column.getId() === "rate") {
            this.setFuelFooter();
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
        this.frmRWBExpense.reset();
        this.frmRWBExpense.disable();
        this.errors = [];
        this.expenseData = [];
        this.chargesData = [];
        this.fuelData = [];
        //this.frmRWBExpense.patchValue({ enableGLEntries: this.enableGLEntries });
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('rwbno', { static: true })
], RWBExpenseComponent.prototype, "rwbno", void 0);
__decorate([
    core_1.ViewChild('branch', { static: true })
], RWBExpenseComponent.prototype, "branch", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], RWBExpenseComponent.prototype, "btnEdit", void 0);
RWBExpenseComponent = __decorate([
    core_1.Component({
        selector: 'app-rwbexpense',
        templateUrl: './rwbexpense.component.html',
        styleUrls: ['./rwbexpense.component.css']
    })
], RWBExpenseComponent);
exports.RWBExpenseComponent = RWBExpenseComponent;
//# sourceMappingURL=rwbexpense.component.js.map