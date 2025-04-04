"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let ClientComponent = class ClientComponent {
    constructor(router, formbulider, svcClient, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcClient = svcClient;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region readonly variables
        this.optionName = 'Client';
        this.colSearch = [
            { headerName: 'Id', field: 'clientId', width: 70 },
            { headerName: 'Client Name', field: 'clientName' },
            { headerName: 'Active?', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
        this.errors = [];
        this.colInvFormat = [
            {
                headerName: 'Client Invoice Format',
                children: [
                    {
                        headerName: "Format", field: "formatId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'InvFormat', class: "350" },
                        valueFormatter: agGridHelper_1.agGridHelper.getInvFormatName, width: 350
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
        this.frmClient = this.formbulider.group({
            clientId: [null, [forms_1.Validators.required]],
            accountId: [null],
            clientName: [null, [forms_1.Validators.required]],
            address: [null, [forms_1.Validators.required]],
            cityId: [null, [forms_1.Validators.required]],
            industryVerticalId: [null, [forms_1.Validators.required]],
            contractPeriod: [null],
            paymentModeId: [null, [forms_1.Validators.required]],
            creditDays: [null],
            creditLimit: [null],
            contactPerson: [null, [forms_1.Validators.required]],
            contactNo: [null],
            email: [null],
            url: [null],
            ntn: [null, [forms_1.Validators.required]],
            strn: [null, [forms_1.Validators.required]],
            controlClientId: [null],
            isActive: [null],
            //routeByConsigneee: [null],
            shortName: [null, [forms_1.Validators.required]],
        });
        this.frmClient.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmClient.reset();
        this.frmClient.enable();
        this.frmClient.controls.clientId.disable();
        this.frmClient.patchValue({ isActive: true, contractPeriod: 0, creditLimit: 0, creditDays: 0 }); //, RouteByConsigneee: this.routeByConsignee});
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.clientName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmClient.controls.clientId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.clientId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcClient.getClients().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Client", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.clientId);
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
        this.frmClient.enable();
        this.frmClient.controls.clientId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.clientName.nativeElement.focus();
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbSave() {
        try {
            this.frmClient.markAllAsTouched();
            if (!this.frmClient.invalid) {
                var formData = this.frmClient.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcClient.save(formData).subscribe(() => {
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
        sessionStorage.removeItem("lstInvoiceFormat");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    initGrid() {
        this.goInvFormat = {
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
                if (params.colDef.field == "formatId") {
                    if (params.data.formatId != "") {
                        params.node.setDataValue("formatId", parseInt(params.data.formatId));
                    }
                    else {
                        params.node.setDataValue("formatId", null);
                    }
                }
            }
        };
    }
    onAddLine() {
        try {
            var res = this.goInvFormat.api.applyTransaction({
                add: [{ formatId: null, add: true, edit: false, delete: false }]
            });
            this.goInvFormat.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "formatId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goInvFormat.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goInvFormat.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goInvFormat.api);
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
        this.goInvFormat.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcClient.get(Id).subscribe(client => {
                if (client) {
                    this.frmClient.disable();
                    this.frmClient.controls['clientId'].setValue(client.clientId);
                    this.frmClient.controls['accountId'].setValue(client.accountId);
                    this.frmClient.controls['clientName'].setValue(client.clientName);
                    this.frmClient.controls['shortName'].setValue(client.shortName);
                    this.frmClient.controls['address'].setValue(client.address);
                    this.frmClient.controls['cityId'].setValue(client.cityId);
                    this.frmClient.controls['industryVerticalId'].setValue(client.industryVerticalId);
                    this.frmClient.controls['contractPeriod'].setValue(client.contractPeriod);
                    this.frmClient.controls['contactNo'].setValue(client.contactNo);
                    this.frmClient.controls['email'].setValue(client.email);
                    this.frmClient.controls['url'].setValue(client.url);
                    this.frmClient.controls['contactPerson'].setValue(client.contactPerson);
                    this.frmClient.controls['paymentModeId'].setValue(client.paymentModeId);
                    this.frmClient.controls['creditLimit'].setValue(client.creditLimit);
                    this.frmClient.controls['creditDays'].setValue(client.creditDays);
                    this.frmClient.controls['controlClientId'].setValue(client.controlClientId);
                    this.frmClient.controls['ntn'].setValue(client.ntn);
                    this.frmClient.controls['strn'].setValue(client.strn);
                    //this.frmClient.controls['StandardLoadingTime'].setValue(client.standardLoadingTime); 
                    this.frmClient.controls['isActive'].setValue(client.isActive);
                    //            this.frmClient.controls['RouteByConsigneee'].setValue(this.routeByConsignee);
                    this.invFormatData = client.details;
                    this.footer = client.footer;
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
            this.svcWaitDlg.open({});
        }
    }
    loadLookup() {
        try {
            this.svcClient.getLookup().subscribe(data => {
                this.lstIndustry = data.lstIndustry;
                this.lstPaymentMode = data.lstPaymentMode;
                this.lstCity = data.lstCity;
                sessionStorage.setItem("lstInvoiceFormat", JSON.stringify(data.lstInvoiceFormat));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(c) {
        this.errors = [];
        let reMobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
        let reEmail = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$');
        let reNTN = new RegExp('^[0-9]{7}-[0-9]{1}$');
        let reSTRN = new RegExp('^[0-9]{13}$');
        if (!reMobileNo.test(c.contactNo)) {
            this.errors.push('Contact # must be provided in valid format like xxxx-xxxxxxx');
        }
        if (!reEmail.test(c.email)) {
            this.errors.push('Email must be provided in valid format like someone@someone.com');
        }
        if (!reNTN.test(c.ntn)) {
            this.errors.push('NTN must be provided in valid format like xxxxxxx-x');
        }
        if (!reSTRN.test(c.strn)) {
            this.errors.push('STRN must be provided in valid format like xxxxxxxxxxxxx');
        }
        if (c.creditDays < 0)
            this.errors.push('Credit days must be non-negative');
        if (c.creditLimit < 0)
            this.errors.push('Credit Limit must be non-negative');
        if (Object.keys(c.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('Invoice format must be selected in each row of Grid, please remove unnecessary rows');
        }
        if (c.details.some(x => !x.delete && x.formatId == null)) {
            this.errors.push('No row in  format grid can be  without Invoice Format');
        }
        if (Object.keys(c.details.filter(x => !x.delete)).length != 0) {
            var valueArr = c.details.filter(x => !x.delete).map(function (item) { return item.formatId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Invoice Formats must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmClient.reset();
        this.frmClient.disable();
        this.errors = [];
        this.invFormatData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('clientName', { static: true })
], ClientComponent.prototype, "clientName", void 0);
__decorate([
    core_1.ViewChild('clientId', { static: true })
], ClientComponent.prototype, "clientId", void 0);
ClientComponent = __decorate([
    core_1.Component({
        selector: 'app-client',
        templateUrl: './client.component.html',
        styleUrls: ['./client.component.css']
    })
], ClientComponent);
exports.ClientComponent = ClientComponent;
//# sourceMappingURL=client.component.js.map