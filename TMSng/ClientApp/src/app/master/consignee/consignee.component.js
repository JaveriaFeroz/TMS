"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsigneeComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ConsigneeComponent = class ConsigneeComponent {
    constructor(consigneer, formbulider, svcConsignee, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.consigneer = consigneer;
        this.formbulider = formbulider;
        this.svcConsignee = svcConsignee;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Consignee';
        this.colSearch = [
            { headerName: 'Consignee Id', field: 'consigneeId', width: 70 },
            { headerName: 'Consignee Name', field: 'consigneeName', },
            { headerName: 'Client Name', field: 'clientName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmConsignee = this.formbulider.group({
            consigneeId: [null, [forms_1.Validators.required]],
            consigneeName: [null, [forms_1.Validators.required]],
            isActive: [null],
            cityId: [null, [forms_1.Validators.required]],
            clientId: [null, [forms_1.Validators.required]],
            contactNo: [null, [forms_1.Validators.required]],
            address: [null, [forms_1.Validators.required]],
        });
        this.frmConsignee.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmConsignee.reset();
        this.frmConsignee.enable();
        this.frmConsignee.controls.consigneeId.disable();
        this.frmConsignee.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.consigneeName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmConsignee.controls.consigneeId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.consigneeId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcConsignee.getConsignees().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Consignee", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.consigneeId);
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
        this.frmConsignee.enable();
        this.frmConsignee.controls.consigneeId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.consigneeName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmConsignee.markAllAsTouched();
            if (!this.frmConsignee.invalid) {
                var formData = this.frmConsignee.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcConsignee.save(formData).subscribe(() => {
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
        this.consigneer.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcConsignee.get(Id).subscribe(consignee => {
                if (consignee) {
                    this.frmConsignee.disable();
                    this.frmConsignee.controls['consigneeId'].setValue(consignee.consigneeId);
                    this.frmConsignee.controls['consigneeName'].setValue(consignee.consigneeName);
                    this.frmConsignee.controls['address'].setValue(consignee.address);
                    this.frmConsignee.controls['clientId'].setValue(consignee.clientId);
                    this.frmConsignee.controls['contactNo'].setValue(consignee.contactNo);
                    this.frmConsignee.controls['cityId'].setValue(consignee.cityId);
                    this.frmConsignee.controls['isActive'].setValue(consignee.isActive);
                    this.footer = consignee.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
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
            this.svcConsignee.getLookup().subscribe(data => {
                this.lstClient = data.lstClient;
                this.lstCity = data.lstCity;
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
        let MobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
        if (!MobileNo.test(c.contactNo)) {
            this.errors.push('Contact # must be provided in valid format like 9999-9999999');
        }
    }
    initForm() {
        this.frmConsignee.reset();
        this.errors = [];
        this.frmConsignee.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('consigneeName', { static: true })
], ConsigneeComponent.prototype, "consigneeName", void 0);
__decorate([
    core_1.ViewChild('consigneeId', { static: true })
], ConsigneeComponent.prototype, "consigneeId", void 0);
ConsigneeComponent = __decorate([
    core_1.Component({
        selector: 'app-consignee',
        templateUrl: './consignee.component.html',
        styleUrls: ['./consignee.component.css']
    })
], ConsigneeComponent);
exports.ConsigneeComponent = ConsigneeComponent;
//# sourceMappingURL=consignee.component.js.map