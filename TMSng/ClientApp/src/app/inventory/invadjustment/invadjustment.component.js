"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvAdjustmentComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let InvAdjustmentComponent = class InvAdjustmentComponent {
    //#endregion
    constructor(router, formbulider, svcInvAdj, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInvAdj = svcInvAdj;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Inventory Adjustment';
        this.colSearch = [
            { headerName: 'Adjustment #', field: 'adjId', width: 70 },
            { headerName: 'Date', field: 'adjDate' },
            { headerName: 'Branch', field: 'branchName' }
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnAdd').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        //#endregion toolbar functions
        //#region grid setup
        //#region Adjustment Grid Definition & functions
        this.colAdjustment = [
            {
                headerName: 'Inventory Adjustment Details',
                children: [
                    {
                        headerName: "Product", field: "productId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Product', class: "300" },
                        valueFormatter: agGridHelper_1.agGridHelper.getProductName, width: 300
                    },
                    {
                        headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
                    },
                    { headerName: "UoM", field: "uoMName", width: 80, editable: false },
                    { headerName: "UomId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
                    {
                        headerName: "Price", field: "price", type: "numericColumn",
                        valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 100, editable: false
                    },
                    { headerName: "Reason", field: "reason", cellEditor: "agLargeTextCellEditor", width: 200, tooltipField: "reason" },
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmInvAdjustment = this.formbulider.group({
            adjId: [null, [forms_1.Validators.required]],
            adjDate: [null, [forms_1.Validators.required]],
            branchId: [null, [forms_1.Validators.required]],
        });
        this.frmInvAdjustment.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
        this.targetNode = document.getElementById('divHToolbar');
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInvAdjustment.reset();
        this.frmInvAdjustment.enable();
        this.frmInvAdjustment.controls.adjId.disable();
        this.frmInvAdjustment.patchValue({ adjDate: new Date() });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.branchId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmInvAdjustment.controls.adjId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.adjId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInvAdj.getInvAdjustments().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Inventory Adjustment", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.adjId);
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
        this.frmInvAdjustment.enable();
        this.frmInvAdjustment.controls.adjId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        //(<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
        this.branchId.focus();
    }
    tbSave() {
        try {
            this.frmInvAdjustment.markAllAsTouched();
            if (!this.frmInvAdjustment.invalid) {
                var formData = this.frmInvAdjustment.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcInvAdj.save(formData).subscribe(() => {
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
        this.router.navigate(['/MainForm']);
    }
    onAddLine() {
        try {
            var res = this.goAdjustment.api.applyTransaction({
                add: [{
                        productId: null, quantity: 0, uoMId: null, uoMName: null, price: 0, reason: null
                    }]
            });
            this.goAdjustment.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (confirm("Are you sure you want to Delete selected row?")) {
                const selectedRow = this.goAdjustment.api.getFocusedCell();
                if (selectedRow) {
                    var rowNode = this.goAdjustment.api.getRowNode(selectedRow.rowIndex.toString());
                    this.goAdjustment.api.selectNode(rowNode);
                    this.goAdjustment.api.applyTransaction({ remove: this.goAdjustment.api.getSelectedRows() });
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
        this.goAdjustment.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goAdjustment = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            tooltipShowDelay: 0,
            tooltipMouseTrack: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                sortable: true,
                resizable: true,
                singleClickEdit: true,
            },
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
            },
            onCellValueChanged: function (params) {
                if (params.colDef.field == "productId") {
                    if (params.data.productId == "") {
                        params.node.setDataValue("productId", null);
                    }
                    else {
                        var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
                        var product = lstProduct.filter(x => x.productId == params.data.productId)[0];
                        params.node.setDataValue('price', product.purchasePrice);
                        params.node.setDataValue('uoMName', product.uomName);
                        params.node.setDataValue('uoMId', product.uomId);
                        params.node.setDataValue("productId", parseInt(params.data.productId));
                    }
                }
            }
        };
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcInvAdj.get(Id).subscribe(invadj => {
                if (invadj) {
                    this.frmInvAdjustment.disable();
                    this.frmInvAdjustment.controls['adjId'].setValue(invadj.adjId);
                    this.frmInvAdjustment.controls['adjDate'].setValue(invadj.adjDate);
                    this.frmInvAdjustment.controls['branchId'].setValue(invadj.branchId);
                    this.adjustmentData = invadj.details;
                    this.footer = invadj.footer;
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
            this.svcWaitDlg.open({});
            this.svcInvAdj.getLookup().subscribe(data => {
                this.lstBranch = data.lstBranch;
                sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(ia) {
        this.errors = [];
        if (Object.keys(ia.details).length == 0) {
            this.errors.push('Atleast one product must exist in Inventory Adjustment Transaction to perform save operation');
        }
        if (ia.details.some(x => !x.productId)) {
            this.errors.push('Product must be selected in each row of Grid, please remove unnecessary rows');
        }
        if (ia.details.some(x => x.quantity == 0)) {
            this.errors.push('No row in Adjustment Transaction can contain zero quantity');
        }
        if (ia.details.some(x => !x.reason)) {
            this.errors.push('Please enter valid reason for adjustment');
        }
        if (ia.details.length != 0) {
            var valueArr = ia.details.map(function (item) { return item.productId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Product must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmInvAdjustment.reset();
        this.frmInvAdjustment.disable();
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.adjustmentData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('branchId', { static: true })
], InvAdjustmentComponent.prototype, "branchId", void 0);
__decorate([
    core_1.ViewChild('adjId', { static: true })
], InvAdjustmentComponent.prototype, "adjId", void 0);
InvAdjustmentComponent = __decorate([
    core_1.Component({
        selector: 'app-invadjustment',
        templateUrl: './invadjustment.component.html',
        styleUrls: ['./invadjustment.component.css']
    })
], InvAdjustmentComponent);
exports.InvAdjustmentComponent = InvAdjustmentComponent;
//# sourceMappingURL=invadjustment.component.js.map