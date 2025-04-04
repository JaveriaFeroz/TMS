"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWBUpdateComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let RWBUpdateComponent = class RWBUpdateComponent {
    //#endregion
    constructor(router, formbulider, svcRWBUpdate, svcToaster, svcWaitDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRWBUpdate = svcRWBUpdate;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.Enum = Enum;
        this.optionName = 'Trip Update';
        //VehicleCapacity: any;
        //isDisabled = true;
        this.enablePartialDelivery = false;
        this.errors = [];
        this.footer = new footer_1.agFooter();
        //#endregion toolbar functions
        //#region grid setup
        //#region SKU Grid Definition & functions
        this.colSKU = [
            {
                headerName: 'SKUs in the Load',
                children: [
                    {
                        headerName: "SKU", field: "skuId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'SKU', class: "300" },
                        valueFormatter: agGridHelper_1.agGridHelper.getSKUName, width: 300
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        //#endregion
        //#region consignee Grid Definition & functions
        this.colConsignee = [
            {
                headerName: 'Drop Points (Consignees)',
                children: [
                    {
                        headerName: "Consignee", field: "consigneeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Consignee', class: "250" },
                        valueFormatter: agGridHelper_1.agGridHelper.getConsigneeName, width: 250
                    },
                    {
                        headerName: "SKU", field: "skuId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'SKU', class: "150" }, valueFormatter: agGridHelper_1.agGridHelper.getSKUName, width: 150
                    },
                    {
                        headerName: "Qty", field: "qty", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
        this.enablePartialDelivery = agFormHelper_1.agFormHelper.enablePartialDelivery(); //data.enablePartialDelivery;
    }
    ngOnInit() {
        this.frmRwbUpdate = this.formbulider.group({
            rwbId: [null],
            shipperId: [null],
            rwbNo: [null, [forms_1.Validators.required]],
            customerOrderNo: [null],
            gatePassNo: [null],
            categoryId: [null],
            consigneeId: [null],
            weight_Carried: [null],
            weight_Delivered: [null],
            categoryMandatory: [null],
            productMandatory: [null],
            enablePartialDelivery: [null],
            vehicleCapacity: [null],
            multiDrop: [null],
        });
        this.frmRwbUpdate.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.frmRwbUpdate.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmRwbUpdate.controls.rwbNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.rwbno.nativeElement.focus();
    }
    tbEdit() {
        this.frmRwbUpdate.enable();
        this.frmRwbUpdate.controls.rwbNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.customerOrderNo.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmRwbUpdate.markAllAsTouched();
            if (!this.frmRwbUpdate.invalid) {
                var formData = this.frmRwbUpdate.getRawValue();
                if (!this.enablePartialDelivery) {
                    formData.skUs = this.getSKUDataFromGrid();
                }
                else {
                    formData.consignees = this.getConsigneeDataFromGrid();
                }
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcRWBUpdate.update(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstConsignee");
        sessionStorage.removeItem("lstSKU");
        this.router.navigate(['/MainForm']);
    }
    onAddSKULine() {
        try {
            var res = this.goSKU.api.applyTransaction({
                add: [{ skuId: null, add: true, edit: false, delete: false }]
            });
            this.goSKU.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "skuId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteSKULine() {
        try {
            if (this.goSKU.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goSKU.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goSKU.api);
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
    getSKUDataFromGrid() {
        let rowData = [];
        this.goSKU.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddConsigneeLine() {
        try {
            var res = this.goConsignee.api.applyTransaction({
                add: [{ consigneeId: null, skuId: null, qty: 0, add: true, edit: false, delete: false }]
            });
            this.goConsignee.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "consigneeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteConsigneeLine() {
        try {
            if (this.goConsignee.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goConsignee.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goConsignee.api);
                    this.setConsigneeFooter();
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
    getConsigneeDataFromGrid() {
        let rowData = [];
        this.goConsignee.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    setConsigneeFooter() {
        try {
            let _qty = 0;
            this.goConsignee.api.forEachNode(function (rowNode, index) {
                if (!rowNode.data.delete) {
                    _qty += rowNode.data.qty;
                }
            });
            this.goConsignee.api.setPinnedBottomRowData([{ consigneeId: null, skuId: null, qty: _qty }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'SetConsigneeFooter:');
        }
    }
    ;
    //#endregion 
    initGrid() {
        this.goSKU = {
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
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "skuId") {
                    if (params.data.skuId) {
                        params.node.setDataValue("skuId", parseInt(params.data.skuId));
                    }
                    else {
                        params.node.setDataValue("skuId", null);
                    }
                }
            }
        };
        this.goConsignee = {
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
                    return { 'font-weight': 'bold', 'color': 'blue', 'background-color': 'lightgray' };
                }
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "skuId") {
                    if (params.data.skuId) {
                        params.node.setDataValue("skuId", parseInt(params.data.skuId));
                    }
                    else {
                        params.node.setDataValue("skuId", null);
                    }
                }
                if (params.colDef.field == "consigneeId") {
                    if (params.data.consigneeId) {
                        params.node.setDataValue("consigneeId", parseInt(params.data.consigneeId));
                    }
                    else {
                        params.node.setDataValue("consigneeId", null);
                    }
                }
            },
            onRowDataChanged: () => { this.setConsigneeFooter(); }
        };
    }
    //#endregion
    //#region local functions
    get(rwbNo) {
        rwbNo = agFormHelper_1.agFormHelper.padL(rwbNo);
        this.svcWaitDlg.open({});
        try {
            this.svcRWBUpdate.get(rwbNo).subscribe(rwbupdate => {
                if (rwbupdate) {
                    this.frmRwbUpdate.disable();
                    this.filterByClient(rwbupdate.clientId);
                    this.frmRwbUpdate.controls['rwbNo'].setValue(rwbupdate.rwbNo);
                    this.frmRwbUpdate.controls['rwbId'].setValue(rwbupdate.rwbId);
                    this.frmRwbUpdate.controls['categoryId'].setValue(rwbupdate.categoryId);
                    this.frmRwbUpdate.controls['consigneeId'].setValue(rwbupdate.consigneeId);
                    this.frmRwbUpdate.controls['gatePassNo'].setValue(rwbupdate.gatePassNo);
                    this.frmRwbUpdate.controls['customerOrderNo'].setValue(rwbupdate.customerOrderNo);
                    this.frmRwbUpdate.controls['weight_Carried'].setValue(rwbupdate.weight_Carried);
                    this.frmRwbUpdate.controls['weight_Delivered'].setValue(rwbupdate.weight_Delivered);
                    this.frmRwbUpdate.controls['categoryMandatory'].setValue(rwbupdate.categoryMandatory);
                    this.frmRwbUpdate.controls['productMandatory'].setValue(rwbupdate.productMandatory);
                    this.frmRwbUpdate.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
                    this.frmRwbUpdate.controls['vehicleCapacity'].setValue(rwbupdate.vehicleCapacity);
                    this.frmRwbUpdate.controls['multiDrop'].setValue(rwbupdate.multiDrop);
                    if (!this.enablePartialDelivery) {
                        this.skuData = rwbupdate.skUs;
                    }
                    else {
                        this.consigneeData = rwbupdate.consignees;
                        this.setConsigneeFooter();
                    }
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
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcWaitDlg.open({});
            this.svcRWBUpdate.getLookup().subscribe(data => {
                this.lstConsigneeAll = data.lstConsignee;
                this.lstCategoryAll = data.lstCategory;
                this.lstSKUAll = data.lstSKU;
                //sessionStorage.setItem("lstSKU", JSON.stringify(data.lstSKU));
            }, error => {
                this.svcToaster.showFailure(error);
            }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    filterByClient(clientId) {
        this.lstConsignee = this.lstConsigneeAll.filter(x => x.clientId === clientId);
        sessionStorage.setItem("lstConsignee", JSON.stringify(this.lstConsignee));
        this.lstCategory = this.lstCategoryAll.filter(x => x.clientId === clientId);
        sessionStorage.setItem("lstSKU", JSON.stringify(this.lstSKUAll.filter(x => x.clientId === clientId)));
    }
    onConsigneeCellValueChanged(params) {
        if (params.column.getId() === "qty") {
            this.setConsigneeFooter();
        }
    }
    validate(r) {
        this.errors = [];
        if (!this.enablePartialDelivery) {
            if (r.consigneeId == null) {
                this.errors.push('Please select valid Conisgnee');
            }
            if (r.categoryMandatory && !r.categoryId) {
                this.errors.push('Please select valid Category as it is marked as mandatory for current shipper');
            }
            if (r.productMandatory && Object.keys(r.skUs.filter(x => !x.delete)).length == 0) {
                this.errors.push('Atleast one SKU must be selected as SKU is marked as mandatory for current Shipper');
            }
            if (r.skUs.some(x => !x.delete && !x.skuId)) {
                this.errors.push('Please Select valid value for SKU in each row of SKU Grid');
            }
            else if (Object.keys(r.skUs.filter(x => !x.delete)).length != 0) {
                var valueArr = r.skUs.filter(x => !x.delete).map(function (item) { return item.skuId; });
                if (valueArr.some(function (item, idx) { return valueArr.indexOf(item) != idx; })) {
                    this.errors.push('SKU must be unique');
                }
            }
        }
        else {
            if (Object.keys(r.consignees.filter(x => !x.delete)).length > 0) {
                let _cQty = 0;
                this.goConsignee.api.forEachNode(function (rowNode, index) {
                    if (!rowNode.data.delete) {
                        _cQty += rowNode.data.qty;
                    }
                });
                if (_cQty != r.vehicleCapacity) {
                    this.errors.push('The Consignee wise break up of Qty must match Vehicle Capacity');
                }
                if (r.consignees.some(x => !x.delete && !x.skuId && !x.consigneeId)) {
                    this.errors.push('Please Select valid value for SKU and Consignee in each row of Drop Consignee Grid');
                }
                if (r.consignees.some(x => !x.delete && x.qty <= 0)) {
                    this.errors.push('Quantity must be greater than Zero for each row of Consignee Grid');
                }
                if (!r.multiDrop) {
                    var consigneeArr = r.consignees.filter(x => !x.delete).map(function (item) { return item.consigneeId; }).slice().sort();
                    for (var i = 0; i < consigneeArr.length - 1; i++) {
                        if (consigneeArr[i + 1] != consigneeArr[i]) {
                            this.errors.push('Consignee must be same as Trip consignee as this Road bill is not marked as Multi Drop!');
                        }
                    }
                }
            }
        }
    }
    initForm() {
        this.frmRwbUpdate.reset();
        this.frmRwbUpdate.disable();
        this.errors = [];
        this.skuData = [];
        this.consigneeData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        if (this.enablePartialDelivery) {
            this.setConsigneeFooter();
        }
        this.frmRwbUpdate.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('rwbno', { static: true })
], RWBUpdateComponent.prototype, "rwbno", void 0);
__decorate([
    core_1.ViewChild('customerOrderNo', { static: true })
], RWBUpdateComponent.prototype, "customerOrderNo", void 0);
RWBUpdateComponent = __decorate([
    core_1.Component({
        selector: 'app-rwbupdate',
        templateUrl: './rwbupdate.component.html',
        styleUrls: ['./rwbupdate.component.css']
    })
], RWBUpdateComponent);
exports.RWBUpdateComponent = RWBUpdateComponent;
//# sourceMappingURL=rwbupdate.component.js.map