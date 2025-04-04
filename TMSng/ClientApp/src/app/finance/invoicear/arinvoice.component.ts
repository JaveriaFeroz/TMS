import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ARInvoice } from './arinvoice';
import { ARInvoiceService } from './arinvoice.service';
import { ARInvoiceDetail } from './arinvoicedetail';

@Component({
  selector: 'app-arinvoice',
  templateUrl: './arinvoice.component.html',
  styleUrls: ['./arinvoice.component.css']
})

export class ARInvoiceComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'AR Invoice';
  readonly colSearch =
    [
      { headerName: 'Invoice #', field: 'invoiceNo', },
      { headerName: 'Invoice Date', field: 'invoiceDate' },
      { headerName: 'Client Name', field: 'clientName' },
      { headerName: 'Client Inv #', field: 'clientInvNo' },
      { headerName: 'Amount', field: 'amount' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Reverser Document #', field: 'sourceInvNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmInvoice: any;
  detailData: ARInvoiceDetail[] = [];
  lstClient: any;
  lstPeriod: any;
  periodId: number;
  arId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('clientId', { static: true }) clientId: MatSelect;
  @ViewChild('invoiceNo', { static: true }) invoiceNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcARInvoice: ARInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private Enum: AgilityEnum) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.arPeriodId();
    this.arId = agFormHelper.arId();
  }

  ngOnInit() {
    this.frmInvoice = this.formbulider.group({
      invoiceNo: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      clientInvNo: [null, [Validators.required]],
      clientInvDate: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      narration: [null],
      periodId: [null, [Validators.required]],
      periodName: [null],
      reversedInvoiceNo: [null],
      sourceInvoiceNo: [null],
    });
    this.frmInvoice.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInvoice.reset();
    this.frmInvoice.enable();
    this.frmInvoice.controls.invoiceNo.disable();
    this.frmInvoice.patchValue({ invoiceDate: new Date(), clientInvDate: new Date(), periodId: this.periodId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.goDetail.api.applyTransaction({
      add: [{
        accountId: this.arId, branchId: null, departmentId: null, debit: 0, credit: 0, description: null, readOnly: true
      }]
    });
    this.clientId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcARInvoice.getInvoices().subscribe(r => {
        this.svcSearchDlg.open("Search & Select AR Invoice", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.invoiceNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbRecall() {
    this.initForm();
    this.frmInvoice.controls.invoiceNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.invoiceNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmInvoice.enable();
    this.frmInvoice.controls.invoiceNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(false);
    this.frmInvoice.controls.clientId.disable();
  }

  tbSave() {
    try {
      this.frmInvoice.markAllAsTouched();
      if (!this.frmInvoice.invalid) {
        var formData: ARInvoice = this.frmInvoice.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcARInvoice.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('AR invoice saved Successfully');
              this.setFooter();
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

  tbReverse(invoiceNo: string) {
    if (confirm('You are about to reverse AR Invoice # ' + invoiceNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcARInvoice.reverse(invoiceNo).subscribe(
        () => {
          this.svcToaster.showSuccess('AR Invoice # ' + invoiceNo + ' reversed successfully!');
          this.initForm();
          agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
          
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region detail grid Definition & functions
  colDetail = [
    {
      headerName: "Account", field: "accountId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'Account', class: "250" }, valueFormatter: agGridHelper.getAccountName, width: 250,
      pinned: 'left', lockPinned: true
    },
    {
      headerName: "Branch", field: "branchId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'Branch', class: "150" }, valueFormatter: agGridHelper.getBranchName, width: 150,
      pinned: 'left', lockPinned: true
    },
    {
      headerName: "Dept", field: "deptId", cellEditor: agGridHelper.getAgilitySelect(),
      cellEditorParams: { source: 'Department', class: "150" }, valueFormatter: agGridHelper.getDepartmentName, width: 150,
      pinned: 'left', lockPinned: true
    },
    {
      headerName: "Desc", field: "description", width: 250, cellEditor: "agLargeTextCellEditor"
    },
    {
      headerName: "Debit", field: "debit", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100,
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
    },
    {
      headerName: "Credit", field: "credit", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100,
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'red' }
    },
    { headerName: "Readonly", field: "readOnly", hide: true, suppressColumnsToolPanel: true }
  ];

  onAddLine = function () {
    try {
      var res = this.goDetail.api.applyTransaction({
        add: [{
          accountId: null, branchId: null, deptId: null, clientId: null, debit: 0, credit: 0, description: null, readOnly: false
        }]
      });
      this.goDetail.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "accountId" });
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

  private setFooter() {
    try {
      let _debit = 0, _credit = 0, _delta = 0, arNode, arId: number = this.arId;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.accountId != undefined) { _debit += rowNode.data.debit, _credit += rowNode.data.credit }
        if (rowNode.data.accountId == arId) { arNode = rowNode }
      });
      if (arNode) {
        _delta = _debit - _credit - arNode.data.debit + arNode.data.credit
        arNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
        arNode.setDataValue("credit", _delta > 0 ? _delta : 0);
        _debit = 0; _credit = 0;
        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.accountId != undefined) { _debit += rowNode.data.debit, _credit += rowNode.data.credit }
        });
      }
      this.goDetail.api.setPinnedBottomRowData([{
        accountId: null, departmentId: null, branchId: null,
        clientId: null, debit: _debit, credit: _credit, descrption: null, readOnly: true
      }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  private getDetailFromGrid() {
    let rowData = [];
    this.goDetail.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  private initGrid() {
    this.goDetail = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: this.allowDetailEdit.bind(this),
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
        if (params.colDef.field == "accountId") {
          params.node.setDataValue("accountId", parseInt(params.data.accountId));
        }
        if (params.colDef.field == "branchId") {
          params.node.setDataValue("branchId", parseInt(params.data.branchId));
        }
        if (params.colDef.field == "deptId") {
          params.node.setDataValue("deptId", parseInt(params.data.deptId));
        }
      },
      onRowDataChanged: () => { this.setFooter(); }
    };
  }

  private allowDetailEdit(params) {
    return !params.node.isRowPinned() && !params.node.data.readOnly;
  }

  grdDetailCellValueChanged(params) {
    if (!params.data.readOnly && (params.column.getId() === "credit" || params.column.getId() === "debit")) {
      this.setFooter();
    }
  }
  //#endregion

  //#region local functions
  get(Id: string) {
    if (Id) {
      this.svcWaitDlg.open({});
      try {
        this.svcARInvoice.get(Id).subscribe(
          ar => {
            if (ar) {
              this.frmInvoice.disable();
              this.frmInvoice.controls['invoiceNo'].setValue(ar.invoiceNo);
              this.frmInvoice.controls['invoiceDate'].setValue(new Date(ar.invoiceDate));
              this.frmInvoice.controls['clientId'].setValue(ar.clientId);
              this.frmInvoice.controls['clientInvNo'].setValue(ar.clientInvNo);
              this.frmInvoice.controls['clientInvDate'].setValue(new Date(ar.clientInvDate));
              this.frmInvoice.controls['narration'].setValue(ar.narration);
              this.frmInvoice.controls['amount'].setValue(ar.amount);
              this.frmInvoice.controls['reversedInvoiceNo'].setValue(ar.reversedInvoiceNo);
              this.frmInvoice.controls['sourceInvoiceNo'].setValue(ar.sourceInvoiceNo);
              this.frmInvoice.controls['periodId'].setValue(ar.periodId);
              this.frmInvoice.controls['periodName'].setValue(ar.periodName);
              this.detailData = ar.details;
              this.footer = ar.footer;
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
  }

  private loadLookup() {
    try {
      this.svcARInvoice.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          this.lstPeriod = data.lstPeriod;
          sessionStorage.setItem("lstAccount", JSON.stringify(data.lstAccount));
          sessionStorage.setItem("lstDepartment", JSON.stringify(data.lstDepartment));
          sessionStorage.setItem("lstBranch", JSON.stringify(data.lstBranch));
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

  private validate(ari: ARInvoice) {
    this.errors = [];
    if (Object.keys(ari.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
    }
    else if (ari.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    else if (ari.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    let debit: number = 0;
    ari.details.forEach(a => debit += a.debit);

    if (debit != ari.amount) {
      this.errors.push('The total of Debit / Credit entry in Invoice detail must match Customer Invoice Amount');
    }
  }

  private initForm() {
    this.frmInvoice.reset();
    this.frmInvoice.disable();
    this.errors = [];
    this.detailData = [];
    agFormHelper.setGridToolbar(false);
    this.frmInvoice.patchValue({ invoiceDate: new Date(), clientInvDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
