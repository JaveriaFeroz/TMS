import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { GeoFence } from './geofence';
import { GeoFenceService } from './geofence.service';
import { GeoFenceEmail } from './geofenceemail';

@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.css']
})

export class GeoFenceComponent implements OnInit {
  //public GeoFences: GeoFence;
  public goFenceClientEmail: GridOptions;
  //#region constant variables
  readonly optionName: string = 'Geo Fence';
  readonly colSearch =
    [
      { headerName: 'Fence Id', field: 'fenceId', width: 70  },
      { headerName: 'Fence Name', field: 'fenceName' },
      { headerName: 'City Name', field: 'cityName' },
      { headerName: 'IsActive', field: 'isActive', width: 70 },
    ];
  //#endregion
  frmGeoFence: any;
  fenceClientEmailData: GeoFenceEmail[];
  lstCity: any;
  lstClient: any;
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  @ViewChild('fenceName', { static: true }) fenceName: MatSelect;
  @ViewChild('fenceId', { static: true }) fenceId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcGeoFence: GeoFenceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
/*    sessionStorage.removeItem("lstClient");*/
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmGeoFence = this.formbulider.group({
      fenceId: [null, [Validators.required]],
      fenceName: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      longitude: [null, [Validators.required]],
      latitude: [null, [Validators.required]],
      radius: [null, [Validators.required]],
      isActive: [null],

    });
    this.frmGeoFence.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }
  //#region toolbar functions
  tbAdd() {
    this.frmGeoFence.reset();
    this.frmGeoFence.enable();
    this.frmGeoFence.controls.fenceId.disable();
    this.frmGeoFence.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmGeoFence.controls.fenceId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.fenceId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcGeoFence.getFences().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Geo Fence", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.fenceId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmGeoFence.enable();
    this.frmGeoFence.controls.fenceId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.fenceName.focus();
  }

  tbSave() {
    try {
      this.frmGeoFence.markAllAsTouched();

      if (!this.frmGeoFence.invalid) {
        var formData: GeoFence = this.frmGeoFence.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcGeoFence.save(formData).subscribe(
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
    sessionStorage.removeItem("lstClient");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region GEO Fence Grid Definition & functions
  initGrid() {
    this.goFenceClientEmail = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

  colFenceClientEmail = [
    {
      headerName: 'Client Email',
      children: [
        {
          headerName: "Client", field: "clientId",
          cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Client', class: "200" },
          valueFormatter: agGridHelper.getClientName, width: 200
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

  onAddLine  () {
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
  };

  onDeleteLine  () {
    try {
      if (this.goFenceClientEmail.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goFenceClientEmail.api.getSelectedRows().forEach(x => x.delete = true);
          //this.goFenceClientEmail.api.getFilterInstance('delete').onFilterChanged();
          agGridHelper.setGridDeleteFilter(this.goFenceClientEmail.api);
        }
        //agGridHelper.setGridDeleteFilter(this.goFenceClientEmail.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  private getDetailFromGrid() {
    let rowData = [];
    this.goFenceClientEmail.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcGeoFence.get(Id).subscribe(
        fence => {
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
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
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
      this.svcGeoFence.getLookup().subscribe(
        data => {
          this.lstCity = data.lstCity;
          sessionStorage.setItem("lstClient", JSON.stringify(data.lstClient));
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

  private validate(gf: GeoFence) {
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
      var valueArr = gf.details.filter(x => !x.delete).map(function (item) { return item.clientId }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Client must be unique!');
          i = valueArr.length;
        }
      }
    }
  }

  private initForm() {
    this.frmGeoFence.reset();
    this.frmGeoFence.disable();
    this.errors = [];
    this.fenceClientEmailData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
  }
  //#endregion local functions
}
