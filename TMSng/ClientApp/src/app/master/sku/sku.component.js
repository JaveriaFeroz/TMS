"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKUComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let SKUComponent = class SKUComponent {
    constructor(router, formbulider, svcSKU, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcSKU = svcSKU;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Client SKU';
        this.colSearch = [
            { headerName: 'SKU Id', field: 'skuId', width: 70 },
            { headerName: 'SKU Name', field: 'skuName' },
            { headerName: 'Is Active', field: 'isActive' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colClient = [
            {
                headerName: 'Client SKUs',
                children: [
                    {
                        headerName: "Client", field: "clientId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Client', class: "350" },
                        valueFormatter: agGridHelper_1.agGridHelper.getClientName, width: 350
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        /*    sessionStorage.removeItem("lstClient");*/
        this.loadLookup();
        this.initGrid();
        this.enableGLEntries = agFormHelper_1.agFormHelper.enableGL();
    }
    ngOnInit() {
        this.frmSKU = this.formbulider.group({
            skuId: [null, [forms_1.Validators.required]],
            skuName: [null, [forms_1.Validators.required]],
            isActive: [null],
            skuTypeId: [null],
            enableGLEntries: [null],
        });
        this.frmSKU.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        this.frmSKU.patchValue({ enableGLEntries: this.enableGLEntries });
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmSKU.reset();
        this.frmSKU.enable();
        this.frmSKU.controls.skuId.disable();
        this.frmSKU.patchValue({ isActive: true, enableGLEntries: this.enableGLEntries });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.skuName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmSKU.controls.skuId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.skuId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcSKU.getSKUs().subscribe(r => {
                this.svcSearchDlg.open("Search & Select SKU", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.skuId);
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
        this.frmSKU.enable();
        this.frmSKU.controls.skuId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.skuName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmSKU.markAllAsTouched();
            if (!this.frmSKU.invalid) {
                var formData = this.frmSKU.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcSKU.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstClient");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    //#region SKU Client Grid Definition & functions
    initGrid() {
        this.goClient = {
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
                if (params.colDef.field == "clientId") {
                    if (params.data.clientId != "") {
                        params.node.setDataValue("clientId", parseInt(params.data.clientId));
                    }
                    else {
                        params.node.setDataValue("clientId", null);
                    }
                }
            }
            //      onGridReady: () => {
            ///*        this.goClient.api.sizeColumnsToFit();*/
            //      }
        };
    }
    onAddClient() {
        try {
            var res = this.goClient.api.applyTransaction({ add: [{ clientId: null, add: true, edit: false, delete: false }] });
            this.goClient.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "clientId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteClient() {
        try {
            if (this.goClient.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goClient.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goClient.api);
                    // this.goClient.api.getFilterInstance('delete').onFilterChanged();
                }
                //agGridHelper.setGridDeleteFilter(this.goClient.api);
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
        this.goClient.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcSKU.get(Id).subscribe(sku => {
                if (sku) {
                    this.frmSKU.disable();
                    this.frmSKU.controls['skuId'].setValue(sku.skuId);
                    this.frmSKU.controls['skuName'].setValue(sku.skuName);
                    this.frmSKU.controls['skuTypeId'].setValue(sku.skuTypeId);
                    this.frmSKU.controls['isActive'].setValue(sku.isActive);
                    this.frmSKU.controls['enableGLEntries'].setValue(this.enableGLEntries);
                    this.clientData = sku.details;
                    this.footer = sku.footer;
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
            this.svcSKU.getLookup().subscribe(data => {
                sessionStorage.setItem("lstClient", JSON.stringify(data.lstClient));
                this.lstSKUType = data.lstSKUType;
                //this.lstSKUType = [
                //  { id: 1, name: 'Liquid Per (KL)' },
                //  { id: 2, name: 'Liquid Per (Ton)' },
                //];
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    //private setGridToolbar(enable: boolean) {
    //  if (document.getElementById('btnAddClient') as HTMLInputElement != null) {
    //    (<HTMLInputElement>document.getElementById("btnAddClient")).disabled = !enable;
    //    (<HTMLInputElement>document.getElementById("btnDeleteClient")).disabled = !enable;
    //  }
    //}
    validate(s) {
        this.errors = [];
        if (s.skuTypeId == null && this.enableGLEntries) {
            this.errors.push('SKU Type is a mandatory field');
        }
        if (Object.keys(s.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one entry must exist in Client List');
        }
        if (s.details.some(x => !x.delete && x.clientId == null)) {
            this.errors.push('No row can have empty Client, if specific row is no longer required, please remove it from the grid');
        }
        if (Object.keys(s.details.filter(x => !x.delete)).length != 0) {
            var valueArr = s.details.filter(x => !x.delete).map(function (item) { return item.clientId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Client must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmSKU.reset();
        this.frmSKU.disable();
        this.errors = [];
        this.clientData = [];
        this.frmSKU.patchValue({ enableGLEntries: this.enableGLEntries });
        //this.goClient.api.setRowData([]);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('skuName', { static: true })
], SKUComponent.prototype, "skuName", void 0);
__decorate([
    core_1.ViewChild('skuId', { static: true })
], SKUComponent.prototype, "skuId", void 0);
SKUComponent = __decorate([
    core_1.Component({
        selector: 'app-sku',
        templateUrl: './sku.component.html',
        styleUrls: ['./sku.component.css']
    })
], SKUComponent);
exports.SKUComponent = SKUComponent;
//# sourceMappingURL=sku.component.js.map