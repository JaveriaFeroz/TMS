import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { JobClose } from './jobclose';
import { JobCloseService } from './jobclose.service';
import { JobFuel } from './jobfuel';

@Component({
  selector: 'app-jobclose',
  templateUrl: './jobclose.component.html',
  styleUrls: ['./jobclose.component.css']
})

export class JobCloseComponent implements OnInit {
  public goVehicleFuel: GridOptions;
  public goGensetFuel: GridOptions;
  readonly optionName: string = 'Job Closure';
  readonly colSearch =
    [
      { headerName: 'Job #', field: 'jobNo' },
      { headerName: 'Job Date', field: 'jobDate' },
      { headerName: 'Job Start Date', field: 'startDate' },
      { headerName: 'Status', field: 'stateName' },
    ];
  frmJobClose: any;
  vehiclefuelData: JobFuel[];
  gensetFuelData: JobFuel[];
  //closed: boolean = false;
  //TotalVehicleFuel: any;
  //TotalGensetFuel: any;
  errors: string[] = [];
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  frameworkComponents = { agDateEditor: agGridDateEditor }
  allowFuel: boolean = true;
  //isDisabled = true;
  //enablePartialDelivery: boolean = false;
  footer: agFooter = new agFooter();
  @ViewChild('jobNo', { static: true }) jobNo: ElementRef;
  @ViewChild('jobCloseDate', { static: true }) jobCloseDate: ElementRef;
  @ViewChild('btnEdit', { static: true }) btnEdit: HTMLButtonElement;

