"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenaceSubCategoryComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const footer_1 = require("../../helper/footer");
let MaintenaceSubCategoryComponent = class MaintenaceSubCategoryComponent {
    constructor(router, formbulider, svcMaintSubCategory, svcToaster, helper, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcMaintSubCategory = svcMaintSubCategory;
        this.svcToaster = svcToaster;
        this.helper = helper;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Maintenance Sub Category';
        this.colSearch = [
            { headerName: 'Category Id', field: 'subCategoryId', width: 70 },
            { headerName: 'Sub Category Name', field: 'subCategoryName', },
            { headerName: 'Is Active', field: 'isActive', width: 70 },
        ];
        this.footer = new footer_1.agFooter();
    }
    ngOnInit() {
        this.frmMaintenaceSubCategory = this.formbulider.group({
            subCategoryId: [null, [forms_1.Validators.required]],
            subCategoryName: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmMaintenaceSubCategory.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmMaintenaceSubCategory.reset();
        this.frmMaintenaceSubCategory.enable();
        this.frmMaintenaceSubCategory.controls.subCategoryId.disable();
        this.frmMaintenaceSubCategory.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.subCategoryName.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmMaintenaceSubCategory.controls.subCategoryId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.subCategoryId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcMaintSubCategory.getSubCategories().subscribe(r => {
                this.svcSearchDlg.open("Search & Select  Maintenace Sub Category", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.subCategoryId);
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
        this.frmMaintenaceSubCategory.enable();
        this.frmMaintenaceSubCategory.controls.subCategoryId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        this.subCategoryName.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmMaintenaceSubCategory.markAllAsTouched();
            if (!this.frmMaintenaceSubCategory.invalid) {
                this.svcWaitDlg.open({});
                var formData = this.frmMaintenaceSubCategory.getRawValue();
                formData.footer = this.footer;
                this.svcMaintSubCategory.save(formData).subscribe(() => {
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
            this.svcMaintSubCategory.get(Id).subscribe(maintenacesubcategory => {
                if (maintenacesubcategory) {
                    this.frmMaintenaceSubCategory.disable();
                    this.frmMaintenaceSubCategory.controls['subCategoryId'].setValue(maintenacesubcategory.subCategoryId);
                    this.frmMaintenaceSubCategory.controls['subCategoryName'].setValue(maintenacesubcategory.subCategoryName);
                    this.frmMaintenaceSubCategory.controls['isActive'].setValue(maintenacesubcategory.isActive);
                    this.footer = maintenacesubcategory.footer;
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
    initForm() {
        this.frmMaintenaceSubCategory.reset();
        this.frmMaintenaceSubCategory.disable();
    }
};
__decorate([
    core_1.ViewChild('subCategoryName', { static: true })
], MaintenaceSubCategoryComponent.prototype, "subCategoryName", void 0);
__decorate([
    core_1.ViewChild('subCategoryId', { static: true })
], MaintenaceSubCategoryComponent.prototype, "subCategoryId", void 0);
MaintenaceSubCategoryComponent = __decorate([
    core_1.Component({
        selector: 'app-maintenacesubcategory',
        templateUrl: './maintenacesubcategory.component.html',
        styleUrls: ['./maintenacesubcategory.component.css']
    })
], MaintenaceSubCategoryComponent);
exports.MaintenaceSubCategoryComponent = MaintenaceSubCategoryComponent;
//# sourceMappingURL=maintenacesubcategory.component.js.map