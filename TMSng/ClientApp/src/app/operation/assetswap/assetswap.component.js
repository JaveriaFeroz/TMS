"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetSwapComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
let AssetSwapComponent = class AssetSwapComponent {
    //footer: agFooter = new agFooter();
    constructor(router, formbulider, svcAssetSwap, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAssetSwap = svcAssetSwap;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        //public AssetSwaps: AssetSwap;
        //#region constant variables
        this.optionName = 'Asset Swap';
        this.errors = [];
        this.loadLookup();
    }
    ngOnInit() {
        this.frmAssetSwap = this.formbulider.group({
            fromAssetId: [null, [forms_1.Validators.required]],
            fromDriverId1: [null, [forms_1.Validators.required]],
            fromDriverId2: [null, [forms_1.Validators.required]],
            fromDriverName1: [null, [forms_1.Validators.required]],
            fromDriverName2: [null, [forms_1.Validators.required]],
            fromTrailerId: [null, [forms_1.Validators.required]],
            fromTrailerNo: [null, [forms_1.Validators.required]],
            toAssetId: [null, [forms_1.Validators.required]],
            toDriverId1: [null, [forms_1.Validators.required]],
            toDriverId2: [null, [forms_1.Validators.required]],
            toDriverName1: [null, [forms_1.Validators.required]],
            toDriverName2: [null, [forms_1.Validators.required]],
            toTrailerId: [null, [forms_1.Validators.required]],
            toTrailerNo: [null, [forms_1.Validators.required]],
        });
        this.frmAssetSwap.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmAssetSwap.reset();
        this.frmAssetSwap.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmAssetSwap.controls.fromTrailerName.disable();
        this.frmAssetSwap.controls.toTrailerName.disable();
        this.frmAssetSwap.controls.fromDriverIdName1.disable();
        this.frmAssetSwap.controls.toDriverIdName1.disable();
        this.frmAssetSwap.controls.fromDriverIdName2.disable();
        this.frmAssetSwap.controls.toDriverIdName2.disable();
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbSwapTrailer() {
        var formData = this.frmAssetSwap.getRawValue();
        const trailerId = formData.fromTrailerId;
        const trailerNo = formData.fromTrailerNo;
        this.frmAssetSwap.controls['fromTrailerId'].setValue(formData.toTrailerId);
        this.frmAssetSwap.controls['fromTrailerNo'].setValue(formData.toTrailerNo);
        this.frmAssetSwap.controls['toTrailerId'].setValue(trailerId);
        this.frmAssetSwap.controls['toTrailerNo'].setValue(trailerNo);
    }
    tbSwapDriver1() {
        var formData = this.frmAssetSwap.getRawValue();
        const _driverName = formData.fromDriverName1;
        const _driverId = formData.fromDriverId1;
        this.frmAssetSwap.controls['fromDriverId1'].setValue(formData.toDriverId1);
        this.frmAssetSwap.controls['fromDriverName1'].setValue(formData.toDriverName1);
        this.frmAssetSwap.controls['toDriverId1'].setValue(_driverId);
        this.frmAssetSwap.controls['toDriverName1'].setValue(_driverName);
    }
    tbSwapDriver2() {
        var formData = this.frmAssetSwap.getRawValue();
        const _driverName = formData.fromDriverName2;
        const _driverId = formData.fromDriverId2;
        this.frmAssetSwap.controls['fromDriverId2'].setValue(formData.toDriverId2);
        this.frmAssetSwap.controls['fromDriverName2'].setValue(formData.toDriverName2);
        this.frmAssetSwap.controls['toDriverId2'].setValue(_driverId);
        this.frmAssetSwap.controls['toDriverName2'].setValue(_driverName);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    tbSave() {
        try {
            this.frmAssetSwap.markAllAsTouched();
            if (!this.frmAssetSwap.invalid) {
                var formData = this.frmAssetSwap.getRawValue();
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcAssetSwap.save(formData).subscribe(() => {
                        this.initForm();
                        this.svcToaster.showSuccess('Record saved Successfully');
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    //#endregion toolbar functions
    //#region local functions
    loadLookup() {
        try {
            this.svcAssetSwap.getLookup().subscribe(data => {
                this.lstAsset = data.lstAsset;
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
        if (as.fromTrailerId == as.toTrailerId) {
            this.errors.push('The from & to Trailer numbers must be difference"');
        }
        if (as.fromDriverId1 == as.fromDriverId2) {
            this.errors.push('The From Driver 1 & 2 must be 2 different drivers');
        }
        if (as.toDriverId1 == as.toDriverId2) {
            this.errors.push('The To Driver 1 & 2 must be 2 different drivers');
        }
        if (as.fromDriverId1 == as.toDriverId1) {
            this.errors.push('The Driver 1 in Asset From and Asset To must be different');
        }
        if (as.fromDriverId2 == as.toDriverId2) {
            this.errors.push('The Driver 2 in Asset From and Asset To must be different');
        }
        if (as.fromDriverId1 == as.toDriverId2) {
            this.errors.push('Driver 1 in Asset From must be different from Driver 2 in Asset To');
        }
        if (as.fromDriverId2 == as.toDriverId1) {
            this.errors.push('Driver 2 in Asset From must be different from Driver 1 in Asset To');
        }
    }
    fromAssetChanged(event) {
        // const newVal = event.target.value;
        this.lstFromAsset = this.lstAsset.filter(x => x.assetId == event)[0];
        //this.lstToAsset = this.lstAsset.filter(x => x.cityId == this.lstFromAsset.cityId && x.leaseTypeId == this.lstFromAsset.leaseTypeId &&
        //  x.assetId != this.lstFromAsset.assetId);
        // this.frmAssetSwap.controls['FromAssetId'].setValue(this.lstFromAsset.FromAssetId);
        this.frmAssetSwap.controls['fromDriverId1'].setValue(this.lstFromAsset.driverId1);
        this.frmAssetSwap.controls['fromDriverId2'].setValue(this.lstFromAsset.driverId2);
        this.frmAssetSwap.controls['fromDriverName1'].setValue(this.lstFromAsset.driverName1);
        this.frmAssetSwap.controls['fromDriverName2'].setValue(this.lstFromAsset.driverName2);
        this.frmAssetSwap.controls['fromTrailerId'].setValue(this.lstFromAsset.trailerId);
        this.frmAssetSwap.controls['fromTrailerNo'].setValue(this.lstFromAsset.trailerNo);
    }
    toAssetChanged(event) {
        // const newVal = event.target.value;
        this.lstToDAsset = this.lstAsset.filter(x => x.assetId == event)[0];
        //this.frmAssetSwap.controls['ToAssetId'].setValue(this.lstToDAsset.ToAssetId);
        this.frmAssetSwap.controls['toDriverId1'].setValue(this.lstToDAsset.driverId1);
        this.frmAssetSwap.controls['toDriverId2'].setValue(this.lstToDAsset.driverId2);
        this.frmAssetSwap.controls['toDriverName1'].setValue(this.lstToDAsset.driverName1);
        this.frmAssetSwap.controls['toDriverName2'].setValue(this.lstToDAsset.driverName2);
        this.frmAssetSwap.controls['toTrailerId'].setValue(this.lstToDAsset.trailerId);
        this.frmAssetSwap.controls['toTrailerNo'].setValue(this.lstToDAsset.trailerNo);
    }
    initForm() {
        this.frmAssetSwap.reset();
        this.frmAssetSwap.disable();
        this.errors = [];
    }
};
AssetSwapComponent = __decorate([
    core_1.Component({
        selector: 'app-assetswap',
        templateUrl: './assetswap.component.html',
        styleUrls: ['./assetswap.component.css']
    })
], AssetSwapComponent);
exports.AssetSwapComponent = AssetSwapComponent;
//# sourceMappingURL=assetswap.component.js.map