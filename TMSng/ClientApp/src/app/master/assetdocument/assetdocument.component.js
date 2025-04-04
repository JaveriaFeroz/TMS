"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetDocumentComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGrid_date_component_1 = require("../../helper/agGrid-date.component");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let AssetDocumentComponent = class AssetDocumentComponent {
    constructor(router, formbulider, svcAssetDoc, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAssetDoc = svcAssetDoc;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Asset Document';
        this.colSearch = [
            { headerName: 'AssetId', field: 'assetId', width: 70 },
            { headerName: 'Asset #', field: 'assetNo' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.frameworkComponents = {
            agDateEditor: agGrid_date_component_1.agGridDateEditor
        };
        this.colDocs = [
            {
                headerName: 'Asset Document',
                children: [
                    {
                        headerName: "Document Type", field: "typeId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'DocumentType', class: "220" },
                        valueFormatter: agGridHelper_1.agGridHelper.getDocumentType, width: 220
                    },
                    {
                        headerName: "Issue Date", field: "issueDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter
                    },
                    {
                        headerName: "Expiry Date", field: "expiryDate", width: 105,
                        cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper_1.agGridHelper.dateFormatter,
                        cellEditorParams: { minDate: '-0d', maxDate: '+360d' }
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
        this.frmAssetDocs = this.formbulider.group({
            assetId: [null, [forms_1.Validators.required]],
        });
        this.frmAssetDocs.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmAssetDocs.controls.assetId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.assetId.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcAssetDoc.getAssets().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Asset", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.assetId);
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
        this.frmAssetDocs.enable();
        this.frmAssetDocs.controls.assetId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        //this.EnableGridButton();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmAssetDocs.markAllAsTouched();
            if (!this.frmAssetDocs.invalid) {
                var formData = this.frmAssetDocs.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcAssetDoc.save(formData).subscribe(() => {
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
        this.goDocs = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            //columnDefs: this.colDocs,
            //rowData: [],
            /*rowSelection: 'multiple',*/
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "typeId") {
                    if (params.data.typeId == "") {
                        params.node.setDataValue("typeId", null);
                    }
                    else {
                        params.node.setDataValue("typeId", parseInt(params.data.typeId));
                    }
                }
            }
        };
    }
    onAddLine() {
        try {
            var res = this.goDocs.api.applyTransaction({
                add: [{
                        typeId: null, issueDate: null, expiryDate: null, add: true, edit: false, delete: false
                    }]
            });
            this.goDocs.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "typeId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goDocs.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goDocs.api.getSelectedRows().forEach(x => x.delete = true);
                    //this.goDocs.api.getFilterInstance('delete').onFilterChanged();
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goDocs.api);
                }
                //agGridHelper.setGridDeleteFilter(this.goDocs.api);
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
        this.goDocs.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcAssetDoc.get(Id).subscribe(assetDoc => {
                if (assetDoc) {
                    this.frmAssetDocs.disable();
                    this.frmAssetDocs.controls['assetId'].setValue(assetDoc.assetId);
                    this.docsData = assetDoc.details;
                    this.footer = assetDoc.footer;
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
            this.svcAssetDoc.getLookup().subscribe(data => {
                this.lstAsset = data.lstAsset;
                sessionStorage.setItem("lstDocumentType", JSON.stringify(data.lstDocumentType));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(ad) {
        this.errors = [];
        if (Object.keys(ad.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one entry must exist in Asset Document Transaction to perform save operation');
        }
        else if (ad.details.some(x => !x.delete && x.issueDate > x.expiryDate)) {
            this.errors.push('Issue Date cannot be greater thne Expiry Date');
        }
        if (ad.details.some(x => !x.delete && x.typeId == null)) {
            this.errors.push('No row can have empty Vehcile Document');
        }
        if (Object.keys(ad.details.filter(x => !x.delete)).length != 0) {
            var valueArr = ad.details.filter(x => !x.delete).map(function (item) { return item.typeId; }).slice().sort();
            var duplicates = [];
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Document Type  must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    onChange(event) {
        this.get(event);
    }
    initForm() {
        this.frmAssetDocs.reset();
        this.frmAssetDocs.disable();
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.docsData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('assetId', { static: true })
], AssetDocumentComponent.prototype, "assetId", void 0);
AssetDocumentComponent = __decorate([
    core_1.Component({
        selector: 'app-assetdocument',
        templateUrl: './assetdocument.component.html',
        styleUrls: ['./assetdocument.component.css']
    })
], AssetDocumentComponent);
exports.AssetDocumentComponent = AssetDocumentComponent;
//# sourceMappingURL=assetdocument.component.js.map