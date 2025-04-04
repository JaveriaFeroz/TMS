"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKUCategoryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let SKUCategoryComponent = class SKUCategoryComponent {
    constructor(router, formbulider, svcCategory, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCategory = svcCategory;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'SKU Category';
        this.colSearch = [
            { headerName: 'Category Id', field: 'categoryId', width: 70 },
            { headerName: 'Category Name', field: 'categoryName' },
            { headerName: 'Active?', field: 'isActive' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colClient = [
            {
                headerName: 'Clients Associated',
                children: [
                    {
                        headerName: "Client", field: "clientId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Client', class: "325" }, valueFormatter: agGridHelper_1.agGridHelper.getClientName, width: 325
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
        this.frmSKUCategory = this.formbulider.group({
            categoryId: [null, [forms_1.Validators.required]],
            categoryName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmSKUCategory.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmSKUCategory.reset();
        this.frmSKUCategory.enable();
        this.frmSKUCategory.controls.categoryId.disable();
        this.frmSKUCategory.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.categoryName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmSKUCategory.controls.categoryId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.categoryId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcCategory.getCategories().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Category", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.categoryId);
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
        this.frmSKUCategory.enable();
        this.frmSKUCategory.controls.categoryId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.categoryName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmSKUCategory.markAllAsTouched();
            if (!this.frmSKUCategory.invalid) {
                var formData = this.frmSKUCategory.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcCategory.save(formData).subscribe(() => {
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
                    if (params.data.clientId) {
                        params.node.setDataValue("clientId", parseInt(params.data.clientId));
                    }
                    else {
                        params.node.setDataValue("clientId", null);
                    }
                }
            },
        };
    }
    onAddLine() {
        try {
            var res = this.goClient.api.applyTransaction({
                add: [{ clientId: null, add: true, edit: false, delete: false }]
            });
            this.goClient.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "clientId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goClient.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goClient.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goClient.api);
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
    getDetailFromGrid() {
        let rowData = [];
        this.goClient.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcCategory.get(Id).subscribe(sc => {
                if (sc) {
                    this.frmSKUCategory.disable();
                    this.frmSKUCategory.controls['categoryId'].setValue(sc.categoryId);
                    this.frmSKUCategory.controls['categoryName'].setValue(sc.categoryName);
                    this.frmSKUCategory.controls['isActive'].setValue(sc.isActive);
                    this.clientsData = sc.details;
                    this.footer = sc.footer;
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
            this.svcCategory.getLookup().subscribe(data => {
                sessionStorage.setItem("lstClient", JSON.stringify(data.lstClient));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(sc) {
        this.errors = [];
        if (Object.keys(sc.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('At least one entry must exist in Client List to perform save operation');
        }
        else {
            if (sc.details.some(x => !x.delete && !x.clientId)) {
                this.errors.push('Each row must contain valid client');
            }
            if (Object.keys(sc.details.filter(x => !x.delete)).length != 0) {
                var valueArr = sc.details.filter(x => !x.delete).map(function (item) { return item.clientId; }).slice().sort();
                for (var i = 0; i < valueArr.length - 1; i++) {
                    if (valueArr[i + 1] === valueArr[i]) {
                        this.errors.push('Clients must be unique!');
                        i = valueArr.length;
                    }
                }
            }
        }
    }
    initForm() {
        this.frmSKUCategory.reset();
        this.frmSKUCategory.disable();
        this.errors = [];
        this.clientsData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('categoryName', { static: true })
], SKUCategoryComponent.prototype, "categoryName", void 0);
__decorate([
    core_1.ViewChild('categoryId', { static: true })
], SKUCategoryComponent.prototype, "categoryId", void 0);
SKUCategoryComponent = __decorate([
    core_1.Component({
        selector: 'app-category',
        templateUrl: './skucategory.component.html',
        styleUrls: ['./skucategory.component.css']
    })
], SKUCategoryComponent);
exports.SKUCategoryComponent = SKUCategoryComponent;
//# sourceMappingURL=skucategory.component.js.map