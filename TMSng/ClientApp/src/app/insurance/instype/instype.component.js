"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsTypeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let InsTypeComponent = class InsTypeComponent {
    //#endregion
    constructor(router, formbulider, svcInsType, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInsType = svcInsType;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Insurance Type';
        this.colSearch = [
            { headerName: 'Id', field: 'typeId', width: 70 },
            { headerName: 'Insurance Type Name', field: 'typeName' },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colDoc = [
            {
                headerName: 'Requied Documents',
                children: [
                    {
                        headerName: "Document Type", field: "docTypeId", cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'DocumentType', class: "300" },
                        valueFormatter: agGridHelper_1.agGridHelper.getDocumentType, width: 300
                    },
                    {
                        headerName: 'Mandatory', field: 'mandatory', width: 100,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
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
        this.frmInsType = this.formbulider.group({
            typeId: [null, [forms_1.Validators.required]],
            typeName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmInsType.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInsType.reset();
        this.frmInsType.enable();
        this.frmInsType.controls.typeId.disable();
        this.frmInsType.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.typeName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmInsType.controls.typeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.typeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInsType.getInsTypes().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Insurance Type", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.typeId);
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
        this.frmInsType.enable();
        this.frmInsType.controls.typeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.typeName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmInsType.markAllAsTouched();
            if (!this.frmInsType.invalid) {
                var formData = this.frmInsType.getRawValue();
                formData.docs = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcInsType.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstDocumentType");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goDoc = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                sortable: true
            },
            rowSelection: 'single',
            onCellClicked: function (event) {
                if (event.colDef.field == "mandatory") {
                    if (!event.data.mandatory) {
                        event.node.setDataValue('mandatory', true);
                    }
                    else {
                        event.node.setDataValue('mandatory', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "docTypeId") {
                    if (params.data.typeId != "") {
                        params.node.setDataValue("docTypeId", parseInt(params.data.typeId));
                    }
                    else {
                        params.node.setDataValue("docTypeId", null);
                    }
                }
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
    }
    onAddLine() {
        try {
            var res = this.goDoc.api.applyTransaction({
                add: [{
                        docTypeId: null, mandatory: false, add: true, edit: false, delete: false,
                    }]
            });
            this.goDoc.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "docTypeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goDoc.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDoc.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDoc.api);
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
        this.goDoc.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcInsType.get(Id).subscribe(instype => {
                if (instype) {
                    this.frmInsType.disable();
                    this.frmInsType.controls['typeId'].setValue(instype.typeId);
                    this.frmInsType.controls['typeName'].setValue(instype.typeName);
                    this.frmInsType.controls['isActive'].setValue(instype.isActive);
                    this.docsData = instype.docs;
                    this.footer = instype.footer;
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
            this.svcInsType.getLookup().subscribe(data => {
                sessionStorage.setItem("lstDocumentType", JSON.stringify(data.lstDocumentType));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(int) {
        this.errors = [];
        if (Object.keys(int.docs.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one entry must exist in Required Document List');
        }
        if (int.docs.some(x => !x.delete && !x.docTypeId)) {
            this.errors.push('Please select valid Document Type for each row in the Grid');
        }
        if (Object.keys(int.docs.filter(x => !x.delete)).length != 0) {
            var valueArr = int.docs.filter(x => !x.delete).map(function (item) { return item.docTypeId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Document type must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmInsType.reset();
        this.frmInsType.disable();
        this.errors = [];
        this.docsData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('typeName', { static: true })
], InsTypeComponent.prototype, "typeName", void 0);
__decorate([
    core_1.ViewChild('typeId', { static: true })
], InsTypeComponent.prototype, "typeId", void 0);
InsTypeComponent = __decorate([
    core_1.Component({
        selector: 'app-instype',
        templateUrl: './instype.component.html',
        styleUrls: ['./instype.component.css']
    })
], InsTypeComponent);
exports.InsTypeComponent = InsTypeComponent;
//# sourceMappingURL=instype.component.js.map