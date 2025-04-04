"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsPolicyComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let InsPolicyComponent = class InsPolicyComponent {
    //#endregion
    constructor(router, formbulider, svcInsPolicy, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcInsPolicy = svcInsPolicy;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Insurance Policy';
        this.colSearch = [
            { headerName: 'Id', field: 'policyId', width: 70 },
            { headerName: 'Policy #', field: 'policyNo' },
            { headerName: 'Effective Date', field: 'fromDate', width: 80 },
            { headerName: 'Expiry Date', field: 'toDate', width: 80 },
            { headerName: 'Company', field: 'insuranceCompanyName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colAsset = [
            {
                headerName: 'Vehicle covered under this Policy',
                children: [
                    {
                        headerName: "Asset", field: "assetId", width: 80, cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Asset', class: "80" }, valueFormatter: agGridHelper_1.agGridHelper.getAssetName
                    },
                    {
                        headerName: "Remarks", field: "remarks", width: 320, cellEditor: "agLargeTextCellEditor"
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
        this.frmInsPolicy = this.formbulider.group({
            policyId: [null, [forms_1.Validators.required]],
            policyNo: [null, [forms_1.Validators.required]],
            fromDate: [null, [forms_1.Validators.required]],
            toDate: [null, [forms_1.Validators.required]],
            insCompanyId: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmInsPolicy.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmInsPolicy.reset();
        this.frmInsPolicy.enable();
        this.frmInsPolicy.controls.policyId.disable();
        this.frmInsPolicy.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.policyNo.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmInsPolicy.controls.policyId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.policyId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcInsPolicy.getPolicies().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Insurance Policy", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.policyId);
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
        this.frmInsPolicy.enable();
        this.frmInsPolicy.controls.policyId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.policyNo.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmInsPolicy.markAllAsTouched();
            if (!this.frmInsPolicy.invalid) {
                var formData = this.frmInsPolicy.getRawValue();
                formData.assets = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcInsPolicy.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstAsset");
        this.router.navigate(['/MainForm']);
    }
    //#endregion
    //#region grid setup
    initGrid() {
        this.goAsset = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                sortable: true
            },
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "assetId") {
                    if (params.data.assetId != "") {
                        params.node.setDataValue("assetId", parseInt(params.data.assetId));
                    }
                    else {
                        params.node.setDataValue("assetId", null);
                    }
                }
            },
        };
    }
    onAddAssetLine() {
        try {
            var res = this.goAsset.api.applyTransaction({
                add: [{
                        assetId: null, remarks: null, add: true, edit: false, delete: false
                    }]
            });
            this.goAsset.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "assetId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteAssetLine() {
        try {
            if (this.goAsset.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goAsset.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goAsset.api);
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
        this.goAsset.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcInsPolicy.get(Id).subscribe(inspolicy => {
                if (inspolicy) {
                    this.frmInsPolicy.disable();
                    this.frmInsPolicy.controls['policyId'].setValue(inspolicy.policyId);
                    this.frmInsPolicy.controls['policyNo'].setValue(inspolicy.policyNo);
                    this.frmInsPolicy.controls['insCompanyId'].setValue(inspolicy.insCompanyId);
                    this.frmInsPolicy.controls['fromDate'].setValue(inspolicy.fromDate);
                    this.frmInsPolicy.controls['toDate'].setValue(inspolicy.toDate);
                    this.frmInsPolicy.controls['isActive'].setValue(inspolicy.isActive);
                    this.assetData = inspolicy.assets;
                    this.footer = inspolicy.footer;
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
            this.svcInsPolicy.getLookup().subscribe(data => {
                this.lstInsuranceCompany = data.lstInsuranceCompany;
                sessionStorage.setItem("lstAsset", JSON.stringify(data.lstAsset));
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(ip) {
        this.errors = [];
        if (Object.keys(ip.assets.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one entry must exist in applicable Asset');
        }
        if (ip.assets.some(x => !x.delete && !x.assetId)) {
            this.errors.push('Please select valid Asset for each row of the Grid');
        }
        if (Object.keys(ip.assets.filter(x => !x.delete)).length != 0) {
            var valueArr = ip.assets.filter(x => !x.delete).map(function (item) { return item.assetId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Asset must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmInsPolicy.reset();
        this.frmInsPolicy.disable();
        this.errors = [];
        this.assetData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('policyId', { static: true })
], InsPolicyComponent.prototype, "policyId", void 0);
__decorate([
    core_1.ViewChild('policyNo', { static: true })
], InsPolicyComponent.prototype, "policyNo", void 0);
InsPolicyComponent = __decorate([
    core_1.Component({
        selector: 'app-inspolicy',
        templateUrl: './inspolicy.component.html',
        styleUrls: ['./inspolicy.component.css']
    })
], InsPolicyComponent);
exports.InsPolicyComponent = InsPolicyComponent;
//# sourceMappingURL=inspolicy.component.js.map