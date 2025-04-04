"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let AssetComponent = class AssetComponent {
    constructor(router, formbulider, svcAsset, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcAsset = svcAsset;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Asset';
        this.colSearch = [
            { headerName: 'Asset Id', field: 'assetId', width: 70 },
            { headerName: 'Asset #', field: 'assetNo' },
            { headerName: 'Asset Type', field: 'assetTypeName' },
            { headerName: 'Active ?', field: 'isActive' },
        ];
        this.errors = [];
        this.MinDate = new Date(new Date().getDate() - 5475);
        this.MaxDate = new Date();
        this.footer = new footer_1.agFooter();
        this.colTyre = [
            {
                headerName: 'Asset Tyre',
                children: [
                    { headerName: "Serial #", field: "serialNo", width: 100 },
                    { headerName: "Make", field: "make", width: 100 },
                    {
                        headerName: "Start KMs", field: "startKMs", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers,
                        valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 80,
                    },
                    {
                        headerName: 'Active', field: 'isActive', width: 70, editable: false,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmAsset = this.formbulider.group({
            assetId: [null, [forms_1.Validators.required]],
            assetNo: [null, [forms_1.Validators.required]],
            assetTypeId: [null, [forms_1.Validators.required]],
            capacityId: [null, [forms_1.Validators.required]],
            makeId: [null, [forms_1.Validators.required]],
            model: [null, [forms_1.Validators.required]],
            purchaseDate: [null, [forms_1.Validators.required]],
            leaseTypeId: [null, [forms_1.Validators.required]],
            supplierId: [null],
            startKMs: [null],
            kMs: [null],
            statusId: [null, [forms_1.Validators.required]],
            driverId1: [null],
            driverId2: [null],
            trailerId: [null],
            faCode: [null],
            cityId: [null, [forms_1.Validators.required]],
            clientId: [null],
            baseId: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmAsset.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmAsset.reset();
        this.frmAsset.enable();
        this.frmAsset.controls.assetId.disable();
        this.frmAsset.patchValue({ isActive: true, startKMs: 0, kMs: 0 });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.assetNo.nativeElement.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmAsset.controls.assetId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.assetId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcAsset.getAssets().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Asset", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.assetId);
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
        this.frmAsset.enable();
        this.frmAsset.controls.assetNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.assetNo.nativeElement.focus();
    }
    tbSave() {
        try {
            this.frmAsset.markAllAsTouched();
            if (!this.frmAsset.invalid) {
                var formData = this.frmAsset.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcAsset.save(formData).subscribe(() => {
                        this.svcToaster.showSuccess('Record saved Successfully');
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                    }, error => {
                        this.svcToaster.showFailure(error.message);
                    }, () => {
                        this.svcWaitDlg.close();
                    });
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e.message);
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
    //#region grid setup
    initGrid() {
        this.goTyre = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true
            },
            rowSelection: 'single',
            onCellClicked: function (event) {
                if (event.colDef.field == "isActive") {
                    if (!event.data.allowAccess) {
                        event.node.setDataValue('isActive', true);
                    }
                    else {
                        event.node.setDataValue('isActive', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
            }
        };
    }
    onAddLine() {
        try {
            var res = this.goTyre.api.applyTransaction({
                add: [{ clientId: null, add: true, edit: false, delete: false }]
            });
            this.goTyre.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "serialNo" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goTyre.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goTyre.api.getSelectedRows().forEach(x => x.delete = true);
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goTyre.api);
                }
                //agGridHelper.setGridDeleteFilter(this.goTyre.api);
            }
            else
                this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
        }
        catch (exception) {
            this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
        }
    }
    ;
    getDetailFromGrid() {
        let rowData = [];
        this.goTyre.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcAsset.get(Id).subscribe(asset => {
                if (asset) {
                    this.frmAsset.disable();
                    this.frmAsset.controls['assetId'].setValue(asset.assetId);
                    this.frmAsset.controls['assetNo'].setValue(asset.assetNo);
                    this.frmAsset.controls['assetTypeId'].setValue(asset.assetTypeId);
                    this.frmAsset.controls['capacityId'].setValue(asset.capacityId);
                    this.frmAsset.controls['makeId'].setValue(asset.makeId);
                    this.frmAsset.controls['model'].setValue(asset.model);
                    this.frmAsset.controls['purchaseDate'].setValue(asset.purchaseDate);
                    this.frmAsset.controls['leaseTypeId'].setValue(asset.leaseTypeId);
                    this.frmAsset.controls['supplierId'].setValue(asset.supplierId);
                    this.frmAsset.controls['startKMs'].setValue(asset.startKMs);
                    this.frmAsset.controls['statusId'].setValue(asset.statusId);
                    this.frmAsset.controls['kMs'].setValue(asset.kMs);
                    this.frmAsset.controls['driverId1'].setValue(asset.driverId1);
                    this.frmAsset.controls['driverId2'].setValue(asset.driverId2);
                    this.frmAsset.controls['trailerId'].setValue(asset.trailerId);
                    this.frmAsset.controls['faCode'].setValue(asset.faCode);
                    this.frmAsset.controls['clientId'].setValue(asset.clientId);
                    this.frmAsset.controls['cityId'].setValue(asset.cityId);
                    this.frmAsset.controls['baseId'].setValue(asset.baseId);
                    this.frmAsset.controls['isActive'].setValue(asset.isActive);
                    this.tyresData = asset.details;
                    this.footer = asset.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridToolbar(false);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
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
            this.svcAsset.getLookup().subscribe(data => {
                this.lstAssetType = data.lstAssetType;
                this.lstStatus = data.lstAssetStatus;
                this.lstCity = data.lstCity;
                this.lstBranch = data.lstBranch;
                this.lstTrailor = data.lstTrailor;
                this.lstClient = data.lstClient;
                this.lstLeaseType = data.lstLeaseType;
                this.lstDriver = data.lstDriver;
                this.lstCapacity = data.lstCapacity;
                this.lstMake = data.lstMake;
                this.lstSupplier = data.lstSupplier;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(ast) {
        this.errors = [];
        if (!ast.purchaseDate) {
            this.errors.push('Please select Purchase Date');
        }
        if (ast.assetTypeId == 1) {
            if (!ast.driverId1) {
                this.errors.push('Please select Driver1');
            }
            if (!ast.driverId2) {
                this.errors.push('Please select Driver2');
            }
            if (!ast.trailerId) {
                this.errors.push('Please select Trailor');
            }
            if (ast.driverId1 == ast.driverId2) {
                this.errors.push('Driver 1 & Driver 2 Must Be Different');
            }
        }
        if (ast.assetTypeId == 2) {
            if (ast.driverId1) {
                this.errors.push('No Driver 1 Required for Trailer');
            }
            if (ast.driverId2) {
                this.errors.push('No Driver 2 Required for Trailer');
            }
            if (ast.trailerId != null) {
                this.errors.push('No Trailer Required');
            }
        }
        if (ast.leaseTypeId != 2 && ast.supplierId == null) {
            this.errors.push('Please select valid Supplier before hitting save button');
        }
        if (ast.leaseTypeId == 2 && ast.supplierId) {
            this.errors.push('Supplier cannot be assigned for owned vehicles');
        }
    }
    initForm() {
        this.frmAsset.reset();
        this.frmAsset.disable();
        this.errors = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.tyresData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('assetNo', { static: true })
], AssetComponent.prototype, "assetNo", void 0);
__decorate([
    core_1.ViewChild('assetId', { static: true })
], AssetComponent.prototype, "assetId", void 0);
AssetComponent = __decorate([
    core_1.Component({
        selector: 'app-asset',
        templateUrl: './asset.component.html',
        styleUrls: ['./asset.component.css']
    })
], AssetComponent);
exports.AssetComponent = AssetComponent;
//# sourceMappingURL=asset.component.js.map