import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { RWB } from '../rwb/rwb';
import { RWBConsignee } from '../rwb/rwbconsignee';
import { RWBSKU } from '../rwb/rwbsku';
import { RwbUpdateService } from './rwbupdate.service';

@Component({  
  selector: 'app-rwbupdate',  
  templateUrl: './rwbupdate.component.html',  
  styleUrls: ['./rwbupdate.component.css']  
})  

export class RWBUpdateComponent implements OnInit {
  //#region form variables
  public goSKU: GridOptions;
  public goConsignee: GridOptions;
  readonly optionName: string = 'Trip Update'; 
  frmRwbUpdate: any;
  skuData: RWBSKU[];
  consigneeData: RWBConsignee[];
  lstConsignee: any;
  lstCategory: any;
  lstConsigneeAll: any;
  lstCategoryAll: any;
  lstSKUAll: any;
  //VehicleCapacity: any;
  //isDisabled = true;
  enablePartialDelivery: boolean = false;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('rwbno', { static: true }) rwbno: ElementRef;
  @ViewChild('customerOrderNo', { static: true }) customerOrderNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcRWBUpdate: RwbUpdateService,
    private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService, private Enum: AgilityEnum) {
    this.loadLookup();
    this.initGrid();
    this.enablePartialDelivery = agFormHelper.enablePartialDelivery(); //data.enablePartialDelivery;
  }

  ngOnInit() {
    this.frmRwbUpdate = this.formbulider.group({
      rwbId: [null],
      shipperId: [null],
      rwbNo: [null, [Validators.required]],      
      customerOrderNo: [null],  
      gatePassNo: [null],
      categoryId: [null],
      consigneeId: [null],  
      weight_Carried: [null],
      weight_Delivered: [null],
      categoryMandatory: [null],
      productMandatory: [null],
      enablePartialDelivery: [null],
      vehicleCapacity: [null],
      multiDrop: [null],
    });
    this.frmRwbUpdate.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.frmRwbUpdate.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
  }

  //#region toolbar functions
  tbRecall() {
    this.initForm();
    this.frmRwbUpdate.controls.rwbNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.rwbno.nativeElement.focus();
  }

  tbEdit() {
    this.frmRwbUpdate.enable();
    this.frmRwbUpdate.controls.rwbNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.customerOrderNo.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmRwbUpdate.markAllAsTouched();
      if (!this.frmRwbUpdate.invalid) {
        var formData: RWB = this.frmRwbUpdate.getRawValue();
        if (!this.enablePartialDelivery) {
          formData.skUs = this.getSKUDataFromGrid();
        }
        else {
          formData.consignees = this.getConsigneeDataFromGrid();
        } 
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcRWBUpdate.update(formData).subscribe(
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
    sessionStorage.removeItem("lstConsignee");
    sessionStorage.removeItem("lstSKU");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region SKU Grid Definition & functions
  colSKU = [
    {
      headerName: 'SKUs in the Load',
      children: [
        {
          headerName: "SKU", field: "skuId",
          cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'SKU', class: "300" },
          valueFormatter: agGridHelper.getSKUName, width: 300
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddSKULine () {
    try {
      var res = this.goSKU.api.applyTransaction({
        add: [{ skuId: null, add: true, edit: false, delete: false }]
      });
      this.goSKU.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "skuId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteSKULine  () {
    try {
      if (this.goSKU.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goSKU.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goSKU.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getSKUDataFromGrid() {
    let rowData = [];
    this.goSKU.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region consignee Grid Definition & functions
  colConsignee = [
    {
      headerName: 'Drop Points (Consignees)',
      children: [
        {
          headerName: "Consignee", field: "consigneeId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Consignee', class: "250" },
          valueFormatter: agGridHelper.getConsigneeName, width: 250
        },
        {
          headerName: "SKU", field: "skuId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'SKU', class: "150" }, valueFormatter: agGridHelper.getSKUName, width: 150
        },
        {
          headerName: "Qty", field: "qty", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddConsigneeLine  () {
    try {
      var res = this.goConsignee.api.applyTransaction({
        add: [{ consigneeId: null, skuId: null, qty: 0, add: true, edit: false, delete: false }]
      });
      this.goConsignee.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "consigneeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteConsigneeLine  () {
    try {
      if (this.goConsignee.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goConsignee.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goConsignee.api);
          this.setConsigneeFooter();
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getConsigneeDataFromGrid() {
    let rowData = [];
    this.goConsignee.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  setConsigneeFooter() {
    try {
      let _qty = 0;
      this.goConsignee.api.forEachNode(function (rowNode, index) {
        if (!rowNode.data.delete) { _qty += rowNode.data.qty } });
      this.goConsignee.api.setPinnedBottomRowData([{ consigneeId: null, skuId: null, qty: _qty }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'SetConsigneeFooter:');
    }
  };
  //#endregion 

  initGrid() {
    this.goSKU = <GridOptions>{
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
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "skuId") {
          if (params.data.skuId) {
            params.node.setDataValue("skuId", parseInt(params.data.skuId));
          }
          else {
            params.node.setDataValue("skuId", null);
          }
        }
      }
    };

    this.goConsignee = <GridOptions>{
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
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'blue', 'background-color': 'lightgray' };
        }
      },
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "skuId") {
          if (params.data.skuId) {
            params.node.setDataValue("skuId", parseInt(params.data.skuId));
          }
          else {
            params.node.setDataValue("skuId", null);
          }
        }

        if (params.colDef.field == "consigneeId") {
          if (params.data.consigneeId) {
            params.node.setDataValue("consigneeId", parseInt(params.data.consigneeId));
          }
          else {
            params.node.setDataValue("consigneeId", null);
          }
        }
      },
      onRowDataChanged: () => { this.setConsigneeFooter(); }
    };
  }
  //#endregion

  //#region local functions
  get(rwbNo: string) {
    rwbNo = agFormHelper.padL(rwbNo);
    this.svcWaitDlg.open({});
    try {
      this.svcRWBUpdate.get(rwbNo).subscribe(
        rwbupdate => {
          if (rwbupdate) {
            this.frmRwbUpdate.disable();
            this.filterByClient(rwbupdate.clientId);
            this.frmRwbUpdate.controls['rwbNo'].setValue(rwbupdate.rwbNo);
            this.frmRwbUpdate.controls['rwbId'].setValue(rwbupdate.rwbId);
            this.frmRwbUpdate.controls['categoryId'].setValue(rwbupdate.categoryId);
            this.frmRwbUpdate.controls['consigneeId'].setValue(rwbupdate.consigneeId);
            this.frmRwbUpdate.controls['gatePassNo'].setValue(rwbupdate.gatePassNo);
            this.frmRwbUpdate.controls['customerOrderNo'].setValue(rwbupdate.customerOrderNo);
            this.frmRwbUpdate.controls['weight_Carried'].setValue(rwbupdate.weight_Carried);
            this.frmRwbUpdate.controls['weight_Delivered'].setValue(rwbupdate.weight_Delivered);
            this.frmRwbUpdate.controls['categoryMandatory'].setValue(rwbupdate.categoryMandatory);
            this.frmRwbUpdate.controls['productMandatory'].setValue(rwbupdate.productMandatory);
            this.frmRwbUpdate.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
            this.frmRwbUpdate.controls['vehicleCapacity'].setValue(rwbupdate.vehicleCapacity);
            this.frmRwbUpdate.controls['multiDrop'].setValue(rwbupdate.multiDrop);
            if (!this.enablePartialDelivery) {
              this.skuData = rwbupdate.skUs;
            }
            else {
              this.consigneeData = rwbupdate.consignees;
              this.setConsigneeFooter();
            }
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcRWBUpdate.getLookup().subscribe(
        data => {
          this.lstConsigneeAll = data.lstConsignee;
          this.lstCategoryAll = data.lstCategory;
          this.lstSKUAll = data.lstSKU;
          //sessionStorage.setItem("lstSKU", JSON.stringify(data.lstSKU));
        },
        error => {
          this.svcToaster.showFailure(error);
        },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private filterByClient(clientId: number) {
    this.lstConsignee = this.lstConsigneeAll.filter(x => x.clientId === clientId);
    sessionStorage.setItem("lstConsignee", JSON.stringify(this.lstConsignee));
    this.lstCategory = this.lstCategoryAll.filter(x => x.clientId === clientId);
    sessionStorage.setItem("lstSKU", JSON.stringify(this.lstSKUAll.filter(x => x.clientId === clientId)));
  }

  onConsigneeCellValueChanged(params) {
    if (params.column.getId() === "qty") {
      this.setConsigneeFooter();
    }
  }

  private validate(r: RWB) {
    this.errors = [];
    if (!this.enablePartialDelivery) {
      if (r.consigneeId == null) {
        this.errors.push('Please select valid Conisgnee');
      }
      if (r.categoryMandatory && !r.categoryId) {
        this.errors.push('Please select valid Category as it is marked as mandatory for current shipper');
      }
      if (r.productMandatory && Object.keys(r.skUs.filter(x => !x.delete)).length == 0) {
        this.errors.push('Atleast one SKU must be selected as SKU is marked as mandatory for current Shipper');
      }
      if (r.skUs.some(x => !x.delete && !x.skuId)) {
        this.errors.push('Please Select valid value for SKU in each row of SKU Grid');
      }
      else if (Object.keys(r.skUs.filter(x => !x.delete)).length != 0) {
        var valueArr = r.skUs.filter(x => !x.delete).map(function (item) { return item.skuId })
        if (valueArr.some(function (item, idx) { return valueArr.indexOf(item) != idx })) {
          this.errors.push('SKU must be unique');
        }
      }
    }
    else {
      if (Object.keys(r.consignees.filter(x => !x.delete)).length > 0) {
        let _cQty = 0;
        this.goConsignee.api.forEachNode(function (rowNode, index) {
          if (!rowNode.data.delete) { _cQty += rowNode.data.qty }
        });
        if (_cQty != r.vehicleCapacity) {
          this.errors.push('The Consignee wise break up of Qty must match Vehicle Capacity');
        }
        if (r.consignees.some(x => !x.delete && !x.skuId && !x.consigneeId)) {
          this.errors.push('Please Select valid value for SKU and Consignee in each row of Drop Consignee Grid');
        }
        if (r.consignees.some(x => !x.delete && x.qty <= 0)) {
          this.errors.push('Quantity must be greater than Zero for each row of Consignee Grid');
        }
        if (!r.multiDrop) {
          var consigneeArr = r.consignees.filter(x => !x.delete).map(function (item) { return item.consigneeId }).slice().sort();
          for (var i = 0; i < consigneeArr.length - 1; i++) {
            if (consigneeArr[i + 1] != consigneeArr[i]) {
              this.errors.push('Consignee must be same as Trip consignee as this Road bill is not marked as Multi Drop!');
            }
          }
        }
      }
    }
  }

  private initForm() {
    this.frmRwbUpdate.reset();    
    this.frmRwbUpdate.disable();
    this.errors = [];
    this.skuData = [];
    this.consigneeData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    if (this.enablePartialDelivery) { this.setConsigneeFooter(); }
    this.frmRwbUpdate.patchValue({ enablePartialDelivery: this.enablePartialDelivery });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
