import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AccessorialInvoice } from './accessorialinvoice';
import { AccessorialInvoiceService } from './accessorialinvoice.service';

@Component({
  selector: 'app-accessorialinvoice',
  templateUrl: './accessorialinvoice.component.html',
  styleUrls: ['./accessorialinvoice.component.css']
})

export class AccessorialInvoiceComponent implements OnInit {
  //#region form variables
  myForm: boolean = false;
  public goDetail: GridOptions;
  optionName: string = this.route.snapshot.data.title;
  workFlowId: number = this.route.snapshot.data.workFlowId;
  readonly colSearch =
  [
    { headerName: 'Invoice #', field: 'invoiceNo',  },
    { headerName: 'Invoice Date', field: 'invoiceDate' },
    { headerName: 'Client Name', field: 'clientName' },
  ];
  frmAI: any;
  detailData: any[]; 
  lstClient: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  viewOption: any;
  @ViewChild('clientId', { static: true }) clientId: MatSelect;
  @ViewChild('invoiceNo', { static: true }) invoiceNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private route: ActivatedRoute,
    private svcAccInvoice: AccessorialInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmAI = this.formbulider.group({
      invoiceNo: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      gstRate: [null],
      refInvNo: [null],
      refInvDate: [null],
      refInvPeriod: [null],
      workFlowId: [null],
      amount: [null],
    });
    //this.setScreenParameters();
    this.frmAI.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmAI.reset();
    this.frmAI.enable();
    this.frmAI.patchValue({ invoiceDate: new Date(), amount: 0, workFlowId: this.workFlowId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmAI.controls.invoiceNo.disable();
    this.clientId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcAccInvoice.getInvoices(this.workFlowId).subscribe(r => {
        this.svcSearchDlg.open("Search & Select Invoice", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.invoiceNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close();  });
    }
    catch (e) { this.svcToaster.showFailure(e); this.svcWaitDlg.close(); }
  }

  tbRecall() {
    this.initForm();
    this.frmAI.controls.invoiceNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.invoiceNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmAI.enable();
    this.frmAI.controls.invoiceNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.clientId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSave() {
    try {
      this.frmAI.markAllAsTouched();
      if (!this.frmAI.invalid) {
        var formData: AccessorialInvoice = this.frmAI.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcAccInvoice.save(formData).subscribe(
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
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else {
      this.initForm();
      agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    }
  }

  tbExit() {
    if (this.myForm)
      this.router.navigate(['common/MyForm']);
    else
      this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region AI Grid Definition & functions
  colDetail = [
    {
      headerName: "Charge", field: "chargeId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'AccCharge', class: "220" }, valueFormatter: agGridHelper.getAccChargeName, width: 220
    },
    {
      headerName: "Qty", field: "qty", type: "numericColumn", width: 80, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser
    },
    { headerName: "UoM", field: "uomName", width: 80 },
    {
      headerName: "Rate", field: "price", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, width: 120,
    },
    {
      headerName: "Amount", field: "amount", type: "numericColumn", valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, width: 120, editable: false, pinned: 'right', lockPinned: true,
      cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }//, valueGetter: (params) => { return params.data.qty * params.data.rate; }
    }
  ];

  onAddLine = function () {
    try {
      var res = this.goDetail.api.applyTransaction({
        add: [{
          chargeId: null, qty: 0, price: 0, uomName: null, amount: 0
        }]
      });
      this.goDetail.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "chargeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line');
    }
  };

  onDeleteLine = function () {
    try {
      if (confirm("Are you sure you want to Delete selected row?")) {
        const selectedRow = this.goDetail.api.getFocusedCell();
        if (selectedRow) {
          var rowNode = this.goDetail.api.getRowNode(selectedRow.rowIndex.toString());
          if (!rowNode.data.readOnly && !rowNode.rowPinned) {
            this.goDetail.api.selectNode(rowNode);
            this.goDetail.api.applyTransaction({ remove: this.goDetail.api.getSelectedRows() });
            this.setFooter();
          }
          else {
            this.svcToaster.showFailure("The selected row is system generated row hence no changes/delete operation is allowed on this Row!");
          }
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
    this.goDetail.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }

  private setFooter() {
    try {
      let _qty = 0, _amount = 0;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.chargeId != undefined) { _qty += rowNode.data.qty, _amount += Math.round(rowNode.data.price * rowNode.data.qty) }
      });
      this.goDetail.api.setPinnedBottomRowData([{ chargeId: null, qty: _qty, uomName: null, price: null, amount: _amount }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };
  //#endregion

  initGrid() {
    this.goDetail = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
        }
        else if (params.node.data.readOnly) {
          return { 'color': 'darkgray', 'font-style': 'italic' };
        }
      },
      onCellValueChanged: function (params) {
        if (params.colDef.field == "chargeId") {
          params.node.setDataValue("chargeId", parseInt(params.data.chargeId));
        }
        if (params.colDef.field == "qty" || params.colDef.field == "price") {
          params.node.setDataValue("amount", Math.round(params.data.qty * params.data.price));
        }
      },
      onRowDataChanged: () => { this.setFooter(); }
    };
  }

  grdDetailCellValueChanged(params) {
    if (params.column.colId === "qty" || params.column.colId === "price") {
      this.setFooter();
    }
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcAccInvoice.get(Id, this.workFlowId).subscribe(
        ia => {
          if (ia) {
            this.frmAI.disable();
            this.frmAI.controls['invoiceNo'].setValue(ia.invoiceNo);
            this.frmAI.controls['invoiceDate'].setValue(new Date(ia.invoiceDate));
            this.frmAI.controls['clientId'].setValue(ia.clientId);
            this.frmAI.controls['gstRate'].setValue(ia.gstRate);
            this.frmAI.controls['remarks'].setValue(ia.remarks);
            this.frmAI.controls['refInvNo'].setValue(ia.refInvNo);
            this.frmAI.controls['refInvDate'].setValue(ia.refInvDate);
            this.frmAI.controls['refInvPeriod'].setValue(ia.refInvPeriod);
            this.detailData = ia.details;
            this.footer = ia.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setFooter();
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
      this.svcAccInvoice.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          sessionStorage.setItem("lstAccCharge", JSON.stringify(data.lstCharge));  
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

  private validate(ai: AccessorialInvoice) {
    this.errors = [];

    if ((ai.workFlowId == 54 || ai.workFlowId == 55) && !ai.refInvNo) {
      this.errors.push('Please enter valid reference Invoice # against which this entry is recorded');
    }
    
    if (Object.keys(ai.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid to perform save operation');
    }
    if (ai.details.some(x => x.qty <= 0)) {
      this.errors.push('No row in grid can contain zero or -ve quantity');
    }
    if (ai.details.some(x => x.price <= 0)) {
      this.errors.push('No row in grid can contain zero or -ve price');
    }

    if (Object.keys(ai.details).length != 0) {
      var valueArr = ai.details.map(function (item) { return item.chargeId })
      var isDuplicate = valueArr.some(function (item, idx) {
        return valueArr.indexOf(item) != idx
      });
      if (isDuplicate) {
        this.errors.push('Charge used in grid must be unique');
      }
    }
  }

  private initForm() {
    this.frmAI.reset();
    this.frmAI.disable();
    this.errors = [];
    this.detailData = [];
    agFormHelper.setGridToolbar(false);
    this.footer = new agFooter();
    this.myForm = false;
  }
  //#endregion local functions
}
