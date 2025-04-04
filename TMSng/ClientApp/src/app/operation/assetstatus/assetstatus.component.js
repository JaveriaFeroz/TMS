"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetStatusComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let AssetStatusComponent = class AssetStatusComponent {
    constructor(router, formbulider, svcAssetStatus, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAssetStatus = svcAssetStatus;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //public AssetStatuss: AssetStatus;
        //#region constant variables
        this.optionName = 'Change Asset Status';
        this.colSearch = [
            { headerName: 'AssetId', field: 'assetId', width: 70 },
            { headerName: 'AssetNo', field: 'assetNo' },
            { headerName: 'AssetType', field: 'assetTypeName' },
            { headerName: 'IsActive', field: 'isActive' },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmAssetStatus = this.formbulider.group({
            assetNo: [null, [forms_1.Validators.required]],
            assetId: [null],
            assetTypeId: [null, [forms_1.Validators.required]],
            statusId: [null, [forms_1.Validators.required]],
            newstatusId: [null, [forms_1.Validators.required]],
            remarks: [null, [forms_1.Validators.required]]
        });
        this.frmAssetStatus.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    //tbAdd() {
    //  this.frmAssetStatus.reset();
    //  this.frmAssetStatus.enable();
    //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    //  this.assetNo.nativeElement.focus();
    //}
    //tbSearch(): void {
    //  try {
    //    this.svcWaitDlg.open({});
    //    this.assetstatusService.GetList().subscribe(r => {
    //      this.svcSearchDlg.open("Search & Select  Asset", this.colSearch, r);
    //      this.svcSearchDlg.selected().subscribe(r => {
    //        if (r) {
    //          this.get(r.assetNo);
    //        }
    //      });
    //    },
    //      error => { this.svcToaster.showFailure(error); },
    //      () => { this.svcWaitDlg.close(); });
    //  }
    //  catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
    //}
    tbRecall() {
        this.initForm();
        this.frmAssetStatus.controls.assetNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.assetNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmAssetStatus.enable();
        this.frmAssetStatus.controls.assetNo.disable();
        this.frmAssetStatus.controls.assetTypeId.disable();
        this.frmAssetStatus.controls.statusId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.newstatusId.focus();
    }
    tbSave() {
        try {
            this.frmAssetStatus.markAllAsTouched();
            if (!this.frmAssetStatus.invalid) {
                var formData = this.frmAssetStatus.getRawValue();
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcAssetStatus.save(formData.assetId, formData.statusId, formData.newstatusId, formData.remarks).subscribe(() => {
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
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcAssetStatus.get(Id).subscribe(assetstatus => {
                if (assetstatus) {
                    this.frmAssetStatus.disable();
                    this.frmAssetStatus.controls['assetId'].setValue(assetstatus.assetId);
                    this.frmAssetStatus.controls['assetNo'].setValue(assetstatus.assetNo);
                    this.frmAssetStatus.controls['assetTypeId'].setValue(assetstatus.assetTypeId);
                    this.frmAssetStatus.controls['statusId'].setValue(assetstatus.statusId);
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcAssetStatus.getLookup().subscribe(data => {
                this.lstAssetType = data.lstAssetType;
                this.lstAssetStatus = data.lstAssetStatus;
                this.lstNewAssetStatus = this.lstAssetStatus.filter(x => x.editable == 1);
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(as) {
        this.errors = [];
        if (as.newstatusId == as.statusId) {
            this.errors.push('Current Status and Changed Status are same. Nothing to Save!');
        }
    }
    initForm() {
        this.frmAssetStatus.reset();
        this.frmAssetStatus.disable();
        this.errors = [];
    }
};
__decorate([
    core_1.ViewChild('newstatusId', { static: true })
], AssetStatusComponent.prototype, "newstatusId", void 0);
__decorate([
    core_1.ViewChild('assetNo', { static: true })
], AssetStatusComponent.prototype, "assetNo", void 0);
AssetStatusComponent = __decorate([
    core_1.Component({
        selector: 'app-assetstatus',
        templateUrl: './assetstatus.component.html',
        styleUrls: ['./assetstatus.component.css']
    })
], AssetStatusComponent);
exports.AssetStatusComponent = AssetStatusComponent;
//# sourceMappingURL=assetstatus.component.js.map