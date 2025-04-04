"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let ProductComponent = class ProductComponent {
    constructor(router, formbulider, svcProduct, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcProduct = svcProduct;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Product';
        this.colSearch = [
            { headerName: 'Product Id', field: 'productId', width: 70 },
            { headerName: 'Product Name', field: 'productName', },
            { headerName: 'Purchase Price', field: 'purchasePrice' },
            { headerName: 'UoM', field: 'uomName' },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        //lstUOM: any;
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmProduct = this.formbulider.group({
            productId: [null, [forms_1.Validators.required]],
            productName: [null, [forms_1.Validators.required]],
            productTypeId: [null, [forms_1.Validators.required]],
            uoMName: [null],
            productNatureName: [null],
            purchasePrice: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmProduct.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmProduct.controls.productId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.productId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcProduct.getProducts().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Product", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.productId);
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
        this.frmProduct.enable();
        this.frmProduct.controls.productId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
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
                var formData = this.frmProduct.getRawValue();
                formData.footer = this.footer;
                this.svcProduct.save(formData).subscribe(() => {
                    this.initForm();
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    this.svcToaster.showSuccess('Record saved Successfully');
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
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
            this.svcProduct.get(Id).subscribe(product => {
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
            this.svcProduct.getLookup().subscribe(data => {
                this.lstProductType = data.lstProductType;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initForm() {
        this.frmProduct.reset();
        this.frmProduct.disable();
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('productType', { static: true })
], ProductComponent.prototype, "productType", void 0);
__decorate([
    core_1.ViewChild('productId', { static: true })
], ProductComponent.prototype, "productId", void 0);
ProductComponent = __decorate([
    core_1.Component({
        selector: 'app-product',
        templateUrl: './product.component.html',
        styleUrls: ['./product.component.css']
    })
], ProductComponent);
exports.ProductComponent = ProductComponent;
//# sourceMappingURL=product.component.js.map