import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { SupplierRate } from './supplierrate';
import { SupplierRateService } from './supplierrate.service';
import { SupplierRateDetail } from './supplierratedetail';

@Component({
  selector: 'app-supplierrate',
  templateUrl: './supplierrate.component.html',
  styleUrls: ['./supplierrate.component.css']
})

export class SupplierRateComponent implements OnInit {

  public goSupplierRate: GridOptions;
  //#region constant variables
  readonly optionName: string = 'Supplier Rate';
  readonly colSearch =
    [
      { headerName: 'SupplierId', field: 'supplierId', width: 70},
      { headerName: 'SupplierName', field: 'supplierName' },
    ];
  //#endregion
  frmSupplierRate: any;
  supplierRateData:  SupplierRateDetail[];
  lstSupplier: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  frameworkComponents = {
    agDateEditor: agGridDateEditor,
  }
  @ViewChild('supplierId', { static: true }) supplierId: MatSelect;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcSupplierRate: SupplierRateService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService,)
  {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmSupplierRate = this.formbulider.group({
      supplierId: [null, [Validators.required]],
    });
    this.frmSupplierRate.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }
  //#region toolbar functions
  //tbAdd() {
  //  this.frmSupplierRate.reset();
  //  this.frmSupplierRate.enable();
  //  this.frmSupplierRate.controls.SupplierRateNo.disable();
  //  this.frmSupplierRate.patchValue({ AdjustmentDate: new Date() });
  //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
  //  (<HTMLInputElement>document.getElementById("btnGridAdd")).disabled = false;
  //  (<HTMLInputElement>document.getElementById("btnGridDelete")).disabled = false;
  //  this.productName.focus();
  //}

  tbRecall() {
    this.initForm();
    this.frmSupplierRate.controls.supplierId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.supplierId.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcSupplierRate.getRates().subscribe(r => {
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
    this.frmSupplierRate.enable();
    this.frmSupplierRate.controls.supplierId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmSupplierRate.markAllAsTouched();
      if (!this.frmSupplierRate.invalid) {
        var formData: SupplierRate = this.frmSupplierRate.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcSupplierRate.save(formData).subscribe(
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

  //#region grid setup
  //#region Supplier Rare Grid Definition & functions

  initGrid() {
    this.goSupplierRate = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      //columnDefs: this.colSupplierRate,
      //rowData: [],
     rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
      }
    };
  }
  colSupplierRate = [
    {
      headerName: 'Supplier Fuel Rate',
      children: [
        {
          headerName: "From Date", field: "fromDate", width: 105,
          cellEditor: 'agDateEditor', editable: true,
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "To Date", field: "toDate", width: 105,
          cellEditor: 'agDateEditor', editable: true,
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "Fuel Rate", field: "fuelRate", type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 110
        },

        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddLine () {
    try {
      var res = this.goSupplierRate.api.applyTransaction({
        add: [{
          fromDate: null, toDate: null, fuelRate:0, add: true, edit: false, delete: false
        }]
      });
      this.goSupplierRate.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "fromDate" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goSupplierRate.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goSupplierRate.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goSupplierRate.api);
          //this.goSupplierRate.api.getFilterInstance('delete').onFilterChanged();
        }
        //agGridHelper.setGridDeleteFilter(this.goSupplierRate.api);
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };
  
  getDetailFromGrid() {
    let rowData = [];
    this.goSupplierRate.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#endregion
  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcSupplierRate.get(Id).subscribe(
        supplierrate => {
          if (supplierrate) {
            this.frmSupplierRate.disable();
            this.frmSupplierRate.controls['supplierId'].setValue(supplierrate.supplierId);
            this.supplierRateData = supplierrate.details;
            this.footer = supplierrate.footer;
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
      this.svcSupplierRate.getLookup().subscribe(
        data => {
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

  private validate(sr: SupplierRate) {
    this.errors = [];    
    if (Object.keys(sr.details).length == 0) {
      this.errors.push('Atleast one entry must exist in Supplier Transaction to perform save operation');
    }
    else if (sr.details.some(x => !x.delete && x.fromDate > x.toDate)) {
      this.errors.push('Effective Date cannot be greater thne Expiry Date');
    }
  }

  onChange(event) {  
    this.get(event);    
  }

  private initForm() {
    this.frmSupplierRate.reset();
    this.frmSupplierRate.disable();
    this.errors = [];
    this.supplierRateData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
    //this.goSupplierRate.api.setRowData([]);
    //this.SupplierRates = null;    
  }
  //#endregion local functions
}
