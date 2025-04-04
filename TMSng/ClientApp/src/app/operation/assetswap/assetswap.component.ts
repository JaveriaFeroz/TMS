import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AssetSwap } from './assetswap';
import { AssetSwapService } from './assetswap.service';

@Component({  
  selector: 'app-assetswap',  
  templateUrl: './assetswap.component.html',  
  styleUrls: ['./assetswap.component.css']  
})  

export class AssetSwapComponent implements OnInit {
  //public AssetSwaps: AssetSwap;
  //#region constant variables
  readonly optionName: string = 'Asset Swap';
  //#endregion
  frmAssetSwap: any;
  lstAsset: any;
  lstFromAsset: any;
  lstToAsset: any;
  lstToDAsset: any;
  errors: string[] = [];
  //footer: agFooter = new agFooter();

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcAssetSwap: AssetSwapService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.loadLookup();
  }  
  
  ngOnInit() {
    this.frmAssetSwap = this.formbulider.group({
      fromAssetId: [null, [Validators.required]],
      fromDriverId1: [null, [Validators.required]],
      fromDriverId2: [null, [Validators.required]],
      fromDriverName1: [null, [Validators.required]],
      fromDriverName2: [null, [Validators.required]],     
      fromTrailerId: [null, [Validators.required]],
      fromTrailerNo: [null, [Validators.required]],
      toAssetId: [null, [Validators.required]],
      toDriverId1: [null, [Validators.required]],
      toDriverId2: [null, [Validators.required]],
      toDriverName1: [null, [Validators.required]],
      toDriverName2: [null, [Validators.required]],
      toTrailerId: [null, [Validators.required]],
      toTrailerNo: [null, [Validators.required]],
    });
    this.frmAssetSwap.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions

  tbAdd() {
    this.frmAssetSwap.reset();
    this.frmAssetSwap.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmAssetSwap.controls.fromTrailerName.disable();
    this.frmAssetSwap.controls.toTrailerName.disable();
    this.frmAssetSwap.controls.fromDriverIdName1.disable();
    this.frmAssetSwap.controls.toDriverIdName1.disable();
    this.frmAssetSwap.controls.fromDriverIdName2.disable();
    this.frmAssetSwap.controls.toDriverIdName2.disable();
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbSwapTrailer() {  
    var formData= this.frmAssetSwap.getRawValue();
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
        var formData: AssetSwap = this.frmAssetSwap.getRawValue();
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcAssetSwap.save(formData).subscribe(
            () => {
              this.initForm();
              this.svcToaster.showSuccess('Record saved Successfully');
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); }
          );
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }  
  //#endregion toolbar functions

  //#region local functions
  private loadLookup() {
    try {
      this.svcAssetSwap.getLookup().subscribe(
        data => {
          this.lstAsset = data.lstAsset;
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(as: AssetSwap) {
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

  fromAssetChanged(event) {  // event will give you full breif of action
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

   toAssetChanged(event){  // event will give you full breif of action
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
  private initForm() {
    this.frmAssetSwap.reset();    
    this.frmAssetSwap.disable();
    this.errors = [];
  }
  //#endregion local functions
}
