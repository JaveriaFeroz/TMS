import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ProductType } from './producttype';
import { ProductTypeService } from './producttype.service';

@Component({
  selector: 'app-producttype',
  templateUrl: './producttype.component.html',
  styleUrls: ['./producttype.component.css']
})

export class ProductTypeComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Product Type';
  readonly colSearch =
    [
      { headerName: 'Type Id', field: 'typeId', width: 70 },
      { headerName: 'Type Name', field: 'typeName', },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmProductType: any;
  footer: agFooter = new agFooter();
  @ViewChild('productTypeName', { static: true }) productTypeName: ElementRef;
  @ViewChild('productTypeId', { static: true }) productTypeId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcProductType: ProductTypeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmProductType = this.formbulider.group({
      typeId: [null, [Validators.required]],
      typeName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmProductType.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmProductType.reset();
    this.frmProductType.enable();
    this.frmProductType.controls.typeId.disable();
    this.frmProductType.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.productTypeName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmProductType.controls.typeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.productTypeId.nativeElement.focus();
  }  

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcProductType.getProductTypes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Product Type", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.typeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmProductType.enable();
    this.frmProductType.controls.typeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.productTypeName.nativeElement.focus();
  }

  tbSave() {
    this.frmProductType.markAllAsTouched();
    if (!this.frmProductType.invalid) {
      this.svcWaitDlg.open({});
      var formData: ProductType = this.frmProductType.getRawValue();
      formData.footer = this.footer;
      this.svcProductType.save(formData).subscribe(
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
      this.svcProductType.get(Id).subscribe(
        producttype => {
          if (producttype) {
            this.frmProductType.disable();
            this.frmProductType.controls['typeId'].setValue(producttype.typeId);
            this.frmProductType.controls['typeName'].setValue(producttype.typeName);
            this.frmProductType.controls['isActive'].setValue(producttype.isActive);  
            this.footer = producttype.footer;
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
    this.frmProductType.reset();
    this.frmProductType.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
