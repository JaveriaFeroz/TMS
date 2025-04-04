import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { UserBranch } from './userbranch';
import { UserCity } from './usercity';
import { UserCompany } from './usercompany';
import { UserManagementService } from './usermanagement.service';
import { UserOption } from './useroption';
import { UserProfile } from './userprofile';
import { UserRole } from './userrole';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styleUrls: ['./usermanagement.component.css']
})

export class UserManagementComponent implements OnInit {
  public goOptions: GridOptions;
  public goBranch: GridOptions;
  public goRole: GridOptions;
  public goCity: GridOptions;
  public goCompany: GridOptions;

  //#region constant variables
  readonly optionName: string = 'User Management';
  readonly colSearch =
    [
      { headerName: 'UserId', field: 'userId', width: 120 },
      { headerName: 'Name', field: 'userName' },
      { headerName: 'Branch', field: 'branchName' },
      { headerName: 'Department', field: 'departmentName' },
    ];

  colOption = [
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
          cellEditor: agGridHelper.getCellCheckBox()
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
          cellEditor: agGridHelper.getCellCheckBox()
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
          cellEditor: agGridHelper.getCellCheckBox()
        }
      ]
    }
   
  ];

  colBranch = [
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
          cellEditor: agGridHelper.getCellCheckBox()
        },
        { headerName: "Branch Name", field: "branchName", width: 250 }
      ]
    }   
  ];

  colRole = [
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
          cellEditor: agGridHelper.getCellCheckBox()
        },
        {
          headerName: "Role Name", field: "roleName", editable: false, width: 250
        }
      ]
    }    
  ];

  colCity = [
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
      cellEditor: agGridHelper.getCellCheckBox()
    },
    {
      headerName: "City Name", field: "cityName", editable: false, width: 250
    }
  ];

  colCompany = [
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
          cellEditor: agGridHelper.getCellCheckBox()
        },
        {
          headerName: "Company Name", field: "companyName", editable: false, width: 250
        }
      ]
    }    
  ];
  //#endregion
  frmUserMgmt: any;
  optionData: UserOption[];
  branchData: UserBranch[];
  roleData: UserRole[];
  cityData: UserCity[];
  companyData: UserCompany[];
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('userId', { static: true }) userId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcUserManagement: UserManagementService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
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
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridStatus(false);
  }
  //#region toolbar functions
  tbRecall() {
    this.initForm();
    this.frmUserMgmt.controls.userId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.userId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcUserManagement.getUsers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select  User Management", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.userId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  } 

  tbEdit() {
    this.frmUserMgmt.enable();
    this.frmUserMgmt.controls.userId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridStatus(true);
    //this.frmUserMgmt.controls.UserName.disable();
    //this.frmUserMgmt.controls.BranchName.disable();
    //this.frmUserMgmt.controls.DepartmentName.disable();
    //this.frmUserMgmt.controls.Email.disable();
    //this.frmUserMgmt.controls.IsActive.disable();
  }

  tbSave() {
    try {
      if (!this.frmUserMgmt.invalid) {
        var formData: UserProfile = this.frmUserMgmt.getRawValue();
        formData.options = this.getOptionsFromGrid();
        formData.branches = this.getBranchesFromGrid();
        formData.roles = this.getRolesFromGrid();
        formData.cities = this.getCitiesFromGrid();
        formData.companies = this.getCompaniesFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        this.svcWaitDlg.open({});
        this.svcUserManagement.save(formData).subscribe(
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
    this.goOptions = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

    this.goBranch = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

    this.goCity = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

    this.goRole = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

    this.goCompany = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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
  get(Id: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcUserManagement.get(Id).subscribe(
        up => {
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
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private validate(up: UserProfile) {
    this.errors = [];
    if (up.options.some(x => !x.allowed && (x.allowAdd || x.allowEdit))) {
      this.errors.push('Please put check on Allow access when you request Allow Add or Allow Edit else remove check from Allow Add / Edit where Allow access is not turned on');
    }
  }

  private initForm() {
    this.frmUserMgmt.reset();  
    this.frmUserMgmt.disable();
    agFormHelper.setGridStatus(false);
    this.errors = [];
    //this.setGridData(null);
    this.optionData = [];
    this.branchData= [];
    this.roleData = [];
    this.cityData = [];
    this.companyData = [];
    this.footer = new agFooter();
  }
}
