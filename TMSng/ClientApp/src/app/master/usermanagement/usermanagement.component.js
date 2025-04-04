"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementComponent = void 0;
const core_1 = require("@angular/core");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let UserManagementComponent = class UserManagementComponent {
    constructor(router, formbulider, svcUserManagement, svcToaster, svcWaitDlg, svcSearchDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcUserManagement = svcUserManagement;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        //#region constant variables
        this.optionName = 'User Management';
        this.colSearch = [
            { headerName: 'UserId', field: 'userId', width: 120 },
            { headerName: 'Name', field: 'userName' },
            { headerName: 'Branch', field: 'branchName' },
            { headerName: 'Department', field: 'departmentName' },
        ];
        this.colOption = [
            {
                headerName: 'User Options',
                children: [
                    {
                        headerName: 'S', field: 'allowed', width: 50, editable: false,
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
                    { headerName: "Option Name", field: "optionName", editable: false, width: 200 },
                    {
                        headerName: 'Add', field: 'allowAdd', width: 70, editable: false,
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
                    {
                        headerName: 'Edit', field: 'allowEdit', width: 70, editable: false,
                        cellRenderer: params => {
                            if (params.value) {
                                return "<input type='checkbox' checked />";
                            }
                            else {
                                return "<input type='checkbox'/>";
                            }
                        },
                        cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
                    }
                ]
            }
        ];
        this.colBranch = [
            {
                headerName: 'User Branchs',
                children: [
                    {
                        headerName: 'S', field: 'allowed', width: 70, editable: false,
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
                    { headerName: "Branch Name", field: "branchName", width: 250 }
                ]
            }
        ];
        this.colRole = [
            {
                headerName: 'User Roles',
                children: [
                    {
                        headerName: 'S', field: 'allowed', width: 70, editable: false,
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
                    {
                        headerName: "Role Name", field: "roleName", editable: false, width: 250
                    }
                ]
            }
        ];
        this.colCity = [
            {
                headerName: 'S', field: 'allowed', width: 70, editable: false,
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
            {
                headerName: "City Name", field: "cityName", editable: false, width: 250
            }
        ];
        this.colCompany = [
            {
                headerName: 'User Comapany',
                children: [
                    {
                        headerName: 'S', field: 'allowed', width: 70, editable: false,
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
                    {
                        headerName: "Company Name", field: "companyName", editable: false, width: 250
                    }
                ]
            }
        ];
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.initGrid();
    }
    ngOnInit() {
        this.frmUserMgmt = this.formbulider.group({
            userId: [null],
            isActive: [null],
            userName: [null],
            departmentName: [null],
            branchName: [null],
            email: [null],
        });
        this.frmUserMgmt.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        agFormHelper_1.agFormHelper.setGridStatus(false);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmUserMgmt.controls.userId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.userId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcUserManagement.getUsers().subscribe(r => {
                this.svcSearchDlg.open("Search & Select  User Management", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.userId);
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
        this.frmUserMgmt.enable();
        this.frmUserMgmt.controls.userId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        agFormHelper_1.agFormHelper.setGridStatus(true);
        //this.frmUserMgmt.controls.UserName.disable();
        //this.frmUserMgmt.controls.BranchName.disable();
        //this.frmUserMgmt.controls.DepartmentName.disable();
        //this.frmUserMgmt.controls.Email.disable();
        //this.frmUserMgmt.controls.IsActive.disable();
    }
    tbSave() {
        try {
            if (!this.frmUserMgmt.invalid) {
                var formData = this.frmUserMgmt.getRawValue();
                formData.options = this.getOptionsFromGrid();
                formData.branches = this.getBranchesFromGrid();
                formData.roles = this.getRolesFromGrid();
                formData.cities = this.getCitiesFromGrid();
                formData.companies = this.getCompaniesFromGrid();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                this.svcWaitDlg.open({});
                this.svcUserManagement.save(formData).subscribe(() => {
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
    //#region grid setup
    //#region User Option Grid Definition & functions  
    //}
    getOptionsFromGrid() {
        let rowData = [];
        this.goOptions.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion       
    //#region User Department Grid Definition & functions
    getBranchesFromGrid() {
        let rowData = [];
        this.goBranch.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion  
    //#region User Role Grid Definition & functions
    getRolesFromGrid() {
        let rowData = [];
        this.goRole.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region User City Grid Definition & functions
    getCitiesFromGrid() {
        let rowData = [];
        this.goCity.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    //#region User Company Grid Definition & functions
    getCompaniesFromGrid() {
        let rowData = [];
        this.goCompany.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    //#endregion
    initGrid() {
        this.goOptions = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true,
                filter: true
            },
            //columnDefs: this.colOption,
            //rowData: [],
            //rowSelection: 'multiple',
            //rowDeselection: true,
            //floatingFilter: true,
            onCellClicked: function (event) {
                if (event.colDef.field == "allowed") {
                    if (!event.data.allowed) {
                        event.node.setDataValue('allowed', true);
                    }
                    else {
                        event.node.setDataValue('allowed', false);
                    }
                }
                if (event.colDef.field == "allowAdd") {
                    if (!event.data.allowAdd) {
                        event.node.setDataValue('allowAdd', true);
                    }
                    else {
                        event.node.setDataValue('allowAdd', false);
                    }
                }
                if (event.colDef.field == "allowEdit") {
                    if (!event.data.allowEdit) {
                        event.node.setDataValue('allowEdit', true);
                    }
                    else {
                        event.node.setDataValue('allowEdit', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.goBranch = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true,
                filter: true
            },
            //columnDefs: this.colBranch,
            /*      rowData: [],*/
            //rowSelection: 'multiple',
            //rowDeselection: true,
            //floatingFilter: true,
            onCellClicked: function (event) {
                if (event.colDef.field == "allowed") {
                    if (!event.data.allowed) {
                        event.node.setDataValue('allowed', true);
                    }
                    else {
                        event.node.setDataValue('allowed', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.goCity = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true,
                filter: true
            },
            //columnDefs: this.colCity,
            /*      rowData: [],*/
            //rowSelection: 'multiple',
            //rowDeselection: true,
            //floatingFilter: true,
            onCellClicked: function (event) {
                if (event.colDef.field == "allowed") {
                    if (!event.data.allowed) {
                        event.node.setDataValue('allowed', true);
                    }
                    else {
                        event.node.setDataValue('allowed', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.goRole = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true,
                filter: true
            },
            //columnDefs: this.colRole,
            /*      rowData: [],*/
            //rowSelection: 'multiple',
            //rowDeselection: true,
            //floatingFilter: true,
            onCellClicked: function (event) {
                if (event.colDef.field == "allowed") {
                    if (!event.data.allowed) {
                        event.node.setDataValue('allowed', true);
                    }
                    else {
                        event.node.setDataValue('allowed', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.goCompany = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: agGridHelper_1.agGridHelper.allowEdit.bind(this),
                resizable: true,
                sortable: true,
                singleClickEdit: true,
                filter: true
            },
            //columnDefs: this.colCompany,
            /*      rowData: [],*/
            //rowSelection: 'multiple',
            //rowDeselection: true,
            //floatingFilter: true,
            onCellClicked: function (event) {
                if (event.colDef.field == "allowed") {
                    if (!event.data.allowed) {
                        event.node.setDataValue('allowed', true);
                    }
                    else {
                        event.node.setDataValue('allowed', false);
                    }
                }
            },
            onCellValueChanged: function (params) {
                params.data.edit = true;
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
    }
    //setGridData(up: UserProfile) {
    //  if (up != null) {
    //    this.goOptions.api.setRowData(up.options);
    //    this.goBranch.api.setRowData(up.branches);
    //    this.goRole.api.setRowData(up.roles);
    //    this.goCity.api.setRowData(up.cities);
    //    this.goCompany.api.setRowData(up.companies);
    //    agGridHelper.setGridDeleteFilter(this.goOptions.api);
    //    agGridHelper.setGridDeleteFilter(this.goBranch.api);
    //    agGridHelper.setGridDeleteFilter(this.goRole.api);
    //    agGridHelper.setGridDeleteFilter(this.goCity.api);
    //    agGridHelper.setGridDeleteFilter(this.goCompany.api);
    //  }
    //  else {
    //    this.goOptions.api.setRowData([]);
    //    this.goBranch.api.setRowData([]);
    //    this.goRole.api.setRowData([]);
    //    this.goCity.api.setRowData([]);
    //    this.goCompany.api.setRowData([]);
    //  }
    //}
    //#endregion
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcUserManagement.get(Id).subscribe(up => {
                if (up) {
                    this.frmUserMgmt.disable();
                    this.frmUserMgmt.controls['userId'].setValue(up.userId);
                    this.frmUserMgmt.controls['userName'].setValue(up.userName);
                    this.frmUserMgmt.controls['branchName'].setValue(up.branchName);
                    this.frmUserMgmt.controls['departmentName'].setValue(up.departmentName);
                    this.frmUserMgmt.controls['email'].setValue(up.email);
                    this.frmUserMgmt.controls['isActive'].setValue(up.isActive);
                    this.footer = up.footer;
                    this.optionData = up.options;
                    this.branchData = up.branches;
                    this.roleData = up.roles;
                    this.cityData = up.cities;
                    this.companyData = up.companies;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    agFormHelper_1.agFormHelper.setGridStatus(false);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    validate(up) {
        this.errors = [];
        if (up.options.some(x => !x.allowed && (x.allowAdd || x.allowEdit))) {
            this.errors.push('Please put check on Allow access when you request Allow Add or Allow Edit else remove check from Allow Add / Edit where Allow access is not turned on');
        }
    }
    initForm() {
        this.frmUserMgmt.reset();
        this.frmUserMgmt.disable();
        agFormHelper_1.agFormHelper.setGridStatus(false);
        this.errors = [];
        //this.setGridData(null);
        this.optionData = [];
        this.branchData = [];
        this.roleData = [];
        this.cityData = [];
        this.companyData = [];
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('userId', { static: true })
], UserManagementComponent.prototype, "userId", void 0);
UserManagementComponent = __decorate([
    core_1.Component({
        selector: 'app-usermanagement',
        templateUrl: './usermanagement.component.html',
        styleUrls: ['./usermanagement.component.css']
    })
], UserManagementComponent);
exports.UserManagementComponent = UserManagementComponent;
//# sourceMappingURL=usermanagement.component.js.map