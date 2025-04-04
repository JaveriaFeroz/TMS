"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RWBComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let RWBComponent = class RWBComponent {
    constructor(router, formbulider, svcRWB, svcToaster, svcWaitDlg, svcSearchDlg, Enum) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcRWB = svcRWB;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.Enum = Enum;
        //#region constant variables
        this.optionName = 'Road Waybill';
        this.colSearch = [
            { headerName: 'RWB #', field: 'rwbNo' },
            { headerName: 'Job #', field: 'jobNo' },
            { headerName: 'RWB Date', field: 'rwbDate' },
            { headerName: 'Client Name', field: 'clientName' },
            { headerName: 'Status', field: 'stateName' },
            { headerName: 'Created By', field: 'createdBy' },
            { headerName: 'Created On', field: 'createdOn' },
        ];
        this.errors = [];
        this.MinDate = new Date().getDate() - 180;
        this.MaxDate = new Date();
        this.isDisabled = true;
        this.Outsource = false;
        this.enablePartialDelivery = false;
        this.footer = new footer_1.agFooter();
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnEdit').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        //#region Rwb SKU Grid Definition & functions
        this.colSKU = [
            {
                headerName: 'Rwb SKUs',
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
        //#region Rwb Other Grid Definition & functions
        this.colCharges = [
            {
                headerName: 'Rwb Charges',
                children: [
                    {
                        headerName: "Charge", field: "chargeId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'AccCharge', class: "220" },
                        valueFormatter: agGridHelper_1.agGridHelper.getAccChargeName, width: 220, lockPinned: true
                    },
                    {
                        headerName: "Description", field: "description", width: 250, cellEditor: "agLargeTextCellEditor"
                    },
                    {
                        headerName: "Amount", field: "amount", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100,
                        lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        //#endregion
        //#region Consignee Grid Definition & functions
        this.colConsignee = [
            {
                headerName: 'Rwb Consignees',
                children: [
                    {
                        headerName: "Consignee", field: "consigneeId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Consignee', class: "250" },
                        valueFormatter: agGridHelper_1.agGridHelper.getConsigneeName, width: 250, lockPinned: true
                    },
                    {
                        headerName: "SKU", field: "skuId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'SKU', class: "170" },
                        valueFormatter: agGridHelper_1.agGridHelper.getSKUName, width: 170, lockPinned: true
                    },
                    {
                        headerName: "Load", field: "qty", type: "numericColumn", width: 70,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.enablePartialDelivery = agFormHelper_1.agFormHelper.enablePartialDelivery(); //data.enablePartialDelivery;
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmRWB = this.formbulider.group({
            rwbId: [null],
            rwbNo: [null, [forms_1.Validators.required]],
            jobNo: [null, [forms_1.Validators.required]],
            rwbDate: [null, [forms_1.Validators.required]],
            clientId: [null, [forms_1.Validators.required]],
            shipperId: [null],
            routeId: [null],
            hdnCapacityId: [null],
            capacityId: [null, [forms_1.Validators.required]],
            capacityName: [null],
            emptyTrip: [false],
            startKms: [0],
            endKms: [0],
            pkgs: [0],
            weight: [0],
            weight_Excess: [0],
            rateTypeId: [null],
            chargeTypeId: [0],
            //Rate: [0, null],
            //RatePerKm: [0, null],
            //LoadingCharges: [0],
            //OffLoadingCharges: [0],
            //Rateweight_ExcessPerKg: [0],
            //DetentionCharges: [0],
            detHRs: [0],
            detGraceHRs: [0],
            wayTypeId: [null],
            tdrNo: [null],
            linkedRWBNo: [null],
            stateId: [null],
            stateName: [null],
            gatePassNo: [null],
            customerOrderNo: [null],
            comments: [null],
            categoryId: [null],
            consigneeId: [null],
            categoryMandatory: [false],
            productMandatory: [false],
            paymentModeId: [null],
            assetId: [null],
            vehicleCapacity: [null],
            enablePartialDelivery: [null],
            multiDrop: [false],
            outSourced: [false],
            rentedAssetId: [false]
        });
        this.frmRWB.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        //this.setGridToolBar(false);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.frmRWB.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divHToolbar'); //document.body;//document.getElementById('btnSave') as Node;
        this.observer.observe(this.targetNode, this.config);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmRWB.reset();
        this.frmRWB.enable();
        this.frmRWB.controls.rwbNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmRWB.patchValue({
            rwbDate: new Date(), stateId: 1, stateName: "New", emptyTrip: false, multiDrop: false, outSourced: false,
            weight: 0, weight_Excess: 0, pkgs: 0, enablePartialDelivery: this.enablePartialDelivery
        });
        //this.frmRWB.controls.StateName.disable();
        this.jobNo.nativeElement.focus();
        //if (this.enablePartialDelivery) {
        //  this.frmRWB.controls.CapacityId.disable();
        //}
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmRWB.controls.rwbNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.rwbNo.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcRWB.getRWBs().subscribe(r => {
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
        this.frmRWB.enable();
        this.frmRWB.controls.rwbNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.frmRWB.controls.stateName.disable();
        var formData = this.frmRWB.getRawValue();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        if (this.enablePartialDelivery && formData.outSourced) {
            this.frmRWB.controls.capacityId.disable();
        }
        if (formData.emptyTrip) {
            this.frmRWB.controls.clientId.disable();
            this.frmRWB.controls.pkgs.disable();
            this.frmRWB.controls.weight.disable();
            this.frmRWB.controls.weight_Excess.disable();
            this.frmRWB.controls.wayTypeId.disable();
            this.frmRWB.controls.tdrNo.disable();
            this.frmRWB.controls.linkedRWBNo.disable();
            this.frmRWB.controls.gatePassNo.disable();
            this.frmRWB.controls.customerOrderNo.disable();
            this.frmRWB.controls.shipperId.disable();
            this.frmRWB.controls.consigneeId.disable();
            this.frmRWB.controls.categoryId.disable();
            this.frmRWB.controls.multiDrop.disable();
            this.lstAsset = this.lstAssetAll;
            agFormHelper_1.agFormHelper.setGridToolbar(false);
            agFormHelper_1.agFormHelper.setGridStatus(false);
        }
        this.jobNo.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmRWB.markAllAsTouched();
            this.svcWaitDlg.open({});
            //this.frmRWB.markAllAsTouched();
            //if (!this.frmRWB.invalid) {
            var formData = this.frmRWB.getRawValue();
            if (!formData.emptyTrip) {
                formData.charges = this.getChargeFromGrid();
                if (!this.enablePartialDelivery) {
                    formData.skUs = this.getSKUFromGrid();
                    formData.consignees = [];
                }
                else {
                    formData.consignees = this.getConsigneeFromGrid();
                    formData.skUs = [];
                }
            }
            formData.footer = this.footer;
            this.validate(formData);
            if (this.errors.length > 0) {
                return;
            }
            else {
                this.svcRWB.save(formData).subscribe(data => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('RWB # ' + data.rwbNo + ' saved successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
        finally {
            this.svcWaitDlg.close();
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        sessionStorage.removeItem("lstSKU");
        sessionStorage.removeItem("lstAccCharge");
        sessionStorage.removeItem("lstConsignee");
        sessionStorage.removeItem("lstShipper");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid
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
            //columnDefs: this.colSKU,
            //rowData: [],
            //rowSelection: 'single',
            //suppressHorizontalScroll: false,
            //alwaysShowVerticalScroll: true,
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "skuId") {
                    if (params.data.skuId != "") {
                        params.node.setDataValue("skuId", parseInt(params.data.skuId));
                    }
                    else {
                        params.node.setDataValue("skuId", null);
                    }
                }
                //  if (params.colDef.field == "productId") {
                //    params.node.setDataValue("productId", parseInt(params.data.productId));
                //  }
            }
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
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "skuId") {
                    if (params.data.skuId != "") {
                        params.node.setDataValue("skuId", parseInt(params.data.skuId));
                    }
                    else {
                        params.node.setDataValue("skuId", null);
                    }
                }
                if (params.colDef.field == "consigneeId") {
                    if (params.data.consigneeId != "") {
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
    onAddSKULine() {
        try {
            var res = this.goSKU.api.applyTransaction({
                add: [{
                        skuId: null, add: true, edit: false, delete: false
                    }]
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
                    //this.goSKU.api.getFilterInstance('delete').onFilterChanged();
                }
                //agGridHelper.setGridDeleteFilter(this.goSKU.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getSKUFromGrid() {
        let rowData = [];
        this.goSKU.api.forEachNode(node => rowData.push(node.data));
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
    getChargeFromGrid() {
        let rowData = [];
        this.goCharges.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    onAddConsigneeLine() {
        try {
            var res = this.goConsignee.api.applyTransaction({
                add: [{
                        consigneeId: null, skuId: null, qty: null, add: true, edit: false, delete: false
                    }]
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
                    //this.goConsignee.api.getFilterInstance('delete').onFilterChanged();
                }
                //agGridHelper.setGridDeleteFilter(this.goConsignee.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getConsigneeFromGrid() {
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
            this.goConsignee.api.setPinnedBottomRowData([{
                    consigneeId: null, skuId: null, qty: _qty
                }]);
            this.ConsigneeTotal = _qty;
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    //#endregion
    //#endregion
    //#region local functions
    validateGridStatus() {
        var rd = this.isReadOnly();
        agFormHelper_1.agFormHelper.setGridStatus(!rd);
        agFormHelper_1.agFormHelper.setGridToolbar(!rd);
    }
    allowDetailEdit(params) {
        return !params.node.isRowPinned() && !params.node.data.locked;
    }
    get(rwbNo) {
        rwbNo = agFormHelper_1.agFormHelper.padL(rwbNo);
        this.svcWaitDlg.open({});
        try {
            this.svcRWB.get(rwbNo).subscribe(rwb => {
                if (rwb) {
                    this.frmRWB.controls['rwbId'].setValue(rwb.rwbId);
                    this.frmRWB.controls['rwbNo'].setValue(rwb.rwbNo);
                    this.frmRWB.controls['rwbDate'].setValue(rwb.rwbDate);
                    this.frmRWB.controls['jobNo'].setValue(rwb.jobNo);
                    this.frmRWB.controls['clientId'].setValue(rwb.clientId);
                    this.frmRWB.controls['routeId'].setValue(rwb.routeId);
                    this.frmRWB.controls['hdnCapacityId'].setValue(rwb.capacityId);
                    this.frmRWB.controls['capacityId'].setValue(rwb.capacityId);
                    this.frmRWB.controls["capacityName"].setValue(rwb.capacityName);
                    this.frmRWB.controls["vehicleCapacity"].setValue(rwb.vehicleCapacity);
                    this.frmRWB.controls['emptyTrip'].setValue(rwb.emptyTrip);
                    this.frmRWB.controls['assetId'].setValue(rwb.assetId);
                    this.frmRWB.controls['pkgs'].setValue(rwb.pkgs);
                    this.frmRWB.controls['weight'].setValue(rwb.weight);
                    this.frmRWB.controls['weight_Excess'].setValue(rwb.weight_Excess);
                    this.frmRWB.controls['rateTypeId'].setValue(rwb.rateTypeId);
                    this.frmRWB.controls['chargeTypeId'].setValue(rwb.chargeTypeId);
                    this.frmRWB.controls['detHRs'].setValue(rwb.detHRs);
                    this.frmRWB.controls['detGraceHRs'].setValue(rwb.detGraceHRs);
                    this.frmRWB.controls['wayTypeId'].setValue(rwb.wayTypeId);
                    this.frmRWB.controls['tdrNo'].setValue(rwb.tdrNo);
                    this.frmRWB.controls['linkedRWBNo'].setValue(rwb.linkedRWBNo);
                    this.frmRWB.controls['stateId'].setValue(rwb.stateId);
                    this.frmRWB.controls['stateName'].setValue(rwb.stateName);
                    this.frmRWB.controls['gatePassNo'].setValue(rwb.gatePassNo);
                    this.frmRWB.controls['customerOrderNo'].setValue(rwb.customerOrderNo);
                    this.frmRWB.controls['comments'].setValue(rwb.comments);
                    this.frmRWB.controls['categoryId'].setValue(rwb.categoryId);
                    this.frmRWB.controls['shipperId'].setValue(rwb.shipperId);
                    this.frmRWB.controls['consigneeId'].setValue(rwb.consigneeId);
                    this.frmRWB.controls['multiDrop'].setValue(rwb.multiDrop);
                    this.frmRWB.controls['outSourced'].setValue(rwb.outSourced);
                    this.frmRWB.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
                    if (!rwb.outSourced) {
                        this.frmRWB.controls['assetId'].setValue(rwb.assetId);
                        this.onAssetChanged(rwb.assetId);
                    }
                    else {
                        this.frmRWB.controls['rentedAssetId'].setValue(rwb.rentedAssetId);
                    }
                    if (!this.enablePartialDelivery && !rwb.outSourced) {
                        this.OnRouteChanged(rwb.routeId);
                    }
                    if (!this.enablePartialDelivery && !rwb.emptyTrip) {
                        this.skuData = rwb.skUs;
                    }
                    if (this.enablePartialDelivery && !rwb.emptyTrip) {
                        this.consigneeData = rwb.consignees;
                        this.setConsigneeFooter();
                    }
                    if (!rwb.emptyTrip) {
                        this.chargesData = rwb.charges;
                        this.setChargeFooter();
                        this.onClientChanged(rwb.clientId);
                    }
                    else {
                        this.frmRWB.controls['categoryMandatory'].setValue(false);
                        this.frmRWB.controls['productMandatory'].setValue(false);
                    }
                    this.footer = rwb.footer;
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
    autoFillJob(jobNo) {
        this.frmRWB.controls['jobNo'].setValue(agFormHelper_1.agFormHelper.padL(jobNo));
    }
    loadLookup() {
        //sessionStorage.removeItem("lstRoute");
        //sessionStorage.removeItem("lstProductType");
        try {
            this.svcRWB.getLookup().subscribe(data => {
                this.lstRoute = data.lstRoute;
                this.lstClient = data.lstClient;
                /* if (!this.enablePartialDelivery) {*/
                this.lstAssetAll = data.lstAsset;
                //}
                //else {
                //  this.lstAsset = data.lstAsset;
                //}
                this.lstConsigneeAll = data.lstConsignee;
                this.lstShipperAll = data.lstShipper;
                this.lstCategoryAll = data.lstCategory;
                this.lstCapacity = data.lstCapacity;
                this.lstSKUAll = data.lstSKU;
                //sessionStorage.setItem("lstSKU", JSON.stringify(data.lstSKU));
                sessionStorage.setItem("lstAccCharge", JSON.stringify(data.lstCharge));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    OnRouteChanged(id) {
        var Route = this.lstRoute.filter(x => x.routeId == id);
        if (!this.enablePartialDelivery) {
            this.lstAsset = this.lstAssetAll.filter(x => x.currentCityId === Route[0].originId);
        }
    }
    onClientChanged(ClientId) {
        try {
            //this.svcRWB.getClientLookup().subscribe(
            //data => {
            var Client = this.lstClient.filter(x => x.clientId == ClientId);
            this.frmRWB.controls['categoryMandatory'].setValue(Client[0].categoryMandatory);
            this.frmRWB.controls['productMandatory'].setValue(Client[0].productMandatory);
            this.frmRWB.controls['paymentModeId'].setValue(Client[0].paymentModeId);
            this.frmRWB.controls['rateTypeId'].setValue(Client[0].rateTypeId);
            this.frmRWB.controls['detGraceHRs'].setValue(Client[0].detGraceHRs);
            this.lstConsignee = this.lstConsigneeAll.filter(x => x.clientId === ClientId);
            sessionStorage.setItem("lstConsignee", JSON.stringify(this.lstConsignee));
            this.lstShipper = this.lstShipperAll.filter(x => x.clientId === ClientId);
            sessionStorage.setItem("lstShipper", JSON.stringify(this.lstShipper));
            this.lstCategory = this.lstCategoryAll.filter(x => x.clientId === ClientId);
            //this.lstProduct = data.lstProduct.filter(x => x.clientId == clientid); 
            //sessionStorage.setItem("lstFMProduct", JSON.stringify(this.lstProduct));
            //var lstSKU = JSON.parse(sessionStorage.getItem("lstSKU"));
            //sessionStorage.setItem("lstSKU", JSON.stringify(lstSKU.filter(x => x.clientId === ClientId)));
            var lstSKU = this.lstSKUAll.filter(x => x.clientId === ClientId);
            sessionStorage.setItem("lstSKU", JSON.stringify(lstSKU));
            if (this.enablePartialDelivery) {
                this.lstAsset = this.lstAssetAll.filter(x => x.clientId === ClientId);
            }
            this.frmRWB.controls.clientId.disable();
            /*      if (!this.enablePartialDelivery) { agFormHelper.setGridToolbar(true); }*/
        }
        //,
        //  error => {
        //  this.svcToaster.showFailure(error);
        //}
        //);
        //}
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //ShipperDropdown(consigneeId: number) {
    //  sessionStorage.removeItem("lstRoute");
    //  var data = JSON.parse(sessionStorage.getItem("lstCRoute"));
    //  sessionStorage.setItem("lstRoute", JSON.stringify(data.filter(x => x.consigneeStartPoint === consigneeId)));
    //  this.setGridToolBar(true);
    //}
    onAssetChanged(assetId) {
        var asset = this.lstAssetAll.filter(x => x.assetId === assetId);
        this.frmRWB.patchValue({ capacityId: asset[0].capacityId, capacityName: asset[0].capacityName, vehicleCapacity: asset[0].carriage });
    }
    onOutsourcedChanged(event) {
        if (event.checked) {
            this.frmRWB.controls['assetId'].setValue(null);
            this.frmRWB.controls.assetId.disable();
            this.frmRWB.controls.rentedAssetId.enable();
        }
        else {
            this.frmRWB.controls['rentedAssetId'].setValue(null);
            this.frmRWB.controls.rentedAssetId.disable();
            this.frmRWB.controls.assetId.enable();
        }
    }
    onEmptyTripChanged(event) {
        if (event.checked) {
            this.frmRWB.controls['clientId'].setValue(null);
            this.frmRWB.controls['startKms'].setValue(0);
            this.frmRWB.controls['endKms'].setValue(0);
            this.frmRWB.controls['pkgs'].setValue(0);
            this.frmRWB.controls['weight'].setValue(0);
            this.frmRWB.controls['weight_Excess'].setValue(0);
            this.frmRWB.controls['rateTypeId'].setValue(null);
            this.frmRWB.controls['chargeTypeId'].setValue(null);
            //this.frmRWB.controls['vehicleCapacity'].setValue(0);
            //this.frmRWB.controls['capacityName'].setValue(null);
            //this.frmRWB.controls['capacityId'].setValue(null);
            //this.frmRWB.controls['Rate'].setValue(0);
            //this.frmRWB.controls['RatePerKm'].setValue(0);
            //this.frmRWB.controls['LoadingCharges'].setValue(0);
            //this.frmRWB.controls['OffLoadingCharges'].setValue(0);
            //this.frmRWB.controls['Rateweight_ExcessPerKg'].setValue(0);
            //this.frmRWB.controls['DetentionCharges'].setValue(0);
            this.frmRWB.controls['detHRs'].setValue(0);
            this.frmRWB.controls['detGraceHRs'].setValue(0);
            this.frmRWB.controls['wayTypeId'].setValue(null);
            this.frmRWB.controls['tdrNo'].setValue(null);
            this.frmRWB.controls['linkedRWBNo'].setValue(null);
            this.frmRWB.controls['gatePassNo'].setValue(null);
            this.frmRWB.controls['customerOrderNo'].setValue(null);
            this.frmRWB.controls['comments'].setValue(null);
            this.frmRWB.controls['categoryId'].setValue(null);
            this.frmRWB.controls['shipperId'].setValue(null);
            this.frmRWB.controls['consigneeId'].setValue(null);
            this.frmRWB.controls['categoryMandatory'].setValue(false);
            this.frmRWB.controls['productMandatory'].setValue(false);
            this.frmRWB.controls.clientId.disable();
            this.frmRWB.controls.pkgs.disable();
            this.frmRWB.controls.weight.disable();
            this.frmRWB.controls.weight_Excess.disable();
            //this.frmRWB.controls.Rate.disable();
            //this.frmRWB.controls.RatePerKm.disable();
            //this.frmRWB.controls.LoadingCharges.disable();
            //this.frmRWB.controls.OffLoadingCharges.disable();
            //this.frmRWB.controls.Rateweight_ExcessPerKg.disable();
            //this.frmRWB.controls.DetentionCharges.disable();
            this.frmRWB.controls.wayTypeId.disable();
            this.frmRWB.controls.tdrNo.disable();
            this.frmRWB.controls.linkedRWBNo.disable();
            this.frmRWB.controls.gatePassNo.disable();
            this.frmRWB.controls.customerOrderNo.disable();
            this.frmRWB.controls.shipperId.disable();
            this.frmRWB.controls.consigneeId.disable();
            this.frmRWB.controls.categoryId.disable();
            this.frmRWB.controls.multiDrop.disable();
            this.skuData = [];
            this.consigneeData = [];
            this.chargesData = [];
            // this.goProduct.api.setRowData([]);
            //this.goCharges.api.setRowData([]);
            // this.goConsignee.api.setRowData([]);
            //this.skuData = null;
            //this.consigneeData = null;
            this.setGridToolbar(false);
            if (this.enablePartialDelivery) {
                this.lstAsset = this.lstAssetAll;
            }
        }
        else {
            this.frmRWB.controls.clientId.enable();
            this.frmRWB.controls.pkgs.enable();
            this.frmRWB.controls.weight.enable();
            this.frmRWB.controls.weight_Excess.enable();
            //this.frmRWB.controls.Rate.enable();
            //this.frmRWB.controls.RatePerKm.enable();
            //this.frmRWB.controls.LoadingCharges.enable();
            //this.frmRWB.controls.OffLoadingCharges.enable();
            //this.frmRWB.controls.Rateweight_ExcessPerKg.enable();
            //this.frmRWB.controls.DetentionCharges.enable();
            this.frmRWB.controls.wayTypeId.enable();
            this.frmRWB.controls.tdrNo.enable();
            this.frmRWB.controls.linkedRWBNo.enable();
            this.frmRWB.controls.gatePassNo.enable();
            this.frmRWB.controls.customerOrderNo.enable();
            this.frmRWB.controls.shipperId.enable();
            this.frmRWB.controls.consigneeId.enable();
            this.frmRWB.controls.categoryId.enable();
            this.frmRWB.controls.multiDrop.enable();
            this.setGridToolbar(true);
            //this.setGridToolBar(false);
        }
    }
    //private setGridToolBar(enable: boolean) {
    //  this.isDisabled = !enable
    //}
    onChargeCellValueChanged(params) {
        if (params.column.getId() === "amount") {
            this.setChargeFooter();
        }
    }
    onConsigneeCellChanged(params) {
        if (params.column.getId() === "qty") {
            this.setConsigneeFooter();
        }
    }
    validate(re) {
        this.errors = [];
        if (!this.enablePartialDelivery && re.routeId == null) {
            this.errors.push('Route is a required field');
        }
        if (!re.emptyTrip && re.consigneeId == null && !this.enablePartialDelivery) {
            this.errors.push('Consignee is a required field');
        }
        if (re.assetId == null && !re.outSourced) {
            this.errors.push('Asset is a required field');
        }
        if (re.rentedAssetId == null && re.outSourced) {
            this.errors.push('Rented Asset is a required field');
        }
        if (re.rateTypeId == 3) {
            if (re.weight == 0 || re.tdrNo == null) {
                this.errors.push('Weight and TDR # are required field');
            }
        }
        if (re.rateTypeId == 4) {
            if (re.weight == 0 || re.weight == null) {
                this.errors.push('Weight is a required field');
            }
        }
        if (re.categoryMandatory && !this.enablePartialDelivery && re.categoryId == null) {
            this.errors.push('Category is a required field');
        }
        //if ((RE.PaymentModeId == 1 || RE.PaymentModeId == 3) && (RE.Rate == null || RE.Rate == 0)) {
        //  this.errors.push('Rate must be non-zero for Cash/FOB Shipments');
        //}
        if (re.emptyTrip) {
            //if (Object.keys(re.skUs.filter(x => !x.delete)).length > 0) { //&& !this.enablePartialDelivery) {
            //  this.errors.push('Empty Trip can`t carry SKUs');
            //}
            //if (Object.keys(re.charges.filter(x => !x.delete)).length != 0) {
            //  this.errors.push('No Charges could be applied on Empty Trip');
            //}
            //if (Object.keys(re.consignees.filter(x => !x.delete)).length != 0) {//&& this.enablePartialDelivery) {
            //  this.errors.push('There must not be any consignee in case of Empty Trip');
            //}    
        }
        else {
            if (!this.enablePartialDelivery) {
                if (re.productMandatory && Object.keys(re.skUs.filter(x => !x.delete)).length == 0) {
                    this.errors.push('Atleast one SKU must be selected before saving this Road Waybill');
                }
                if (re.skUs.some(x => !x.delete && !x.skuId)) {
                    this.errors.push('SKU must be selected in each row of Grid, please remove unnecessary rows');
                }
                if (Object.keys(re.skUs.filter(x => !x.delete)).length != 0) {
                    var valueArr = re.skUs.filter(x => !x.delete).map(function (item) { return item.skuId; }).slice().sort();
                    var duplicates = [];
                    for (var i = 0; i < valueArr.length - 1; i++) {
                        if (valueArr[i + 1] === valueArr[i]) {
                            this.errors.push('SKU must be unique!');
                            i = valueArr.length;
                        }
                    }
                }
            }
            else {
                if (!re.emptyTrip && re.consignees.filter(x => !x.delete).length == 0) {
                    this.errors.push('Atleast one consignee must be selected before saving this Road Waybill');
                }
                if (re.consignees.filter(x => !x.delete).length != 0) {
                    if (re.consignees.some(x => !x.delete && !x.skuId && !x.consigneeId)) {
                        this.errors.push('SKU and Consignee must be selected in each row of Grid, please remove unnecessary rows');
                    }
                    if (re.consignees.some(x => !x.delete && x.qty <= 0)) {
                        this.errors.push('No row in Consignee Grid can contain zero quantity');
                    }
                    if (this.ConsigneeTotal > re.vehicleCapacity) {
                        this.errors.push('Consignee wise Load breakup must not be more than Vehicle Capacity');
                    }
                    if (!re.multiDrop) {
                        var valueNonDivSKUArr = re.consignees.filter(x => !x.delete).map(function (item) { return item.skuId; }).slice().sort();
                        for (var i = 0; i < valueNonDivSKUArr.length - 1; i++) {
                            if (valueNonDivSKUArr[i + 1] === valueNonDivSKUArr[i]) {
                                this.errors.push('SKU used in Roadwaybill Consignee must be unique as Trip is not Multi Drop Trip!');
                                i = valueNonDivSKUArr.length;
                            }
                        }
                        var valueNonDivconsigneeArr = re.consignees.filter(x => !x.delete).map(function (item) { return item.consigneeId; }).slice().sort();
                        for (var i = 0; i < valueNonDivconsigneeArr.length - 1; i++) {
                            if (valueNonDivconsigneeArr[i + 1] === valueNonDivconsigneeArr[i]) {
                                this.errors.push('Consignee must be same as RWB consignee as this Trip is not a multi drop Trip!');
                                i = valueNonDivconsigneeArr.length;
                            }
                        }
                    }
                    else {
                        var valueDivconsigneeArr = re.consignees.filter(x => !x.delete).map(function (item) { return item.consigneeId; }).slice().sort();
                        for (var i = 0; i < valueDivconsigneeArr.length - 1; i++) {
                            if (valueDivconsigneeArr[i + 1] === valueDivconsigneeArr[i]) {
                                this.errors.push('Consignee must be unique as this Trip is multi drop Trip!');
                                i = valueDivconsigneeArr.length;
                            }
                        }
                        var valueDivSKUArr = re.consignees.filter(x => !x.delete).map(function (item) { return item.skuId; }).slice().sort();
                        for (var i = 0; i < valueDivSKUArr.length - 1; i++) {
                            if (valueDivSKUArr[i + 1] === valueDivSKUArr[i]) {
                                this.errors.push('SKU used in Roadwaybill Consignee must be be same as Trip is multi drop Trip!');
                                i = valueDivSKUArr.length;
                            }
                        }
                    }
                }
            }
            if (re.charges.some(x => !x.delete && !x.locked && x.amount <= 0)) {
                this.errors.push('No row in Charges can contain zero or -ve quantity');
            }
            if (re.charges.some(x => !x.delete && !x.chargeId)) {
                this.errors.push('Please Select valid Charge for each row of Charge Grid');
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
    setGridToolbar(enable) {
        this.isDisabled = !enable;
    }
    isReadOnly() {
        return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
    }
    disableSave() {
        if (document.getElementById("btnSave"))
            document.getElementById("btnSave").disabled = true;
    }
    initForm() {
        this.frmRWB.reset();
        this.frmRWB.disable();
        this.errors = [];
        //this.goProduct.api.setRowData([]);
        //this.goCharges.api.setRowData([]);
        //this.goConsignee.api.setRowData([]);
        this.skuData = [];
        this.consigneeData = [];
        this.chargesData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.setChargeFooter();
        if (this.enablePartialDelivery) {
            this.setConsigneeFooter();
        }
        this.lstShipper = [];
        this.lstConsignee = [];
        this.lstCategory = [];
        this.lstAsset = [];
        //this.setConsigneeFooter();  
        this.frmRWB.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('rwbNo', { static: true })
], RWBComponent.prototype, "rwbNo", void 0);
__decorate([
    core_1.ViewChild('jobNo', { static: true })
], RWBComponent.prototype, "jobNo", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], RWBComponent.prototype, "btnEdit", void 0);
RWBComponent = __decorate([
    core_1.Component({
        selector: 'app-rwb',
        templateUrl: './rwb.component.html',
        styleUrls: ['./rwb.component.css']
    })
], RWBComponent);
exports.RWBComponent = RWBComponent;
//# sourceMappingURL=rwb.component.js.map