import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Supplier } from './supplier';
import { SupplierService } from './supplier.service';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})

export class SupplierComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Supplier';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'supplierId', width: 70 },
      { headerName: 'Supplier Name', field: 'supplierName', },
      { headerName: 'Supplier Type', field: 'supplierTypeName' },
      { headerName: 'City', field: 'cityName' }, 
    ];
  //#endregion
  frmSupplier: any;
  lstCity: any;
  lstSupplierType: any;
  enableGLEntries: any;
  footer: agFooter = new agFooter();
  errors: string[] = [];
  @ViewChild('supplierName', { static: true }) supplierName: ElementRef;
  @ViewChild('supplierId', { static: true }) supplierId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcSupplier: SupplierService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.enableGLEntries = agFormHelper.enableGL();
  }

  ngOnInit() {
    this.frmSupplier = this.formbulider.group({
      supplierId: [null, [Validators.required]],
      supplierName: [null, [Validators.required]],
      supplierTypeId: [null, [Validators.required]],
      controlSupplierId: [null],
      scRate: [null, [Validators.required]],
      address: [null, [Validators.required]],
      email: [null],
      cityId: [null],
      phoneNo: [null],
      mobileNo: [null],
      faxNo: [null],
      ntn: [null],
      url: [null],
      contactName: [null], 
      isActive: [null],
      enableGLEntries: [null]
    });
    this.frmSupplier.disable();
    this.loadLookup();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.frmSupplier.patchValue({ enableGLEntries: this.enableGLEntries });
  }

  //#region toolbar functions
  tbAdd() {
    this.frmSupplier.reset();
    this.frmSupplier.enable();
    this.frmSupplier.controls.supplierId.disable();
    this.frmSupplier.patchValue({ isActive: true, enableGLEntries: this.enableGLEntries });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.supplierName.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmSupplier.controls.supplierId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.supplierId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcSupplier.getSuppliers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Supplier", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.supplierId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmSupplier.enable();
    this.frmSupplier.controls.supplierId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    if (!this.enableGLEntries) {
      this.frmSupplier.controls.supplierName.disable();
      this.frmSupplier.controls.address.disable();
      this.frmSupplier.controls.isActive.disable();
      this.frmSupplier.controls.email.disable();
    }
    else
      this.supplierName.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmSupplier.markAllAsTouched();
      if (!this.frmSupplier.invalid) {
        var formData: Supplier = this.frmSupplier.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcSupplier.save(formData).subscribe(
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
      this.svcSupplier.get(Id).subscribe(
        supplier => {
          if (supplier) {
            this.frmSupplier.disable();
            this.frmSupplier.controls['supplierId'].setValue(supplier.supplierId);
            this.frmSupplier.controls['supplierName'].setValue(supplier.supplierName);
            this.frmSupplier.controls['supplierTypeId'].setValue(supplier.supplierTypeId);
            this.frmSupplier.controls['controlSupplierId'].setValue(supplier.controlSupplierId);
            this.frmSupplier.controls['scRate'].setValue(supplier.scRate);
            this.frmSupplier.controls['address'].setValue(supplier.address);
            this.frmSupplier.controls['email'].setValue(supplier.email);
            this.frmSupplier.controls['cityId'].setValue(supplier.cityId);
            this.frmSupplier.controls['phoneNo'].setValue(supplier.phoneNo);
            this.frmSupplier.controls['mobileNo'].setValue(supplier.mobileNo);
            this.frmSupplier.controls['faxNo'].setValue(supplier.faxNo);
            this.frmSupplier.controls['ntn'].setValue(supplier.ntn);
            this.frmSupplier.controls['url'].setValue(supplier.url);
            this.frmSupplier.controls['contactName'].setValue(supplier.contactName);
            this.frmSupplier.controls['isActive'].setValue(supplier.isActive);
            this.frmSupplier.controls['enableGLEntries'].setValue(this.enableGLEntries);
            this.footer = supplier.footer;
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
      this.svcSupplier.getLookup().subscribe(
        data => {
          this.lstCity = data.lstCity;
          this.lstSupplierType = data.lstSupplierType;
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

  private validate(s: Supplier) {
    this.errors = [];
    let reMobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
    let reEmail = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$');
    let reNTN = new RegExp('^[0-9]{7}-[0-9]{1}$');
    var rePhoneNo = new RegExp('^[0-9]{4}-[0-9]{6,7}$');

    if (s.controlSupplierId == null && !this.enableGLEntries) {
      this.errors.push('Control Supplier Id is required field');
    }
    if (s.mobileNo != '' && !reMobileNo.test(s.mobileNo)) {
      this.errors.push('Mobile # must be provided in valid format like xxxx-xxxxxxx');
    }
    if (s.phoneNo != '' && !rePhoneNo.test(s.phoneNo)) {
      this.errors.push('Phone # must be provided in valid format like xxxx-xxxxxxx');
    }
    if (s.email != '' && !reEmail.test(s.email)) {
      this.errors.push('Email must be provided in valid format like someone@somewhere.com');
    }
    if (s.ntn != '' && !reNTN.test(s.ntn)) {
      this.errors.push('NTN must be provided in valid format like xxxxxxx-x');
    }
  }

  private initForm() {
    this.frmSupplier.reset();
    this.frmSupplier.patchValue({ enableGLEntries: this.enableGLEntries });
    this.frmSupplier.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
