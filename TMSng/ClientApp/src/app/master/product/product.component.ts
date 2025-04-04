import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Product } from './product';
import { ProductService } from './product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Product';
  readonly colSearch =
    [
      { headerName: 'Product Id', field: 'productId', width: 70 },
      { headerName: 'Product Name', field: 'productName', },
      { headerName: 'Purchase Price', field: 'purchasePrice' },
      { headerName: 'UoM', field: 'uomName' }, 
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmProduct: any;
  //lstProductNature: any;
  lstProductType: any;
  //lstUOM: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('productType', { static: true }) productType: ElementRef;
  @ViewChild('productId', { static: true }) productId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcProduct: ProductService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmProduct = this.formbulider.group({
      productId: [null, [Validators.required]],
      productName: [null, [Validators.required]],
      productTypeId: [null, [Validators.required]],
      uoMName: [null],
      productNatureName: [null],
      purchasePrice: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmProduct.disable();    
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbRecall() {
    this.initForm();
    this.frmProduct.controls.productId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.productId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcProduct.getProducts().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Product", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.productId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmProduct.enable();
    this.frmProduct.controls.productId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmProduct.controls.productName.disable();
    this.frmProduct.controls.productNatureName.disable();
    this.frmProduct.controls.uoMName.disable();
    //this.frmProduct.controls.UoMId.disable();
    //this.frmProduct.controls.ProductNatureId.disable();
    this.frmProduct.controls.purchasePrice.disable();
    this.frmProduct.controls.isActive.disable();
    //this.productType.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmProduct.markAllAsTouched();
      if (!this.frmProduct.invalid) {
        this.svcWaitDlg.open({});
        var formData: Product = this.frmProduct.getRawValue();
        formData.footer = this.footer;
        this.svcProduct.save(formData).subscribe(
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
      this.svcProduct.get(Id).subscribe(
        product => {
          if (product) {
            this.frmProduct.disable();
            this.frmProduct.controls['productId'].setValue(product.productId);
            this.frmProduct.controls['productName'].setValue(product.productName);
            //this.frmProduct.controls['UoMId'].setValue(product.uoMId);
            //this.frmProduct.controls['ProductNatureId'].setValue(product.productNatureId);
            this.frmProduct.controls['productTypeId'].setValue(product.productTypeId);
            this.frmProduct.controls['purchasePrice'].setValue(product.purchasePrice);
            this.frmProduct.controls['uoMName'].setValue(product.uoMName);
            this.frmProduct.controls['productNatureName'].setValue(product.productNatureName);
            this.frmProduct.controls['isActive'].setValue(product.isActive);  
            this.footer = product.footer;
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
      this.svcProduct.getLookup().subscribe(
        data => {
          this.lstProductType = data.lstProductType;
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
    this.frmProduct.reset();    
    this.frmProduct.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
