"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipperComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ShipperComponent = class ShipperComponent {
    constructor(shipperr, formbulider, svcShipper, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.shipperr = shipperr;
        this.formbulider = formbulider;
        this.svcShipper = svcShipper;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Shipper';
        this.colSearch = [
            { headerName: 'Shipper Id', field: 'shipperId', width: 70 },
            { headerName: 'Shipper Name', field: 'shipperName', },
            { headerName: 'Client Name', field: 'clientName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmShipper = this.formbulider.group({
            shipperId: [null, [forms_1.Validators.required]],
            shipperName: [null, [forms_1.Validators.required]],
            isActive: [null],
            cityId: [null, [forms_1.Validators.required]],
            clientId: [null, [forms_1.Validators.required]],
            contactNo: [null, [forms_1.Validators.required]],
            address: [null, [forms_1.Validators.required]],
        });
        this.frmShipper.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmShipper.reset();
        this.frmShipper.enable();
        this.frmShipper.controls.shipperId.disable();
        this.frmShipper.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.shipperName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmShipper.controls.shipperId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.shipperId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcShipper.getShippers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Shipper", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.shipperId);
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
        this.frmShipper.enable();
        this.frmShipper.controls.shipperId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.shipperName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmShipper.markAllAsTouched();
            if (!this.frmShipper.invalid) {
                var formData = this.frmShipper.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcShipper.save(formData).subscribe(() => {
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
        this.shipperr.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcShipper.get(Id).subscribe(shipper => {
                if (shipper) {
                    this.frmShipper.disable();
                    this.frmShipper.controls['shipperId'].setValue(shipper.shipperId);
                    this.frmShipper.controls['shipperName'].setValue(shipper.shipperName);
                    this.frmShipper.controls['address'].setValue(shipper.address);
                    this.frmShipper.controls['clientId'].setValue(shipper.clientId);
                    this.frmShipper.controls['contactNo'].setValue(shipper.contactNo);
                    this.frmShipper.controls['cityId'].setValue(shipper.cityId);
                    this.frmShipper.controls['isActive'].setValue(shipper.isActive);
                    this.footer = shipper.footer;
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
            this.svcShipper.getLookup().subscribe(data => {
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
    validate(s) {
        this.errors = [];
        let reMobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
        if (!reMobileNo.test(s.contactNo)) {
            this.errors.push('Contact # must be provided in valid format like xxxx-xxxxxxx');
        }
    }
    initForm() {
        this.frmShipper.reset();
        this.frmShipper.disable();
        this.errors = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('shipperName', { static: true })
], ShipperComponent.prototype, "shipperName", void 0);
__decorate([
    core_1.ViewChild('shipperId', { static: true })
], ShipperComponent.prototype, "shipperId", void 0);
ShipperComponent = __decorate([
    core_1.Component({
        selector: 'app-shipper',
        templateUrl: './shipper.component.html',
        styleUrls: ['./shipper.component.css']
    })
], ShipperComponent);
exports.ShipperComponent = ShipperComponent;
//# sourceMappingURL=shipper.component.js.map