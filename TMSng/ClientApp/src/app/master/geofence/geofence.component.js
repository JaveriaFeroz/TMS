"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoFenceComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let GeoFenceComponent = class GeoFenceComponent {
    constructor(router, formbulider, svcGeoFence, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcGeoFence = svcGeoFence;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'Geo Fence';
        this.colSearch = [
            { headerName: 'Fence Id', field: 'fenceId', width: 70 },
            { headerName: 'Fence Name', field: 'fenceName' },
            { headerName: 'City Name', field: 'cityName' },
            { headerName: 'IsActive', field: 'isActive', width: 70 },
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colFenceClientEmail = [
            {
                headerName: 'Client Email',
                children: [
                    {
                        headerName: "Client", field: "clientId",
                        cellEditor: agGridHelper_1.agGridHelper.getAgilitySelect(),
                        cellEditorParams: { source: 'Client', class: "200" },
                        valueFormatter: agGridHelper_1.agGridHelper.getClientName, width: 200
                    },
                    {
                        headerName: "EmailTo", field: "emailTo", cellEditor: "agLargeTextCellEditor", width: 220
                    },
                    {
                        headerName: "EmailCC", field: "emailCC", cellEditor: "agLargeTextCellEditor", width: 220
                    },
                    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
                    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
                ]
            }
        ];
        /*    sessionStorage.removeItem("lstClient");*/
        this.loadLookup();
        this.initGrid();
    }
    ngOnInit() {
        this.frmGeoFence = this.formbulider.group({
            fenceId: [null, [forms_1.Validators.required]],
            fenceName: [null, [forms_1.Validators.required]],
            cityId: [null, [forms_1.Validators.required]],
            longitude: [null, [forms_1.Validators.required]],
            latitude: [null, [forms_1.Validators.required]],
            radius: [null, [forms_1.Validators.required]],
            isActive: [null],
        });
        this.frmGeoFence.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmGeoFence.reset();
        this.frmGeoFence.enable();
        this.frmGeoFence.controls.fenceId.disable();
        this.frmGeoFence.patchValue({ isActive: true });
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
    }
    tbRecall() {
        this.initForm();
        this.frmGeoFence.controls.fenceId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.fenceId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcGeoFence.getFences().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Geo Fence", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.fenceId);
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
        this.frmGeoFence.enable();
        this.frmGeoFence.controls.fenceId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridToolbar(true);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        this.fenceName.focus();
    }
    tbSave() {
        try {
            this.frmGeoFence.markAllAsTouched();
            if (!this.frmGeoFence.invalid) {
                var formData = this.frmGeoFence.getRawValue();
                formData.details = this.getDetailFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                else {
                    this.svcWaitDlg.open({});
                    this.svcGeoFence.save(formData).subscribe(() => {
                        this.initForm();
                        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                        this.svcToaster.showSuccess('Record saved Successfully');
                    }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                }
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
        sessionStorage.removeItem("lstClient");
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region grid setup
    //#region GEO Fence Grid Definition & functions
    initGrid() {
        this.goFenceClientEmail = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                sortable: true
            },
            rowSelection: 'single',
            onCellValueChanged: function (params) {
                if (!params.data.add)
                    params.data.edit = true;
                if (params.colDef.field == "clientId") {
                    if (params.data.clientId != "") {
                        params.node.setDataValue("clientId", parseInt(params.data.clientId));
                    }
                    else {
                        params.node.setDataValue("clientId", null);
                    }
                }
            }
        };
    }
    onAddLine() {
        try {
            var res = this.goFenceClientEmail.api.applyTransaction({
                add: [{
                        clientId: null, emailTo: null, emailCC: null, add: true, edit: false, delete: false
                    }]
            });
            this.goFenceClientEmail.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "clientId" });
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, 'Add Line: ');
        }
    }
    ;
    onDeleteLine() {
        try {
            if (this.goFenceClientEmail.api.getSelectedRows().length > 0) {
                if (confirm("Are you sure you want to Delete selected row?")) {
                    this.goFenceClientEmail.api.getSelectedRows().forEach(x => x.delete = true);
                    //this.goFenceClientEmail.api.getFilterInstance('delete').onFilterChanged();
                    agGridHelper_1.agGridHelper.setGridDeleteFilter(this.goFenceClientEmail.api);
                }
                //agGridHelper.setGridDeleteFilter(this.goFenceClientEmail.api);
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
        this.goFenceClientEmail.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcGeoFence.get(Id).subscribe(fence => {
                if (fence) {
                    this.frmGeoFence.disable();
                    this.frmGeoFence.controls['fenceId'].setValue(fence.fenceId);
                    this.frmGeoFence.controls['fenceName'].setValue(fence.fenceName);
                    this.frmGeoFence.controls['cityId'].setValue(fence.cityId);
                    this.frmGeoFence.controls['latitude'].setValue(fence.latitude);
                    this.frmGeoFence.controls['longitude'].setValue(fence.longitude);
                    this.frmGeoFence.controls['radius'].setValue(fence.radius);
                    this.frmGeoFence.controls['isActive'].setValue(fence.isActive);
                    this.fenceClientEmailData = fence.details;
                    this.footer = fence.footer;
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
            this.svcGeoFence.getLookup().subscribe(data => {
                this.lstCity = data.lstCity;
                sessionStorage.setItem("lstClient", JSON.stringify(data.lstClient));
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(gf) {
        this.errors = [];
        let reEmail = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$');
        if (Object.keys(gf.details.filter(x => !x.delete)).length == 0) {
            this.errors.push('Atleast one entry must exist in Geo Fence Transaction to perform save operation');
        }
        else if (gf.details.some(x => !x.delete && x.clientId == null)) {
            this.errors.push('No row can have empty Geo Fence');
        }
        if (gf.details.some(x => !x.delete && x.emailCC == null)) {
            this.errors.push('Please Enter EmailCC');
        }
        else if (gf.details.some(x => !x.delete && x.emailTo == null)) {
            this.errors.push('Please Enter EmailTo ');
        }
        else if (gf.details.some(x => !x.delete && !reEmail.test(x.emailCC))) {
            this.errors.push('Email CC must be defined in proper format like someone@someone.com');
        }
        else if (gf.details.some(x => !x.delete && !reEmail.test(x.emailTo))) {
            this.errors.push('Email To must be defined in proper format like someone@someone.com');
        }
        if (Object.keys(gf.details.filter(x => !x.delete)).length != 0) {
            var valueArr = gf.details.filter(x => !x.delete).map(function (item) { return item.clientId; }).slice().sort();
            for (var i = 0; i < valueArr.length - 1; i++) {
                if (valueArr[i + 1] === valueArr[i]) {
                    this.errors.push('Client must be unique!');
                    i = valueArr.length;
                }
            }
        }
    }
    initForm() {
        this.frmGeoFence.reset();
        this.frmGeoFence.disable();
        this.errors = [];
        this.fenceClientEmailData = [];
        agFormHelper_1.agFormHelper.setGridToolbar(false);
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('fenceName', { static: true })
], GeoFenceComponent.prototype, "fenceName", void 0);
__decorate([
    core_1.ViewChild('fenceId', { static: true })
], GeoFenceComponent.prototype, "fenceId", void 0);
GeoFenceComponent = __decorate([
    core_1.Component({
        selector: 'app-geofence',
        templateUrl: './geofence.component.html',
        styleUrls: ['./geofence.component.css']
    })
], GeoFenceComponent);
exports.GeoFenceComponent = GeoFenceComponent;
//# sourceMappingURL=geofence.component.js.map