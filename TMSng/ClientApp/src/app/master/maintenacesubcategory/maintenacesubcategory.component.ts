import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { MaintenaceSubcategory } from './maintenacesubcategory';
import { MaintenaceSubCategoryService } from './maintenacesubcategory.service';

@Component({
  selector: 'app-maintenacesubcategory',
  templateUrl: './maintenacesubcategory.component.html',
  styleUrls: ['./maintenacesubcategory.component.css']
})

export class MaintenaceSubCategoryComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Maintenance Sub Category';
  readonly colSearch =
    [
      { headerName: 'Category Id', field: 'subCategoryId', width: 70 },
      { headerName: 'Sub Category Name', field: 'subCategoryName', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmMaintenaceSubCategory: any;
  footer: agFooter = new agFooter();
  @ViewChild('subCategoryName', { static: true }) subCategoryName: ElementRef;
  @ViewChild('subCategoryId', { static: true }) subCategoryId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcMaintSubCategory: MaintenaceSubCategoryService, private svcToaster: agToasterService,
    private helper: agFormHelper, private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmMaintenaceSubCategory = this.formbulider.group({
      subCategoryId: [null, [Validators.required]],
      subCategoryName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmMaintenaceSubCategory.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmMaintenaceSubCategory.reset();
    this.frmMaintenaceSubCategory.enable();
    this.frmMaintenaceSubCategory.controls.subCategoryId.disable();
    this.frmMaintenaceSubCategory.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.subCategoryName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmMaintenaceSubCategory.controls.subCategoryId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.subCategoryId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcMaintSubCategory.getSubCategories().subscribe(r => {
        this.svcSearchDlg.open("Search & Select  Maintenace Sub Category", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.subCategoryId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmMaintenaceSubCategory.enable();
    this.frmMaintenaceSubCategory.controls.subCategoryId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.subCategoryName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmMaintenaceSubCategory.markAllAsTouched();
      if (!this.frmMaintenaceSubCategory.invalid) {
        this.svcWaitDlg.open({});
        var formData: MaintenaceSubcategory = this.frmMaintenaceSubCategory.getRawValue();
        formData.footer = this.footer;
        this.svcMaintSubCategory.save(formData).subscribe(
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
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcMaintSubCategory.get(Id).subscribe(
        maintenacesubcategory => {
          if (maintenacesubcategory) {
            this.frmMaintenaceSubCategory.disable();
            this.frmMaintenaceSubCategory.controls['subCategoryId'].setValue(maintenacesubcategory.subCategoryId);
            this.frmMaintenaceSubCategory.controls['subCategoryName'].setValue(maintenacesubcategory.subCategoryName);
            this.frmMaintenaceSubCategory.controls['isActive'].setValue(maintenacesubcategory.isActive); 
            this.footer = maintenacesubcategory.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private initForm() {
    this.frmMaintenaceSubCategory.reset();    
    this.frmMaintenaceSubCategory.disable();
  }
  //#endregion local functions
}
