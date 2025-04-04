"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuelPaymentRequestComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let FuelPaymentRequestComponent = class FuelPaymentRequestComponent {
    //#endregion
    constructor(router, formbulider, svcFuelPayment, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcFuelPayment = svcFuelPayment;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Fuel Payment Request';
        this.colSearch = [
            { headerName: 'Request #', field: 'requestId' },
            { headerName: 'Date From', field: 'dateFrom' },
            { headerName: 'Date To', field: 'dateTo' },
            { headerName: 'Payment Method', field: 'paymentTypeName' },
            { headerName: 'Card Name', field: 'cardNo' },
            { headerName: 'Supplier Name', field: 'supplierName' },
        ];
        this.minDate = new Date(new Date().getDate() - 364);
        this.maxDate = new Date();
        this.errors = [];
        this.footer = new footer_1.agFooter();
        //#endregion toolbar functions
        //#region grid setup
        //#region Fuel Payment Grid Definition & functions
        this.colDetail = [
            {
                headerName: "Slip #", field: "slipNo", width: 140,
                headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true
            },
            { headerName: 'Slip Date', field: 'slipDate', width: 100 },
            { headerName: 'Job #', field: 'jobNo', width: 100 },
            { headerName: 'Genset?', field: 'genset', width: 100 },
            { headerName: 'Asset #', field: 'assetNo', width: 100 },
            { headerName: 'Fuel Litre', field: 'litre', width: 100, type: "numericColumn" },
            {
                headerName: 'Amount', field: 'amount', width: 100, type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser,
                pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
            },
            { headerName: 'jobId', field: 'jobId', hide: true, suppressColumnsToolPanel: true },
            { headerName: 'slipId', field: 'slipId', hide: true, suppressColumnsToolPanel: true },
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmFP = this.formbulider.group({
            requestId: [null],
            dateFrom: [null, [forms_1.Validators.required]],
            dateTo: [null, [forms_1.Validators.required]],
            supplierId: [null],
            isCardPayment: [false, [forms_1.Validators.required]],
            cardId: [null],
            //Closed: [null],
            //Status: [null],
        });
        this.frmFP.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
        this.setLoadButton(true);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmFP.reset();
        this.frmFP.enable();
        this.frmFP.controls.requestId.disable();
        this.frmFP.patchValue({ isCardPayment: false, dateFrom: new Date(), dateTo: new Date() });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.setLoadButton(false);
        //this.supplierId.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcFuelPayment.getRequests().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Fuel Payment Request", this.colSearch, r);
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
        this.frmFP.controls.requestId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.requestId.nativeElement.focus();
    }
    tbEdit() {
        this.frmFP.enable();
        this.frmFP.controls.requestId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.setLoadButton(true);
    }
    tbLoad() {
        try {
            if (((this.frmFP.controls.isCardPayment.value == true && !this.frmFP.controls.cardId.value) ||
                (!this.frmFP.controls.isCardPayment.value && !this.frmFP.controls.supplierId.value)) || !this.frmFP.controls.dateFrom.value || !this.frmFP.controls.dateTo.value) {
                this.svcToaster.showWarning("Please select valid Parameters before loading corresponding Fuel Slip for Payment Request", "Mandatory Parameters missing");
                return;
            }
            else if (this.frmFP.controls.dateFrom.value > this.frmFP.controls.dateTo.value) {
                this.svcToaster.showFailure('Date From must always be older or equal to Date To. Please correct your Date range criteria and retry', 'Invalid Date Range');
                return;
            }
            this.frmFP.markAllAsTouched();
            this.svcWaitDlg.open({});
            //else {
            if (!this.frmFP.controls.isCardPayment.value) {
                this.svcFuelPayment.getSupplierPending(this.frmFP.controls.supplierId.value, this.frmFP.controls.dateFrom.value, this.frmFP.controls.dateTo.value).subscribe(fp => {
                    if (fp.length != 0) {
                        this.detailData = fp;
                        this.setLoadButton(true);
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record');
                    }
                }, error => {
                    this.svcToaster.showFailure(error);
                }, () => { this.svcWaitDlg.close(); });
            }
            if (this.frmFP.controls.isCardPayment.value == true) {
                this.svcFuelPayment.getCardPending(this.frmFP.controls.cardId.value, this.frmFP.controls.dateFrom.value, this.frmFP.controls.dateTo.value).subscribe(fp => {
                    if (fp.length != 0) {
                        this.detailData = fp;
                        this.setLoadButton(true);
                    }
                    else {
                        this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record');
                    }
                }, error => {
                    this.svcToaster.showFailure(error);
                }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
            this.svcWaitDlg.close();
        }
    }
    tbSave() {
        try {
            this.frmFP.markAllAsTouched();
            if (!this.frmFP.invalid) {
                var formData = this.frmFP.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcFuelPayment.save(formData).subscribe(data => {
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
            let _amount = 0, _litre = 0;
            if (this.requestId.nativeElement.value) {
                this.goDetail.api.forEachNode(function (rowNode, index) {
                    _litre += rowNode.data.litre;
                    _amount += rowNode.data.amount;
                });
            }
            else {
                this.goDetail.api.getSelectedNodes().forEach(function (rowNode, index) {
                    _litre += rowNode.data.litre;
                    _amount += rowNode.data.amount;
                });
            }
            this.goDetail.api.setPinnedBottomRowData([{
                    clientName: "Total", litre: _litre, amount: _amount
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
            onRowDataChanged: () => { this.setFooter(); }
        };
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcFuelPayment.get(Id).subscribe(fp => {
                if (fp) {
                    this.frmFP.disable();
                    this.frmFP.controls['requestId'].setValue(fp.requestId);
                    this.frmFP.controls['dateFrom'].setValue(fp.dateFrom);
                    this.frmFP.controls['dateTo'].setValue(fp.dateTo);
                    this.frmFP.controls['isCardPayment'].setValue(fp.isCardPayment);
                    this.frmFP.controls['supplierId'].setValue(fp.supplierId);
                    this.frmFP.controls['cardId'].setValue(fp.cardId);
                    this.detailData = fp.details;
                    this.footer = fp.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setFooter();
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
            this.svcFuelPayment.getLookup().subscribe(data => {
                this.lstCard = data.lstCard;
                this.lstSupplier = data.lstSupplier;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(fp) {
        this.errors = [];
        if (!fp.dateFrom || !fp.dateTo) {
            this.errors.push('Date range is mandatory');
        }
        if (!fp.isCardPayment && !fp.supplierId) {
            this.errors.push('Please select valid Supplier against which fuel payment request needs to be created');
        }
        if (fp.isCardPayment && !fp.cardId) {
            this.errors.push('Please select valid card against which fuel payment request needs to be created');
        }
        if (fp.dateFrom > fp.dateTo) {
            this.errors.push('Date From must always be older or equal to Date To. Please correct your Date range criteria and retry');
        }
        if (this.goDetail.api.getSelectedNodes().length < 1)
            this.errors.push('Atleast 1 RWB must be selected to create Expense Reimbursement Request!');
    }
    setLoadButton(disabled) {
        if (document.getElementById('btnLoad') != null) {
            document.getElementById("btnLoad").disabled = disabled;
            if (disabled) {
                this.frmFP.controls.isCardPayment.disable();
                if (this.frmFP.controls.isCardPayment.value == true)
                    this.frmFP.controls.cardId.disable();
                else
                    this.frmFP.controls.supplierId.disable();
                this.frmFP.controls.dateFrom.disable();
                this.frmFP.controls.dateTo.disable();
            }
            else {
                this.frmFP.controls.isCardPayment.enable();
                if (this.frmFP.controls.isCardPayment.value == true)
                    this.frmFP.controls.cardId.enable();
                else
                    this.frmFP.controls.supplierId.enable();
                this.frmFP.controls.dateFrom.enable();
                this.frmFP.controls.dateTo.enable();
            }
        }
    }
    initForm() {
        this.frmFP.reset();
        this.frmFP.disable();
        this.errors = [];
        this.detailData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('supplierId', { static: true })
], FuelPaymentRequestComponent.prototype, "supplierId", void 0);
__decorate([
    core_1.ViewChild('cardId', { static: true })
], FuelPaymentRequestComponent.prototype, "cardId", void 0);
__decorate([
    core_1.ViewChild('requestId', { static: true })
], FuelPaymentRequestComponent.prototype, "requestId", void 0);
FuelPaymentRequestComponent = __decorate([
    core_1.Component({
        selector: 'app-fuelpaymentrequest',
        templateUrl: './fuelpaymentrequest.component.html',
        styleUrls: ['./fuelpaymentrequest.component.css']
    })
], FuelPaymentRequestComponent);
exports.FuelPaymentRequestComponent = FuelPaymentRequestComponent;
//# sourceMappingURL=fuelpaymentrequest.component.js.map