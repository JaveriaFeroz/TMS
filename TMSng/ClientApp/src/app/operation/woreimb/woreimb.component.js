"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WOReImbComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let WOReImbComponent = class WOReImbComponent {
    //#endregion
    constructor(router, formbulider, svcWOReImb, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcWOReImb = svcWOReImb;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'WO ReImbursement';
        this.colSearch = [
            { headerName: 'Request #', field: 'requestId' },
            { headerName: 'Period From', field: 'periodFromName' },
            { headerName: 'Period To', field: 'periodToName' },
            { headerName: 'Branch Name', field: 'branchName' },
            { headerName: 'Supplier Name', field: 'supplierName' },
            { headerName: 'Lease Type', field: 'leaseTypeName' },
            { headerName: 'Status', field: 'stateName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        //#endregion toolbar functions
        //#region grid setup        
        //#region WO ReImbursement Grid Definition & functions
        this.colWOReImb = [
            {
                headerName: 'WO Detail',
                children: [
                    {
                        headerName: 'S', field: 'selected', width: 70, editable: false,
                        headerCheckboxSelection: true,
                        headerCheckboxSelectionFilteredOnly: true,
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
                    { headerName: "Period", field: "periodName", editable: false, width: 70 },
                    { headerName: 'WO #', field: 'woNo', editable: false, width: 100 },
                    { headerName: 'Vehicle #', field: 'assetNo', editable: false, width: 80 },
                    { headerName: 'WO Date', field: 'woDate', editable: false, width: 90 },
                    { headerName: 'Category', field: 'categoryName', editable: false, width: 130 },
                    { headerName: 'Close Date', field: 'woCloseDate', editable: false, width: 90 },
                    { headerName: 'Amount', field: 'amount', editable: false, width: 120 },
                    { headerName: 'Activity Detail', field: 'activityName', cellEditor: "agLargeTextCellEditor", editable: false, width: 500 },
                    { headerName: 'woKey', field: 'woKey', hide: true, suppressColumnsToolPanel: true },
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
        this.periodId = agFormHelper_1.agFormHelper.opsPeriodId();
    }
    ngOnInit() {
        this.frmWOReImb = this.formbulider.group({
            requestId: [null, [forms_1.Validators.required]],
            supplierId: [null, [forms_1.Validators.required]],
            branchId: [null, [forms_1.Validators.required]],
            leaseTypeId: [null, [forms_1.Validators.required]],
            periodFromId: [null, [forms_1.Validators.required]],
            periodToId: [null, [forms_1.Validators.required]],
            subCategoryId: [null],
            closed: [null],
            status: [null],
            periodFromName: [null],
            periodToName: [null],
        });
        this.frmWOReImb.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmWOReImb.reset();
        this.frmWOReImb.enable();
        this.frmWOReImb.controls.requestId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmWOReImb.patchValue({ closed: false, status: 'Open' });
        this.frmWOReImb.controls.status.disable();
        this.frmWOReImb.patchValue({ periodFromId: this.periodId, periodToId: this.periodId });
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.supplierId.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmWOReImb.controls.requestId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.requestId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcWOReImb.getReimbursements().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Work Order ReImbursement", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.requestId);
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
        this.frmWOReImb.enable();
        this.frmWOReImb.controls.requestId.disable();
        this.frmWOReImb.controls.supplierId.disable();
        this.frmWOReImb.controls.branchId.disable();
        this.frmWOReImb.controls.leaseTypeId.disable();
        this.frmWOReImb.controls.periodFromId.disable();
        this.frmWOReImb.controls.periodToId.disable();
        this.frmWOReImb.controls.subCategoryId.disable();
        this.frmWOReImb.controls.status.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.supplierId.focus();
    }
    tbLoad() {
        try {
            this.frmWOReImb.markAllAsTouched();
            var formData = this.frmWOReImb.getRawValue();
            if (formData.branchId == null || formData.supplierId == null || formData.leaseTypeId == null) {
                this.svcToaster.showFailure('Please select valid value for each parameter before hitting Load button');
                return;
            }
            else if (formData.leaseTypeId == 1 && formData.subCategoryId == null) {
                this.svcToaster.showFailure('Please select valid Sub Catagory before hitting Load button');
                return;
            }
            else if (formData.periodFromId > formData.periodToId) {
                this.svcToaster.showFailure('Period From must always be older or equal to Period To. Please correct your Period range criteria and retry');
                return;
            }
            else {
                if (formData.leaseTypeId != 1) {
                    formData.subCategoryId = 0;
                }
                this.svcWOReImb.load(formData.branchId, formData.supplierId, formData.subCategoryId, formData.periodFromId, formData.periodToId, formData.leaseTypeId).subscribe(WOR => {
                    if (WOR.length != 0) {
                        this.woReImbData = WOR;
                        this.frmWOReImb.controls.supplierId.disable();
                        this.frmWOReImb.controls.branchId.disable();
                        this.frmWOReImb.controls.leaseTypeId.disable();
                        this.frmWOReImb.controls.periodFromId.disable();
                        this.frmWOReImb.controls.periodToId.disable();
                        this.frmWOReImb.controls.subCategoryId.disable();
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                    }
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        this.frmWOReImb.markAllAsTouched();
        if (!this.frmWOReImb.invalid) {
            var formData = this.frmWOReImb.getRawValue();
            formData.details = this.getDetailFromGrid();
            formData.footer = this.footer;
            this.validate(formData);
            if (this.errors.length > 0) {
                return;
            }
            else {
                this.svcWaitDlg.open({});
                this.svcWOReImb.save(formData).subscribe(data => {
                    this.svcToaster.showSuccess('ReImbursement Request # ' + data.requestId +
                        ' saved successfully. Press close button to finalize this ReImbursement request!');
                    this.frmWOReImb.controls['requestId'].setValue(data.requestId);
                    this.frmWOReImb.controls['status'].setValue('Saved');
                    this.frmWOReImb.controls['closed'].setValue(0);
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
    }
    tbClose(requestId) {
        if (!this.frmWOReImb.invalid) {
            this.svcWaitDlg.open({});
            this.svcWOReImb.close(requestId).subscribe(() => {
                this.initForm();
                agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                this.svcToaster.showSuccess('Work Order Reimbursement #  ' + requestId +
                    ' successfully closed in the system.');
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    getDetailFromGrid() {
        let rowData = [];
        this.goWOReImb.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goWOReImb = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                sortable: true,
                resizable: true,
                singleClickEdit: true
            },
            rowSelection: 'multiple',
            rowDeselection: true,
            onRowSelected: function (event) {
                if (event.node.isSelected()) {
                    event.node.setDataValue('selected', true);
                }
                else {
                    event.node.setDataValue('selected', false);
                }
            },
            onCellClicked: function (event) {
                if (event.colDef.field == "selected") {
                    if (!event.data.selected) {
                        event.node.setDataValue('selected', true);
                    }
                    else {
                        event.node.setDataValue('selected', false);
                        event.node.setSelected(false);
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
            this.svcWOReImb.get(Id).subscribe(wor => {
                if (wor) {
                    this.frmWOReImb.disable();
                    this.frmWOReImb.controls['requestId'].setValue(wor.requestId);
                    this.frmWOReImb.controls['supplierId'].setValue(wor.supplierId);
                    this.frmWOReImb.controls['branchId'].setValue(wor.branchId);
                    this.frmWOReImb.controls['periodFromId'].setValue(wor.periodFromId);
                    this.frmWOReImb.controls['periodToId'].setValue(wor.periodToId);
                    this.frmWOReImb.controls['subCategoryId'].setValue(wor.subCategoryId);
                    this.frmWOReImb.controls['leaseTypeId'].setValue(wor.leaseTypeId);
                    if (wor.closed == false) {
                        this.frmWOReImb.controls['status'].setValue('Saved');
                    }
                    else {
                        this.frmWOReImb.controls['status'].setValue('closed');
                    }
                    this.frmWOReImb.controls['closed'].setValue(wor.closed);
                    this.woReImbData = wor.details;
                    this.footer = wor.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
            this.svcWOReImb.getLookup().subscribe(data => {
                this.lstBranch = data.lstBranch;
                this.lstSupplier = data.lstSupplier;
                this.lstSubCategory = data.lstSubCategory;
                this.lstLeaseType = data.lstLeaseType;
                this.lstPeriod = data.lstPeriod;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(wor) {
        this.errors = [];
        if (wor.closed == true) {
            this.errors.push('No further changes can be made to this Work order ReImbursement request while its status is Closed already.');
        }
        else if (wor.supplierId == null) {
            this.errors.push('Supplier selection is mandatory');
        }
        else if (wor.branchId == null) {
            this.errors.push('Branch selection is mandatory');
        }
        else if (wor.leaseTypeId != 2 && wor.subCategoryId == 0) {
            this.errors.push('Sub Category selection is mandatory');
        }
        else if (wor.periodFromId == 0) {
            this.errors.push('Period From selection is mandatory');
        }
        else if (wor.periodToId == 0) {
            this.errors.push('Period To selection is mandatory');
        }
        if (wor.details.length == wor.details.filter(x => !x.selected).length) {
            this.errors.push('Atleast one Work Order must be selected to save ReImbursement Request');
        }
    }
    initForm() {
        this.frmWOReImb.reset();
        this.frmWOReImb.disable();
        this.errors = [];
        this.woReImbData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('supplierId', { static: true })
], WOReImbComponent.prototype, "supplierId", void 0);
__decorate([
    core_1.ViewChild('requestId', { static: true })
], WOReImbComponent.prototype, "requestId", void 0);
WOReImbComponent = __decorate([
    core_1.Component({
        selector: 'app-woreimb',
        templateUrl: './woreimb.component.html',
        styleUrls: ['./woreimb.component.css']
    })
], WOReImbComponent);
exports.WOReImbComponent = WOReImbComponent;
//# sourceMappingURL=woreimb.component.js.map