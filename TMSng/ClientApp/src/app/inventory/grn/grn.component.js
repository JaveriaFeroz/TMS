"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRNComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let GRNComponent = class GRNComponent {
    //#endregion
    constructor(router, formbulider, svcSearchDlg, svcGRN, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcSearchDlg = svcSearchDlg;
        this.svcGRN = svcGRN;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Goods Receipt note';
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        this.colGRN = [
            {
                headerName: 'GRN Detail',
                children: [
                    {
                        headerName: "Product", field: "productName", width: 230, editable: false, pinned: 'left', lockPinned: true
                    },
                    {
                        headerName: "UoM", field: "uoMName", width: 70, editable: false, pinned: 'left', lockPinned: true
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 70,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter', valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    {
                        headerName: "Price", field: "price", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80, editable: false
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
                        valueGetter: function aPlusBValueGetter(params) {
                            if (params.node.rowPinned)
                                return params.data.amount;
                            else
                                return params.data.quantity * params.data.price;
                        }
                    },
                    {
                        headerName: "GST%", field: "gstRate", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80, editable: false
                    },
                    {
                        headerName: "Disc%", field: "discRate", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80, editable: false
                    },
                    {
                        headerName: "GST Amt", field: "gstAmount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
                        valueGetter: function aPlusBValueGetter(params) {
                            if (params.node.rowPinned)
                                return params.data.gstAmount;
                            else
                                return +((params.data.quantity * params.data.price) * (params.data.gstRate / 100)).toFixed(2);
                        }
                    },
                    {
                        headerName: "Disc Amt", field: "discAmount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
                        valueGetter: function aPlusBValueGetter(params) {
                            if (params.node.rowPinned)
                                return params.data.discAmount;
                            else
                                return (params.data.quantity * params.data.price) * (params.data.discRate / 100);
                        }
                    },
                    {
                        headerName: "Narration", field: "narration", width: 100, cellEditor: "agLargeTextCellEditor"
                    },
                    {
                        headerName: "Net Amount", field: "netAmount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 120, editable: false, lockPinned: true, pinned: 'right',
                        cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
                        valueGetter: function aPlusBValueGetter(params) {
                            if (params.node.rowPinned)
                                return params.data.netAmount;
                            else
                                return (params.data.quantity * params.data.price) + (params.data.quantity * params.data.price) * (params.data.gstRate / 100) - (params.data.quantity * params.data.price) * (params.data.discRate / 100);
                        }
                    },
                    { headerName: "ProductId", field: "productId", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "UomId", field: "uomId", hide: true, suppressColumnsToolPanel: true },
                ]
            }
        ];
        this.initGrid();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmGRN = this.formbulider.group({
            grnNo: [null, [forms_1.Validators.required]],
            grnId: [null],
            grnDate: [null, [forms_1.Validators.required]],
            grnTypeId: [null, [forms_1.Validators.required]],
            supplierId: [null, [forms_1.Validators.required]],
            branchId: [null, [forms_1.Validators.required]],
            moPId: [null, [forms_1.Validators.required]],
            refNo: [null],
            refDate: [null],
            poNo: [null, [forms_1.Validators.required]],
        });
        this.frmGRN.disable();
        this.frmGRN.controls.poNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        agFormHelper_1.agFormHelper.setFormSearch(true);
        document.getElementById("tbPOSearch").disabled = true;
    }
    //ngAfterViewInit() {
    //  //it is necessary to disable save button as due to ngIf it remains active otherwise
    //  (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    //}
    //#region toolbar functions
    tbAdd() {
        this.frmGRN.reset();
        this.frmGRN.enable();
        this.frmGRN.controls.grnNo.disable();
        this.frmGRN.controls.poNo.disable();
        this.frmGRN.patchValue({ grnDate: new Date() });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        document.getElementById("tbPOSearch").disabled = false;
        this.branchId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmGRN.controls.grnNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.grnNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            var searchCols = [
                { headerName: 'GRN #', field: 'grnNo', width: 100 },
                { headerName: 'Date', field: 'grnDate', width: 70 },
                { headerName: 'PO #', field: 'poNo', width: 70 },
                { headerName: 'Branch', field: 'branchName' },
                { headerName: 'Supplier', field: 'supplierName' }
            ];
            this.svcGRN.getGRNs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select GRN", searchCols, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.grnNo);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbPOSearch() {
        try {
            var poSearchCols = [
                { headerName: 'PO #', field: 'poNo', width: 70 },
                { headerName: 'PODate', field: 'poDate', width: 90 },
                { headerName: 'PRNo', field: 'prNo', width: 90 },
                { headerName: 'Branch', field: 'branchName' },
                { headerName: 'Supplier', field: 'supplierName' }
            ];
            this.svcWaitDlg.open({});
            this.svcGRN.getPOs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select PO for GRN", poSearchCols, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.getPODetails(r.poNo);
                        if (this.grnData.length != 0) {
                            this.frmGRN.controls.poNo.disable();
                            agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                            agFormHelper_1.agFormHelper.setFormSearch(false);
                        }
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
        this.frmGRN.enable();
        this.frmGRN.controls.grnId.disable();
        this.frmGRN.controls.poNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        document.getElementById("tbPOSearch").disabled = true;
        document.getElementById("btnSave").disabled = true;
        this.branchId.focus();
    }
    tbSave() {
        try {
            this.frmGRN.markAllAsTouched();
            if (!this.frmGRN.invalid) {
                var formData = this.frmGRN.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcGRN.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstProduct");
        sessionStorage.removeItem("lstUOM");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goGRN = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'blue', 'background-color': 'lightgray' };
                }
            },
            onRowDataChanged: () => { this.setGRNFooter(); }
        };
    }
    onDeleteLine() {
        try {
            if (confirm("Are you sure you want to Delete selected row?")) {
                const selectedRow = this.goGRN.api.getFocusedCell();
                if (selectedRow) {
                    var rowNode = this.goGRN.api.getRowNode(selectedRow.rowIndex.toString());
                    this.goGRN.api.selectNode(rowNode);
                    this.goGRN.api.applyTransaction({ remove: this.goGRN.api.getSelectedRows() });
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
        this.goGRN.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcGRN.get(Id).subscribe(grn => {
                if (grn) {
                    this.frmGRN.disable();
                    this.frmGRN.controls['grnNo'].setValue(grn.grnNo);
                    this.frmGRN.controls['grnId'].setValue(grn.grnId);
                    this.frmGRN.controls['grnDate'].setValue(grn.grnDate);
                    this.frmGRN.controls['grnTypeId'].setValue(grn.grnTypeId);
                    this.frmGRN.controls['branchId'].setValue(grn.branchId);
                    this.frmGRN.controls['supplierId'].setValue(grn.supplierId);
                    this.frmGRN.controls['refNo'].setValue(grn.refNo);
                    this.frmGRN.controls['refDate'].setValue(grn.refDate);
                    this.frmGRN.controls['moPId'].setValue(grn.moPId);
                    this.frmGRN.controls['poNo'].setValue(grn.poNo);
                    this.grnData = grn.details;
                    this.footer = grn.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                    this.setGRNFooter();
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
    onGRNCellValueChanged(params) {
        if (params.column.getId() === "quantity") {
            this.setGRNFooter();
        }
    }
    getPODetails(poId) {
        this.svcWaitDlg.open({});
        try {
            this.svcGRN.getPODetails(poId).subscribe(grn => {
                if (grn) {
                    this.frmGRN.controls['poNo'].setValue(poId);
                    this.frmGRN.controls['branchId'].setValue(grn.branchId);
                    this.frmGRN.controls['supplierId'].setValue(grn.supplierId);
                    this.frmGRN.controls['grnTypeId'].setValue(grn.grnTypeId);
                    this.frmGRN.controls['moPId'].setValue(grn.moPId);
                    this.grnData = grn.details;
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
            this.svcGRN.getLookup().subscribe(data => {
                this.lstBranch = data.lstBranch;
                this.lstSupplier = data.lstSupplier;
                this.lstMoP = data.lstMoP;
                this.lstGRNType = data.lstGRNType;
                sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
                sessionStorage.setItem("lstUOM", JSON.stringify(data.lstUom));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    setGRNFooter() {
        try {
            let _amount = 0, _discamount = 0, _gstamount = 0, _netamount = 0;
            this.goGRN.api.forEachNode(function (rowNode, index) {
                if (!rowNode.data.delete) {
                    _amount += rowNode.data.quantity * rowNode.data.price;
                    _discamount += _amount * (rowNode.data.discRate / 100);
                    _gstamount += +(_amount * (rowNode.data.gstRate / 100)).toFixed(2);
                    _netamount += _amount + _gstamount - _discamount;
                }
            });
            this.goGRN.api.setPinnedBottomRowData([{ amount: _amount, discAmount: _discamount, gstAmount: _gstamount, netAmount: _netamount }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    validate(grn) {
        this.errors = [];
        if (Object.keys(grn.details).length == 0) {
            this.errors.push('At least one product must exist in GRN to perform save operation');
        }
        else if (grn.details.some(x => x.quantity <= 0)) {
            this.errors.push('No row in GRN can contain zero or -ve quantity');
        }
    }
    initForm() {
        this.frmGRN.reset();
        this.frmGRN.disable();
        this.errors = [];
        this.grnData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        document.getElementById("tbPOSearch").disabled = true;
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('grnNo', { static: true })
], GRNComponent.prototype, "grnNo", void 0);
__decorate([
    core_1.ViewChild('branchId', { static: true })
], GRNComponent.prototype, "branchId", void 0);
GRNComponent = __decorate([
    core_1.Component({
        selector: 'app-grn',
        templateUrl: './grn.component.html',
        styleUrls: ['./grn.component.css']
    })
], GRNComponent);
exports.GRNComponent = GRNComponent;
//# sourceMappingURL=grn.component.js.map