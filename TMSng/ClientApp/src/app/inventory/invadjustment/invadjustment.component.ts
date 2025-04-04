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
import { InvAdjustment } from './InvAdjustment';
import { InvAdjustmentService } from './invadjustment.service';
import { InvAdjustmentDetail } from './InvAdjustmentDetail';

@Component({
  selector: 'app-invadjustment',
  templateUrl: './invadjustment.component.html',
  styleUrls: ['./invadjustment.component.css']
})

export class InvAdjustmentComponent implements OnInit {
  //#region form variables
  public goAdjustment: GridOptions;
  readonly optionName: string = 'Inventory Adjustment';
  readonly colSearch =
    [
      { headerName: 'Adjustment #', field: 'adjId', width: 70 },
      { headerName: 'Date', field: 'adjDate' },
      { headerName: 'Branch', field: 'branchName' }
    ];
  frmInvAdjustment: any;
  adjustmentData: InvAdjustmentDetail[];
  lstBranch: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('branchId', { static: true }) branchId: MatSelect;
  @ViewChild('adjId', { static: true }) adjId: ElementRef;

  targetNode: Node;
  config = { childList: true, subtree: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (<HTMLInputElement>document.getElementById('btnAdd')).disabled === false) {
          mutation.addedNodes[0].disabled = true;
        }
      }
    }
  };
  observer = new MutationObserver(this.callback);
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInvAdj: InvAdjustmentService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmInvAdjustment = this.formbulider.group({
      adjId: [null, [Validators.required]],
      adjDate: [null, [Validators.required]],
      branchId: [null, [Validators.required]], 
    });
    this.frmInvAdjustment.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.targetNode = document.getElementById('divHToolbar');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInvAdjustment.reset();
    this.frmInvAdjustment.enable();
    this.frmInvAdjustment.controls.adjId.disable();
    this.frmInvAdjustment.patchValue({ adjDate: new Date()});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.branchId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmInvAdjustment.controls.adjId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.adjId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInvAdj.getInvAdjustments().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Inventory Adjustment", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.adjId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInvAdjustment.enable();
    this.frmInvAdjustment.controls.adjId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(true);
    //(<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.branchId.focus();
  }

  tbSave() {
    try {
      this.frmInvAdjustment.markAllAsTouched();
      if (!this.frmInvAdjustment.invalid) {
        var formData: InvAdjustment = this.frmInvAdjustment.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcInvAdj.save(formData).subscribe(
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
    sessionStorage.removeItem("lstProduct");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region Adjustment Grid Definition & functions
  colAdjustment = [
    {
      headerName: 'Inventory Adjustment Details',
      children: [
        {
          headerName: "Product", field: "productId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Product', class: "300" },
          valueFormatter: agGridHelper.getProductName, width: 300
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        { headerName: "UoM", field: "uoMName", width: 80, editable: false },
        { headerName: "UomId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
        {
          headerName: "Price", field: "price", type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100, editable: false
        },
        { headerName: "Reason", field: "reason", cellEditor: "agLargeTextCellEditor", width: 200, tooltipField: "reason" },
      ]
    }   
  ];

  onAddLine () {
    try {
      var res = this.goAdjustment.api.applyTransaction({
        add: [{
          productId: null, quantity: 0, uoMId: null, uoMName: null, price: 0, reason: null
        }]
      });
      this.goAdjustment.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine () {
    try {
      if (confirm("Are you sure you want to Delete selected row?")) {
        const selectedRow = this.goAdjustment.api.getFocusedCell();
        if (selectedRow) {
          var rowNode = this.goAdjustment.api.getRowNode(selectedRow.rowIndex.toString());
            this.goAdjustment.api.selectNode(rowNode);
            this.goAdjustment.api.applyTransaction({ remove: this.goAdjustment.api.getSelectedRows() });
        }
        else
          this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
      }
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  private getDetailFromGrid() {
    let rowData = [];
    this.goAdjustment.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  initGrid() {
    this.goAdjustment = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      tooltipShowDelay: 0,
      tooltipMouseTrack: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true,
        resizable: true,
        singleClickEdit: true,
      },
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.colDef.field == "productId") {
          if (params.data.productId == "") {
            params.node.setDataValue("productId", null);
          }
          else {
            var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
            var product = lstProduct.filter(x=> x.productId == params.data.productId)[0];
            params.node.setDataValue('price', product.purchasePrice);
            params.node.setDataValue('uoMName', product.uomName);
            params.node.setDataValue('uoMId', product.uomId);
            params.node.setDataValue("productId", parseInt(params.data.productId));
          }          
        }
      }
    }; 
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInvAdj.get(Id).subscribe(
        invadj => {
          if (invadj) {
            this.frmInvAdjustment.disable();
            this.frmInvAdjustment.controls['adjId'].setValue(invadj.adjId);
            this.frmInvAdjustment.controls['adjDate'].setValue(invadj.adjDate);
            this.frmInvAdjustment.controls['branchId'].setValue(invadj.branchId);
            this.adjustmentData = invadj.details;
            this.footer = invadj.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else {           
            this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
          }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }    

  private loadLookup() {
    try {
      this.svcWaitDlg.open({});
      this.svcInvAdj.getLookup().subscribe(
        data => {
          this.lstBranch = data.lstBranch;
          sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));  
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private validate(ia: InvAdjustment) {
    this.errors = [];
    if (Object.keys(ia.details).length == 0) {
      this.errors.push('Atleast one product must exist in Inventory Adjustment Transaction to perform save operation');
    }
    if (ia.details.some(x => !x.productId)) {     
      this.errors.push('Product must be selected in each row of Grid, please remove unnecessary rows');
    }
    if (ia.details.some(x => x.quantity == 0)) {
      this.errors.push('No row in Adjustment Transaction can contain zero quantity');
    }
    if (ia.details.some(x => !x.reason)) {
      this.errors.push('Please enter valid reason for adjustment');
    }
    if (ia.details.length != 0) {
      var valueArr = ia.details.map(function (item) { return item.productId }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Product must be unique!');
          i = valueArr.length;
        }
      }
    }
  }

  private initForm() {
    this.frmInvAdjustment.reset();
    this.frmInvAdjustment.disable();
    this.errors = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.adjustmentData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