  targetNode: Node;
  config = { childList: true, subtree: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (<HTMLInputElement>document.getElementById('btnEdit')).disabled === false) {
          mutation.addedNodes[0].disabled = true;
        }
      }
    }
  };
  observer = new MutationObserver(this.callback);

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcJobClose: JobCloseService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private Enum: AgilityEnum) {
    this.loadLookup();
    this.initGrid();
    //this.enablePartialDelivery = agFormHelper.enablePartialDelivery();    
    /*this.FuelGrid();*/
  }

  ngOnInit() {
    this.frmJobClose = this.formbulider.group({
      jobNo: [null, [Validators.required]],
      jobId: [null, [Validators.required]],
      jobDate: [null],
      jobStartDate: [null],
      jobStartTime: [null],
      advance: [null],
      stateId: [null],
      stateName: [null],
      jobCloseDate: [null, [Validators.required]],
      jobCloseTime: [null, [Validators.required]],
      closeKMs: [null, [Validators.required]],
      outsourced: [null],
      fuelLtrs: [null],
      cashReturned: [null],
      hasGenset: [null],
      gensetFuelLtrs: [null],
      gensetCashReturned: [null],     
      lastKm: [null],
      enablePartialDelivery: [null],
      closed: [null],
      allowFuel: [null]
    });
    this.frmJobClose.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    this.frmJobClose.patchValue({ outsourced: false, hasGenset: false, allowFuel:true });//, enablePartialDelivery: this.enablePartialDelivery
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
/*    this.FuelGrid();*/
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divHToolbar');//document.body;//document.getElementById('btnSave') as Node;
    this.observer.observe(this.targetNode, this.config);
    agFormHelper.setGridToolbar(false);
  }

  //ngAfterViewInit() {
  //  //it is necessary to disable save button as due to ngIf it remains active otherwise
  //  (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  //}

  tbRecall() {
    this.initForm();
    this.frmJobClose.controls.jobNo.enable();
   /* this.frmJobClose.patchValue({ RentedVehicle: false, GensetFuel: true });*/
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.jobNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcJobClose.getJobs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Job", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.jobNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmJobClose.enable();
    this.frmJobClose.controls.jobNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    if (!this.frmJobClose.controls.hasGenset.value) {
      this.frmJobClose.controls.gensetFuelLtrs.disable();
      this.frmJobClose.controls.gensetCashReturned.disable();
    }
    if (this.frmJobClose.controls['stateId'].value == 8) {
      (document.getElementById('btnSave') as HTMLInputElement).disabled = true;
      this.frmJobClose.controls.closed.disable();
    }
    this.jobCloseDate.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmJobClose.markAllAsTouched();
      if (!this.frmJobClose.invalid) {
        var formData: JobClose = this.frmJobClose.getRawValue();
        if (formData.closed) {
          formData.stateId = 8;
        }        
        if (!formData.outsourced) {
          formData.vehicleFuel = this.getVehicleFuelDataFromGrid();
          if (formData.hasGenset) {
            formData.genSetFuel = this.getGensetFuelDataFromGrid();
          }
        }
        else {
          formData.vehicleFuel = [];
          formData.genSetFuel = [];
        }
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcJobClose.close(formData).subscribe(
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
    sessionStorage.removeItem("lstSupplier");
    sessionStorage.removeItem("FuelCard");
    sessionStorage.removeItem("lstFuelCard");
    sessionStorage.removeItem("lstGensetFuelCard");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  validateGridStatus() {
    var rd = this.isReadOnly();
    agFormHelper.setGridStatus(!rd);
    agFormHelper.setGridToolbar(!rd);
  }

  private initGrid() {
    this.goVehicleFuel = <GridOptions>{
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
        if (params.colDef.field == "qty") {
          params.data.amount = params.data.qty * params.data.rate;
        }
        if (params.colDef.field == "supplierId") {
          if (params.data.supplierId) {
            params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
            sessionStorage.removeItem("lstFuelCard");
            this.lstFuelCard = JSON.parse(sessionStorage.getItem("FuelCard"));
            sessionStorage.setItem("lstFuelCard", JSON.stringify(this.lstFuelCard.filter(x => x.supplierId === params.data.supplierId)));
          }
          else {
            params.node.setDataValue("supplierId", null);
          }         
        }
        if (params.colDef.field == "cardId") {
          if (params.data.cardId != "") {
            params.node.setDataValue("cardId", parseInt(params.data.cardId));
          }
          else {
            params.node.setDataValue("cardId", null);
          }
        }
      },
      onRowDataChanged: () => { this.setVehicleFuelFooter(); }
    };

    this.goGensetFuel = <GridOptions>{
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
      //columnDefs: this.colJGF,
      //rowData: [],
      //rowSelection: 'multiple',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "qty" || params.colDef.field == "rate") {
          params.data.amount = params.data.qty * params.data.rate;
        }
        if (params.colDef.field == "supplierId") {
          if (params.data.supplierId) {
            params.node.setDataValue("supplierId", parseInt(params.data.supplierId));
            sessionStorage.removeItem("lstGensetFuelCard");
            this.lstGensetFuelCard = JSON.parse(sessionStorage.getItem("FuelCard"));
            sessionStorage.setItem("lstGensetFuelCard", JSON.stringify(this.lstGensetFuelCard.filter(x => x.supplierId === params.data.supplierId)));
          }
          else {
            params.node.setDataValue("supplierId", null);
          }      
        }    

        if (params.colDef.field == "cardId") {
          if (params.data.cardId != "") {
            params.node.setDataValue("cardId", parseInt(params.data.cardId));
          }
          else {
            params.node.setDataValue("cardId", null);
          }
        }
      },
      onRowDataChanged: () => { this.setGensetFuelFooter(); }
    };
  }
  //#region Fuel Supplier Grid Definition & functions
  colVehicleFuel = [
    {
      headerName: 'Vehicle Fuel Filling Log',
      children: [
        {
          headerName: "Supplier", field: "supplierId",
          cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Supplier', class: "200" },
          valueFormatter: agGridHelper.getSupplierName, width: 200,  lockPinned: true
        },
        {
          headerName: "Fuel Card", field: "cardId",
          cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'FuelCard', class: "150" },
          valueFormatter: agGridHelper.getFuelCardName, width: 150,  lockPinned: true
        },
        { headerName: "Slip#", field: "slipNo", width: 70 },
        {
          headerName: "Slip Date", field: "slipDate", width: 105,
          cellEditor: 'agDateEditor', editable: true,
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "KM", field: "kmReading", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Ltr", field: "qty", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
          valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", width: 120, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
          valueFormatter: agGridHelper.formatNumbers, editable: false, valueParser: agGridHelper.numberValueParser,
          valueGetter: (params) => { return params.node.rowPinned ? params.data.amount : params.data.qty * params.data.rate; }
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddVFLine () {
    try {
      var res = this.goVehicleFuel.api.applyTransaction({
        add: [{
          supplierId: null, slipNo: null, slipDate:null,  cardId: null, kmReading: 0, qty: 0, rate: 0, amount:0, add: true, edit: false, delete: false
        }]
      });
      this.goVehicleFuel.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "supplierId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteVFLine () {
    try {
      if (this.goVehicleFuel.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goVehicleFuel.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goVehicleFuel.api);
          this.setVehicleFuelFooter();
        }       
      }
      else
       this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  setVehicleFuelFooter() {
    try {
      let _qty = 0, _amount = 0;
      this.goVehicleFuel.api.forEachNode(function (rowNode, index) {
        if (!rowNode.data.delete) {
          _qty += rowNode.data.qty, _amount += rowNode.data.qty * rowNode.data.rate
        }
      });
      this.goVehicleFuel.api.setPinnedBottomRowData([{
        supplierId: null, slipNo: null, slipDate: null, cardId: null, kmReading: null,
        qty: _qty, rate: null, amount: _amount
      }]);
      //this.TotalVehicleFuel = _qtytotal;
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  getVehicleFuelDataFromGrid() {
    let rowData = [];
    this.goVehicleFuel.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  //#endregion
  //#region Fuel Genset Supplier Grid Definition & functions
  colGensetFuel = [
    {
      headerName: 'Genset Fuel Filling Log',
      children: [
        {
          headerName: "Supplier", field: "supplierId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Supplier', class: "200" }, valueFormatter: agGridHelper.getSupplierName, width: 200,  lockPinned: true
        },
        {
          headerName: "Fuel Card", field: "cardId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'GensetFuelCard', class: "150" }, valueFormatter: agGridHelper.getGensetFuelCardName,
          width: 150, lockPinned: true
        },
        {
          headerName: "Slip#", field: "slipNo", width: 70,
        },
        {
          headerName: "Slip Date", field: "slipDate", width: 85, cellEditor: 'agDateEditor', editable: true,
          valueFormatter: agGridHelper.dateFormatter
        },
        {
          headerName: "KM", field: "kmReading", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Ltr", field: "qty", type: "numericColumn", width: 60,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Rate", field: "rate", type: "numericColumn", width: 70, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
          valueFormatter: agGridHelper.formatNumbers, editable: false, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", width: 120, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
          valueFormatter: agGridHelper.formatNumbers, editable: false, valueParser: agGridHelper.numberValueParser,
          valueGetter: (params) => { return params.node.rowPinned ? params.data.amount : params.data.qty * params.data.rate; }
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddGFLine = function () {
    try {
      var res = this.goGensetFuel.api.applyTransaction({
        add: [{
          supplierId: null, slipNo: null, slipDate: null, cardId: null, kmReading: 0, qty: 0, rate: 0, amount: 0, add: true, edit: false, delete: false
        }]
      });
      this.goGensetFuel.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "supplierId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteGFLine = function () {
    try {
      if (this.goGensetFuel.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goGensetFuel.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goGensetFuel.api);
          this.setGensetFuelFooter();
        }
      }
      else
       this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ', exception, 'error');
    }
  };

  setGensetFuelFooter() {
    try {
      let _qty = 0, _amount = 0;
      this.goGensetFuel.api.forEachNode(function (rowNode, index) {
        if (!rowNode.data.delete) {
          _qty += rowNode.data.qty, _amount += rowNode.data.qty * rowNode.data.rate
        }
      });
      this.goGensetFuel.api.setPinnedBottomRowData([{
        supplierId: null, slipNo: null, slipDate: null, cardId: null, kmReading: null,
        qty: _qty, rate: null, amount: _amount
      }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  getGensetFuelDataFromGrid() {
    let rowData = [];
    this.goGensetFuel.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion
  //#endregion

  //#region local functions
  get(jobNo: string) {
    jobNo = agFormHelper.padL(jobNo);
    this.svcWaitDlg.open({});
    try {
      this.svcJobClose.get(jobNo).subscribe(
        jobclose => {
          if (jobclose) {
            this.frmJobClose.controls['jobNo'].setValue(jobclose.jobNo);
            this.frmJobClose.controls['jobId'].setValue(jobclose.jobId);
            this.frmJobClose.controls['jobDate'].setValue(jobclose.jobDate);
            this.frmJobClose.controls['jobStartDate'].setValue(jobclose.jobStartDate);
            this.frmJobClose.controls['jobStartTime'].setValue(formatDate(jobclose.jobStartTime, 'HH:mm', 'en-US'));
            this.frmJobClose.controls['stateId'].setValue(jobclose.stateId);
            this.frmJobClose.controls['stateName'].setValue(jobclose.stateName);
            this.frmJobClose.controls['jobCloseDate'].setValue(jobclose.jobCloseDate);
            this.frmJobClose.controls['jobCloseTime'].setValue(formatDate(jobclose.jobCloseTime, 'HH:mm', 'en-US'));
            this.frmJobClose.controls['closeKMs'].setValue(jobclose.closeKMs);
            this.frmJobClose.controls['outsourced'].setValue(jobclose.outsourced);
            this.frmJobClose.controls['fuelLtrs'].setValue(jobclose.fuelLtrs);
            this.frmJobClose.controls['cashReturned'].setValue(jobclose.cashReturned);
            this.frmJobClose.controls['hasGenset'].setValue(jobclose.hasGenset);
            this.frmJobClose.controls['gensetFuelLtrs'].setValue(jobclose.gensetFuelLtrs);
            this.frmJobClose.controls['gensetCashReturned'].setValue(jobclose.gensetCashReturned);
            this.frmJobClose.controls['advance'].setValue(jobclose.advance);
            //this.frmJobClose.controls['enablePartialDelivery'].setValue(this.enablePartialDelivery);
            var FuelCard = JSON.parse(sessionStorage.getItem("FuelCard"));
            sessionStorage.setItem("lstFuelCard", JSON.stringify(FuelCard));
            sessionStorage.setItem("lstGensetFuelCard", JSON.stringify(FuelCard));                      
            if (jobclose.stateId==8) {
              this.frmJobClose.controls['closed'].setValue(1);
              //this.closed = true;
            }           
            if (!jobclose.outsourced) {
              this.vehiclefuelData = jobclose.vehicleFuel;
              //this.setVehicleFuelFooter();
              if (jobclose.hasGenset)
                this.gensetFuelData = jobclose.genSetFuel;
            }
            this.footer = jobclose.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            //if (this.enablePartialDelivery) {
              //this.goVehicleFuel.columnApi.setColumnsVisible(["cardId", "kmReading"], false);
            //}
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
      this.svcJobClose.getLookup().subscribe(
        data => {
          sessionStorage.setItem("lstSupplier", JSON.stringify(data.lstSupplier));
          sessionStorage.setItem("FuelCard", JSON.stringify(data.lstFuelCard));
          sessionStorage.setItem("lstFuelCard", JSON.stringify(data.lstFuelCard));
          sessionStorage.setItem("lstGensetFuelCard", JSON.stringify(data.lstFuelCard));   
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

  private validate(jo: JobClose) {
    this.errors = [];
    let _qty = 0, _gqty = 0;
    if (!jo.outsourced) {
      this.goVehicleFuel.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.supplierId && !rowNode.data.delete) { _qty += rowNode.data.qty }
      });
      if (jo.hasGenset) {
        this.goGensetFuel.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.supplierId && !rowNode.data.delete) { _gqty += rowNode.data.qty }
        });
      }     
    }
    if (jo.closeKMs < jo.lastKm) {
      this.errors.push('You are entering End Km Meter Reading as ' + jo.closeKMs +
        ' which is lower than the last reported meter reading (' + jo.lastKm + ') . Please enter correct Meter Reading?');
    }
    else if (jo.jobStartDate > jo.jobCloseDate) {
      this.errors.push('Job Start Date cannot be Less then Job End Date');
    }

    if (this.allowFuel)
    {
       if (jo.fuelLtrs <= 0 && !jo.outsourced) {
        this.errors.push('Please enter valid value for fuel consumed before saving the transaction');
      }
      else if (jo.fuelLtrs > 0 && jo.outsourced == true) {
        this.errors.push('When rented vehicle clicked no  fuel litres required');
      }
      else if (jo.fuelLtrs != _qty && !jo.outsourced) {
        this.errors.push('The total fuel consumed (' + jo.fuelLtrs + ') must match with the break up provided in fuel detail grid (' + _qty + ')');
      }
      else if (jo.fuelLtrs > 0 && Object.keys(jo.vehicleFuel).length > 0) {
        if (jo.vehicleFuel.some(x => !x.delete && !x.supplierId)) {
          this.errors.push('Please select valid supplier for each row of Vehicle Fuel Grid');
        }
        if (jo.vehicleFuel.some(x => !x.delete && x.slipNo == null || x.slipDate == null)) {
          this.errors.push('No row in  Fuel Supplier can be  without Slip # or Date');
        }
        if (jo.vehicleFuel.some(x => !x.delete && x.qty <= 0)) {
          this.errors.push('No row in  Fuel Supplier can contain zero Litre');
        }
        if (jo.vehicleFuel.some(x => !x.delete && x.slipDate == null)) {
          this.errors.push('No row in   Fuel Supplier  with null slip date');
        }

        var valuevehicleArr = jo.vehicleFuel.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, slipNo: item.slipNo })).slice().sort();
        var duplicates = [];
        for (var i = 0; i < valuevehicleArr.length - 1; i++) {
          if (valuevehicleArr[i + 1]['supplierId'] === valuevehicleArr[i]['supplierId']) {
            if (valuevehicleArr[i + 1]['slipNo'] === valuevehicleArr[i]['slipNo'])
              duplicates.push(valuevehicleArr[i]);
          }
        }
        if (duplicates.length > 0) {
          this.errors.push('Vehicle Fuel entries must be unique! Same Supplier and SlipNo can`t be availed twice!');
        }
      }
    }


    //else if (JO.RentedVehicle == true && JO.vDetails.lenght > 0) {
    //  this.errors.push('When rented vehicle clicked no  fuel detail required in Fuel Grid');
    //}

    if (!jo.hasGenset && jo.gensetFuelLtrs > 0) {
      this.errors.push('Genset Fuel required only when  Genset fuel option is clicked');
    }

    if (jo.hasGenset == true && _gqty == 0) {
      this.errors.push('Please provide fuel break up for genset fuel or otherwise uncheck Genset Fuel Details option');
    }
    else if (jo.gensetFuelLtrs > 0 && Object.keys(jo.genSetFuel).length > 0 && jo.hasGenset) {
      if (jo.gensetFuelLtrs != _gqty) {
        this.errors.push('The total fuel consumed for Genset (' + jo.gensetFuelLtrs + ') must match with the break up provided in genset fuel detail grid (' + _gqty + ')');
      }
      if (jo.genSetFuel.some(x => !x.delete && !x.supplierId)) {
        this.errors.push('Please Select valid value for supplier in each row of Genset Fuel Grid');
      }
      if (jo.genSetFuel.some(x => !x.delete && x.slipNo == null || x.slipDate == null)) {
        this.errors.push('No row in  Fuel Supplier can be without Slip# & Date');
      }
      if (jo.genSetFuel.some(x => !x.delete && x.qty <= 0)) {
        this.errors.push('No row in Genset Fuel Grid can contain zero Litre');
      }
      var valuegensetArr = jo.genSetFuel.filter(x => !x.delete).map(item => ({ supplierId: item.supplierId, slipNo: item.slipNo })).slice().sort();
      for (var i = 0; i < valuegensetArr.length - 1; i++) {
        if (valuegensetArr[i + 1]['supplierId'] === valuegensetArr[i]['supplierId']) {
          if (valuegensetArr[i + 1]['slipNo'] === valuegensetArr[i]['slipNo']) {
            this.errors.push('Genset Fuel entries must be unique! Duplicate slip # is not allowed for same supplier!');
            i = valuegensetArr.length;
          }
        }
      }
    }
  }
    //else if (JO.GensetFuel == false && JO.gDetails.lenght > 0) {
    //  this.errors.push('When Genset Fuel no detail required in Fuel Grid');
    //}


    //else if (JO.JOStatusid='08')
    //{
    //  //int RwbCount = GetOpenRoadwayBills();
    //  //if (RwbCount > 0) {
    //    this.errors.push('This job contains ' + RwbCount.ToString() + ' roadwaybills that are not yet '+
    //      'delivered. You can only close job once all of its Rwb are atleast at Delivered Status',
    //      'Job is at wrong status');
    // //}
    //}

  onOutsourcedVehicle(event) {
    if (event.checked) {
      this.frmJobClose.controls.fuelLtrs.disable();
      this.frmJobClose.controls.cashReturned.disable();
      this.frmJobClose.controls['fuelLtrs'].setValue(0);
      this.frmJobClose.controls['cashReturned'].setValue(0);
      this.goVehicleFuel.api.setRowData([]);
    }
    else {
      this.frmJobClose.controls.fuelLtrs.enable();
      this.frmJobClose.controls.cashReturned.enable();
    }
  }

  onGensetFuel(event) {
    if (event.checked) {
      this.frmJobClose.controls.gensetFuelLtrs.enable();
      this.frmJobClose.controls.gensetCashReturned.enable();
    }
    else {
      this.frmJobClose.controls.gensetFuelLtrs.disable();
      this.frmJobClose.controls.gensetCashReturned.disable();
      this.frmJobClose.controls['gensetFuelLtrs'].setValue(0);
      this.frmJobClose.controls['gensetCashReturned'].setValue(0);
      this.goGensetFuel.api.setRowData([]);
    }
  }

  onVehicleFuelCellValueChanged(params) {
    if (params.column.getId() === "qty") {
      this.setVehicleFuelFooter();
    }
  }
  onGensetFuelCellValueChanged(params) {
    if (params.column.getId() === "qty") {
      this.setGensetFuelFooter();
    }
  }

  onAllowFuel(event) {
    if (event.checked) {
      this.frmJobClose.controls.fuelLtrs.enable();
      this.frmJobClose.controls['fuelLtrs'].setValue(0);
      this.allowFuel = true;
    }
    else {
      this.frmJobClose.controls.fuelLtrs.disable();
      this.allowFuel = false;
    }
  }

  //private FuelGrid() {
  //  if (!this.enablePartialDelivery) {
  //    alert(1);
  //    this.goVehicleFuel.columnApi.setColumnVisible('cardId', false);
  //    this.goVehicleFuel.columnApi.setColumnVisible('kmReading', false);
  //    this.goGensetFuel.columnApi.setColumnVisible('cardId', false);
  //    this.goGensetFuel.columnApi.setColumnVisible('kmReading', false);
  //  }
  //  else {
  //    alert(11);
  //    this.goVehicleFuel.columnApi.setColumnVisible('Fuel Card', false);
  //    this.goVehicleFuel.columnApi.setColumnVisible('Fuel Card', true);
  //    this.goVehicleFuel.columnApi.setColumnVisible('kmReading', false);
  //    //this.goGensetFuel.columnApi.setColumnVisible('cardId', false);
  //    //this.goGensetFuel.columnApi.setColumnVisible('kmReading', false);
  //  }
  //}

  //private setGridToolbar(enable: boolean) {
  //  this.isDisabled = !enable;
  //}

  private isReadOnly() {
    return (document.querySelector('[id="btnEdit"]')['disabled'] == false);
  }

  private disableSave() {
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  private initForm() {  
    this.frmJobClose.reset();
    this.frmJobClose.disable();
    this.errors = [];
    this.vehiclefuelData = [];
    this.gensetFuelData = [];
/*    (document.getElementById('btnSaveClose') as HTMLInputElement).disabled = true;*/
    this.frmJobClose.patchValue({ outsourced: false, hasGenset: false, allowFuel: true });
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
  }
  //#endregion local functions
}



