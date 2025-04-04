"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierRateComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let SupplierRateComponent = class SupplierRateComponent {
    constructor(router, formbulider, svcSupplierRate, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcSupplierRate = svcSupplierRate;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Supplier Rate';
        this.colSearch = [
            { headerName: 'SupplierId', field: 'supplierId', width: 70 },
            { headerName: 'SupplierName', field: 'supplierName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.frameworkComponents = {
            agDateEditor: agGrid_date_component_1.agGridDateEditor,
        };
        this.colSupplierRate = [
            {
                headerName: 'Supplier Fuel Rate',
                children: [
                    {
                        headerName: "From Date", field: "fromDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true,
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "To Date", field: "toDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true,
                        valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Fuel Rate", field: "fuelRate", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 110
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
        this.frmSupplierRate = this.formbulider.group({
            supplierId: [null, [forms_1.Validators.required]],
        });
        this.frmSupplierRate.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    //tbAdd() {
    //  this.frmSupplierRate.reset();
    //  this.frmSupplierRate.enable();
    //  this.frmSupplierRate.controls.SupplierRateNo.disable();
    //  this.frmSupplierRate.patchValue({ AdjustmentDate: new Date() });
    //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    //  (<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = false;
    //  (<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = false;
    //  this.productName.focus();
    //}
    tbRecall() {
        this.initForm();
        this.frmSupplierRate.controls.supplierId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.supplierId.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcSupplierRate.getRates().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Supplier", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.supplierId);
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
        this.frmSupplierRate.enable();
        this.frmSupplierRate.controls.supplierId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmSupplierRate.markAllAsTouched();
            if (!this.frmSupplierRate.invalid) {
                var formData = this.frmSupplierRate.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcSupplierRate.save(formData).subscribe(() => {
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
    //#endregion toolbar functions
    //#region grid setup
    //#region Supplier Rare Grid Definition & functions
    initGrid() {
        this.goSupplierRate = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            //columnDefs: this.colSupplierRate,
            //rowData: [],
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
            }
        };
    }
    onAddLine() {
        try {
            var res = this.goSupplierRate.api.applyTransaction({
                add: [{
                        fromDate: null, toDate: null, fuelRate: 0, add: true, edit: false, delete: false
                    }]
            });
            this.goSupplierRate.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goSupplierRate.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goSupplierRate.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goSupplierRate.api);
                    //this.goSupplierRate.api.getFilterInstance('delete').onFilterChanged();
                }
                //agGridHelper.setGridDeleteFilter(this.goSupplierRate.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getDetailFromGrid() {
        let rowData = [];
        this.goSupplierRate.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcSupplierRate.get(Id).subscribe(supplierrate => {
                if (supplierrate) {
                    this.frmSupplierRate.disable();
                    this.frmSupplierRate.controls['supplierId'].setValue(supplierrate.supplierId);
                    this.supplierRateData = supplierrate.details;
                    this.footer = supplierrate.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
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
            this.svcSupplierRate.getLookup().subscribe(data => {
                this.lstSupplier = data.lstSupplier;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(sr) {
        this.errors = [];
        if (Object.keys(sr.details).length == 0) {
            this.errors.push('Atleast one entry must exist in Supplier Transaction to perform save operation');
        }
        else if (sr.details.some(x => !x.delete && x.fromDate > x.toDate)) {
            this.errors.push('Effective Date cannot be greater thne Expiry Date');
        }
    }
    onChange(event) {
        this.get(event);
    }
    initForm() {
        this.frmSupplierRate.reset();
        this.frmSupplierRate.disable();
        this.errors = [];
        this.supplierRateData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
        //this.goSupplierRate.api.setRowData([]);
        //this.SupplierRates = null;    
    }
};
__decorate([
    core_1.ViewChild('supplierId', { static: true })
], SupplierRateComponent.prototype, "supplierId", void 0);
SupplierRateComponent = __decorate([
    core_1.Component({
        selector: 'app-supplierrate',
        templateUrl: './supplierrate.component.html',
        styleUrls: ['./supplierrate.component.css']
    })
], SupplierRateComponent);
exports.SupplierRateComponent = SupplierRateComponent;
//# sourceMappingURL=supplierrate.component.js.map