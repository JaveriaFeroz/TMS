"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseReImbursementComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let ExpenseReImbursementComponent = class ExpenseReImbursementComponent {
    //#endregion
    constructor(router, formbulider, svcExpReimburse, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcExpReimburse = svcExpReimburse;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Expense Reimbursement';
        this.colSearch = [
            { headerName: 'Request #', field: 'requestId' },
            { headerName: 'Branch Name', field: 'branchName' },
            { headerName: 'Period From', field: 'periodFromName' },
            { headerName: 'Period To', field: 'periodToName' },
            //{ headerName: 'Status', field: 'status' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        //tbClose(requestId: number) {
        //  if (!this.frmER.invalid) {
        //    this.svcWaitDlg.open({});
        //    this.svcExpReimburse.close(requestId).subscribe(
        //      () => {
        //        this.initForm();
        //        agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
        //        this.svcToaster.showSuccess('Expense Reimbursement #  ' + requestId +
        //          ' successfully closed in the system.');
        //      },
        //      error => { this.svcToaster.showFailure(error); },
        //      () => { this.svcWaitDlg.close(); }
        //    );
        //  }
        //}
        //#endregion toolbar functions
        //#region grid setup
        //#region Expense ReImbursement Grid Definition & functions
        this.colDetail = [
            { headerName: 'Rwb #', field: 'rwbNo', width: 120, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true },
            { headerName: 'Job #', field: 'jobNo', width: 100 },
            { headerName: 'Route', field: 'routeName', width: 100 },
            { headerName: 'Asset #', field: 'assetNo', width: 80 },
            { headerName: 'Client', field: 'clientName', width: 150 },
            { headerName: 'Supplier', field: 'supplierName', width: 150 },
            { headerName: 'FuelAvg', field: 'fuelAvg', width: 80 },
            { headerName: 'Depature', field: 'depatureDateTime', width: 120 },
            { headerName: 'Arrival', field: 'arrivalDateTime', width: 120 },
            { headerName: 'Job Closure', field: 'jobClosureDateTime', width: 120 },
            { headerName: "Period", field: "periodName", width: 100 },
            {
                headerName: 'Amount', field: 'amount', width: 80, valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, type: "numericColumn", pinned: 'right', lockPinned: true,
                cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
            },
            { headerName: 'RwbId', field: 'rwbId', hide: true, suppressColumnsToolPanel: true },
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmER = this.formbulider.group({
            requestId: [null, [forms_1.Validators.required]],
            branchId: [null, [forms_1.Validators.required]],
            periodFromId: [null, [forms_1.Validators.required]],
            periodToId: [null, [forms_1.Validators.required]],
            //Closed: [null],
            //Status: [null],
        });
        this.frmER.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
        this.setLoadButton(true);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmER.reset();
        this.frmER.enable();
        this.frmER.controls.requestId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.setLoadButton(false);
        this.branchId.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcExpReimburse.getReimbursements().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Expense ReImbursement", this.colSearch, r);
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
    tbRecall() {
        this.initForm();
        this.frmER.controls.requestId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.requestId.nativeElement.focus();
    }
    tbEdit() {
        this.frmER.enable();
        this.frmER.controls.requestId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.branchId.focus();
        this.setLoadButton(true);
    }
    tbLoad() {
        try {
            if (!this.frmER.controls.branchId.value || !this.frmER.controls.periodFromId.value || !this.frmER.controls.periodToId.value) {
                this.svcToaster.showWarning("Please select valid Branch & Period Range before loading corresponding expenses for reimbursement", "Mandatory Parameters missing");
                return;
            }
            this.frmER.markAllAsTouched();
            this.svcWaitDlg.open({});
            this.svcExpReimburse.load(this.frmER.controls.branchId.value, this.frmER.controls.periodFromId.value, this.frmER.controls.periodToId.value).subscribe(erd => {
                if (erd.length != 0) {
                    this.detailData = erd;
                    this.setLoadButton(true);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record');
                }
            }, error => {
                this.svcToaster.showFailure(error);
            }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    tbSave() {
        try {
            this.frmER.markAllAsTouched();
            if (!this.frmER.invalid) {
                var formData = this.frmER.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcExpReimburse.save(formData).subscribe(data => {
                        this.svcToaster.showSuccess('ReImbursement Request # ' + data.requestId + ' saved successfully.!');
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.setFooter();
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
    getDetailFromGrid() {
        let rowData = [];
        this.goDetail.api.getSelectedNodes().forEach(node => rowData.push(node.data));
        return rowData;
    }
    setFooter() {
        try {
            let _amount = 0;
            if (this.requestId.nativeElement.value) {
                this.goDetail.api.forEachNode(function (rowNode, index) {
                    _amount += rowNode.data.amount;
                });
            }
            else {
                this.goDetail.api.getSelectedNodes().forEach(function (rowNode, index) {
                    _amount += rowNode.data.amount;
                });
            }
            this.goDetail.api.setPinnedBottomRowData([{
                    clientName: "Total", amount: _amount
                }]);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
    //#endregion
    initGrid() {
        this.goDetail = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            suppressRowClickSelection: true,
            rowSelection: 'multiple',
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                    return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
                }
            },
            onSelectionChanged: () => { this.setFooter(); },
            onCellClicked: function (event) {
                if (event.colDef.field == "selected") {
                    if (!event.data.selected) {
                        event.node.setDataValue('selected', true);
                    }
                    else {
                        event.node.setDataValue('selected', false);
                    }
                }
            },
            onRowDataChanged: () => { this.setFooter(); }
        };
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcExpReimburse.get(Id).subscribe(er => {
                if (er) {
                    this.frmER.disable();
                    this.frmER.controls['requestId'].setValue(er.requestId);
                    this.frmER.controls['branchId'].setValue(er.branchId);
                    this.frmER.controls['periodFromId'].setValue(er.periodFromId);
                    this.frmER.controls['periodToId'].setValue(er.periodToId);
                    this.detailData = er.details;
                    this.footer = er.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setFooter();
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcExpReimburse.getLookups().subscribe(data => {
                this.lstBranch = data.lstBranch;
                this.lstPeriod = data.lstPeriod;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(er) {
        this.errors = [];
        if (!er.branchId) {
            this.errors.push('Branch is a mandatory field');
        }
        if (!er.periodFromId || !er.periodToId) {
            this.errors.push('Period range selection is mandatory');
        }
        if (this.goDetail.api.getSelectedNodes().length < 1)
            this.errors.push('Atleast 1 RWB must be selected to create Expense Reimbursement Request!');
    }
    setLoadButton(disabled) {
        if (document.getElementById('btnLoad') != null) {
            document.getElementById("btnLoad").disabled = disabled;
            if (disabled) {
                this.frmER.controls.branchId.disable();
                this.frmER.controls.periodFromId.disable();
                this.frmER.controls.periodToId.disable();
            }
            else {
                this.frmER.controls.branchId.enable();
                this.frmER.controls.periodFromId.enable();
                this.frmER.controls.periodToId.enable();
            }
        }
    }
    initForm() {
        this.frmER.reset();
        this.frmER.disable();
        this.errors = [];
        this.detailData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('branchId', { static: true })
], ExpenseReImbursementComponent.prototype, "branchId", void 0);
__decorate([
    core_1.ViewChild('requestId', { static: true })
], ExpenseReImbursementComponent.prototype, "requestId", void 0);
ExpenseReImbursementComponent = __decorate([
    core_1.Component({
        selector: 'app-expensereimbursement',
        templateUrl: './expensereimbursement.component.html',
        styleUrls: ['./expensereimbursement.component.css']
    })
], ExpenseReImbursementComponent);
exports.ExpenseReImbursementComponent = ExpenseReImbursementComponent;
//# sourceMappingURL=expensereimbursement.component.js.map