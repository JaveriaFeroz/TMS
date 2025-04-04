import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Asset } from './asset';
import { AssetService } from './asset.service';
import { AssetTyre } from './assettyre';

@Component({
  selector: 'app-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.css']
})

export class AssetComponent implements OnInit {
  public goTyre: GridOptions;
  //#region constant variables
  readonly optionName: string = 'Asset';
  readonly colSearch =
    [
      { headerName: 'Asset Id', field: 'assetId' },
      { headerName: 'Asset #', field: 'assetNo' },
      { headerName: 'Asset Type', field: 'assetTypeName' },
      { headerName: 'Active ?', field: 'isActive' },
    ];
  //#endregion
  frmAsset: any;
  tyresData: AssetTyre[];
  lstAssetType: any;
  lstStatus: any;
  lstCity: any;
  lstBranch: any;
  lstTrailor: any;
  lstClient: any;
  lstLeaseType: any;
  lstDriver: any;
  lstCapacity: any;
  lstMake: any;
  lstSupplier: any;
  errors: string[] = [];
  MinDate = new Date(new Date().getDate() - 5475);
  MaxDate = new Date();
  footer: agFooter = new agFooter();
  IsMandatoryDriver2: boolean = false;
  AllowTrailer: boolean = false;
  @ViewChild('assetNo', { static: true }) assetNo: ElementRef;
  @ViewChild('assetId', { static: true }) assetId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcAsset: AssetService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
    this.IsMandatoryDriver2 = agFormHelper.IsMandatoryDriver2();
    this.AllowTrailer = agFormHelper.AllowTrailer();
  }

  ngOnInit() {
    this.frmAsset = this.formbulider.group({
      assetId: [null, [Validators.required]],
      assetNo: [null, [Validators.required]],
      assetTypeId : [null, [Validators.required]],
      capacityId : [null, [Validators.required]],
      makeId : [null, [Validators.required]],
      model : [null, [Validators.required]],
      purchaseDate : [null, [Validators.required]],
      leaseTypeId : [null, [Validators.required]],
      supplierId : [null],
      startKMs : [null],
      kMs : [null],
      statusId : [null, [Validators.required]],
      driverId1 : [null],
      driverId2 : [null],
      trailerId : [null],
      faCode : [null],
      cityId : [null, [Validators.required]],
      clientId : [null],
      baseId : [null, [Validators.required]],
      isActive: [null],
    });
    this.frmAsset.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmAsset.reset();
    this.frmAsset.enable();
    this.frmAsset.controls.assetId.disable();
    this.frmAsset.patchValue({ isActive: true, startKMs: 0, kMs:0});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.assetNo.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmAsset.controls.assetId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.assetId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcAsset.getAssets().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Asset", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.assetId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmAsset.enable();
    this.frmAsset.controls.assetNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.assetNo.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmAsset.markAllAsTouched();
      if (!this.frmAsset.invalid) {
        var formData: Asset = this.frmAsset.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcAsset.save(formData).subscribe(
            () => {
              this.svcToaster.showSuccess('Record saved Successfully');
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
            },
            error => {
              this.svcToaster.showFailure(error.message);
            },
            () => {
              this.svcWaitDlg.close();
            }
          );
        }
      }
    }
    catch (e) {
      this.svcWaitDlg.close(); this.svcToaster.showFailure(e.message);
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

  //#region grid setup
  private initGrid() {
    this.goTyre = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
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

  colTyre = [
    {
      headerName: 'Asset Tyre',
      children:
        [
          { headerName: "Serial #", field: "serialNo", width: 100 },
          { headerName: "Make", field: "make", width: 100 },
          {
            headerName: "Start KMs", field: "startKMs", valueFormatter: agGridHelper.formatNumbers,
            valueParser: agGridHelper.numberValueParser, width: 80,
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
            cellEditor: agGridHelper.getCellCheckBox()
          },
          { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ]
    }    
  ];

  onAddLine () {
    try {
      var res = this.goTyre.api.applyTransaction({
        add: [{ clientId: null,  add: true, edit: false, delete: false }]});
      this.goTyre.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "serialNo" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goTyre.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goTyre.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goTyre.api);
        }
        //agGridHelper.setGridDeleteFilter(this.goTyre.api);
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
    this.goTyre.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcAsset.get(Id).subscribe(
        asset => {
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
      this.svcAsset.getLookup().subscribe(
        data => {         
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

  private validate(ast: Asset) {
    this.errors = [];
    if (!ast.purchaseDate) {
      this.errors.push('Please select Purchase Date');
    }
    if (ast.assetTypeId == 1) {
      if (!ast.driverId1) {
        this.errors.push('Please select Driver1');
      }

      if (!ast.driverId2 && this.IsMandatoryDriver2) {
        this.errors.push('Please select Driver2');
      }
      if (!ast.trailerId && this.AllowTrailer) {
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
      if (ast.trailerId != null ) {
        this.errors.push('No Trailer Required');
      }

      if (ast.leaseTypeId != 2 && ast.supplierId == null) {
        this.errors.push('Please select valid Supplier before hitting save button');
      }
      if (ast.leaseTypeId == 2 && ast.supplierId) {
        this.errors.push('Supplier cannot be assigned for owned vehicles');
      }
    }
    
  }

  private initForm() {
    this.frmAsset.reset();
    this.frmAsset.disable();
    this.errors = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.tyresData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
