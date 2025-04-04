import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { City } from './city';
import { CityService } from './city.service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css']
})

export class CityComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'City';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'cityId', width: 70 },
      { headerName: 'City Name', field: 'cityName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmCity: any;
  lstRegion: any;
  footer: agFooter = new agFooter();
  @ViewChild('cityName', { static: true }) cityName: ElementRef;
  @ViewChild('cityId', { static: true }) cityId: ElementRef;

  constructor(private cityr: Router, private formbulider: FormBuilder,
    private svcCity: CityService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmCity = this.formbulider.group({
      cityId: [null, [Validators.required]],
      cityName: [null, [Validators.required]],
      cityCode: [null, [Validators.required]],
      regionId: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmCity.disable();
    this.loadLookup();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmCity.reset();
    this.frmCity.enable();
    this.frmCity.controls.cityId.disable();
    this.frmCity.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.cityName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmCity.controls.cityId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.cityId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCity.getCities().subscribe(r => {
        this.svcSearchDlg.open("Search & Select City", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.cityId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmCity.enable();
    this.frmCity.controls.cityId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.cityName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmCity.markAllAsTouched();
      if (!this.frmCity.invalid) {
        this.svcWaitDlg.open({});
        var formData: City = this.frmCity.getRawValue();
        formData.footer = this.footer;
        this.svcCity.save(formData).subscribe(
          () => {
            this.initForm();
            agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            this.svcToaster.showSuccess('Record saved Successfully');
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.cityr.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcCity.get(Id).subscribe(
        city => {
          if (city) {
            this.frmCity.disable();
            this.frmCity.controls['cityId'].setValue(city.cityId);
            this.frmCity.controls['cityName'].setValue(city.cityName);
            this.frmCity.controls['cityCode'].setValue(city.cityCode);
            this.frmCity.controls['regionId'].setValue(city.regionId);
            this.frmCity.controls['isActive'].setValue(city.isActive);  
            this.footer = city.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcCity.getLookup().subscribe(
        data => {
          this.lstRegion = data.lstRegion;
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

  private initForm() {
    this.frmCity.reset();
    this.frmCity.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
