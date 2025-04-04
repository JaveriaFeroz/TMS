"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupInvoiceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let GroupInvoiceComponent = class GroupInvoiceComponent {
    //#endregion
    constructor(router, formbulider, svcGroupInvoice, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcGroupInvoice = svcGroupInvoice;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.optionName = 'Group Invoice';
        this.colSearch = [
            { headerName: 'Group Invoice #', field: 'groupInvoiceNo', },
            { headerName: 'Invoice Date', field: 'invoiceDate' },
            { headerName: 'Client Name', field: 'clientName' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        //#endregion toolbar functions
        //#region grid setup
        //#region group invoice Grid Definition & functions
        this.colDetail = [
            { headerName: "Invoice #", field: "invoiceNo", width: 130, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true },
            { headerName: "Invoice Date", field: "invoiceDate", width: 120 },
            { headerName: "Invoice Type", field: "workFlowName", width: 180 },
            { headerName: "Net Amount", field: "amount", width: 120, valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                valueParser: agGridHelper_1.agGridHelper.numberValueParser, type: "numericColumn", pinned: 'right', lockPinned: true,
                cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
            }
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmGI = this.formbulider.group({
            groupInvoiceNo: [null, [forms_1.Validators.required]],
            invoiceDate: [null, [forms_1.Validators.required]],
            clientId: [null, [forms_1.Validators.required]]
        });
        this.frmGI.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        document.getElementById("btnSave").disabled = true;
        this.setLoadButton(true);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmGI.reset();
        this.frmGI.enable();
        this.frmGI.controls.groupInvoiceNo.disable();
        this.frmGI.patchValue({ invoiceDate: new Date() });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.setLoadButton(false);
        this.clientId.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcGroupInvoice.getInvoices().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Group Invoice", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.groupInvoiceNo);
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
        this.frmGI.controls.groupInvoiceNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.groupInvoiceNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmGI.enable();
        this.frmGI.controls.groupInvoiceNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.setLoadButton(true);
        this.clientId.focus();
    }
    tbLoad() {
        try {
            if (!this.frmGI.controls.clientId.value) {
                this.svcToaster.showWarning("Please select valid customer before loading corresponding invoices for grouping", "Client Mandatory");
                return;
            }
            this.frmGI.markAllAsTouched();
            this.svcWaitDlg.open({});
            this.svcGroupInvoice.load(this.frmGI.controls.clientId.value).subscribe(gid => {
                if (gid.length != 0) {
                    this.detailData = gid;
                    this.setLoadButton(true);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key or you don`t have access to this record');
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
            this.frmGI.markAllAsTouched();
            if (!this.frmGI.invalid) {
                var formData = this.frmGI.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcGroupInvoice.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Group Invoice generated successfully!');
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
            if (this.groupInvoiceNo.nativeElement.value) {
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
                    workFlowName: "Total", amount: _amount
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
    //grdDetailCellValueChanged(params) {
    //  if (params.column.getId() === "selected") {
    //    this.setFooter();
    //  }
    //}
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcGroupInvoice.get(Id).subscribe(ia => {
                if (ia) {
                    this.frmGI.disable();
                    this.frmGI.controls['groupInvoiceNo'].setValue(ia.groupInvoiceNo);
                    this.frmGI.controls['invoiceDate'].setValue(ia.invoiceDate);
                    this.frmGI.controls['clientId'].setValue(ia.clientId);
                    this.detailData = ia.details;
                    this.footer = ia.footer;
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
            this.svcGroupInvoice.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(gi) {
        this.errors = [];
        if (this.goDetail.api.getSelectedNodes().length < 2)
            this.errors.push('Atleast 2 invoices must be selected to create group invoice');
    }
    setLoadButton(disabled) {
        if (document.getElementById('btnLoad') != null) {
            document.getElementById("btnLoad").disabled = disabled;
            if (disabled)
                this.frmGI.controls.clientId.disable();
            else
                this.frmGI.controls.clientId.enable();
        }
    }
    initForm() {
        this.frmGI.reset();
        this.frmGI.disable();
        this.errors = [];
        this.detailData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('clientId', { static: true })
], GroupInvoiceComponent.prototype, "clientId", void 0);
__decorate([
    core_1.ViewChild('groupInvoiceNo', { static: true })
], GroupInvoiceComponent.prototype, "groupInvoiceNo", void 0);
GroupInvoiceComponent = __decorate([
    core_1.Component({
        selector: 'app-groupinvoice',
        templateUrl: './groupinvoice.component.html',
        styleUrls: ['./groupinvoice.component.css']
    })
], GroupInvoiceComponent);
exports.GroupInvoiceComponent = GroupInvoiceComponent;
//# sourceMappingURL=groupinvoice.component.js.map