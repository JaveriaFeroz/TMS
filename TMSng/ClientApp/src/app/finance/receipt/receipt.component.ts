import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { OutstandingInvoiceService } from '../../helper/outstandinginvoice/outstandinginvoice.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Receipt } from './receipt';
import { ReceiptService } from './receipt.service';

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})

export class ReceiptComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Receipt';
  readonly colSearch =
    [
      { headerName: 'Receipt #', field: 'receiptNo', },
      { headerName: 'Receipt Date', field: 'receiptDate' },
      { headerName: 'Client Name', field: 'clientName' },
      { headerName: 'Cheque #', field: 'chequeNo' },
      { headerName: 'Amount', field: 'amount' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source #', field: 'sourceReceiptNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmReceipt: any;
  detailData: any[];
  lstBankAccount: any;
  lstClient: any;
  lstPeriod: any;
  periodId: number;
  arId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('bankAccountId', { static: true }) accountId: MatSelect;
  @ViewChild('receiptNo', { static: true }) receiptNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcReceipt: ReceiptService, private svcToaster: agToasterService, private Enum: AgilityEnum,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private svcOSInvoice: OutstandingInvoiceService) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.arPeriodId();
    this.arId = agFormHelper.arId();
  }

  ngOnInit() {
    this.frmReceipt = this.formbulider.group({
      receiptNo: [null, [Validators.required]],
      receiptDate: [null, [Validators.required]],
      clientId: [null, [Validators.required]],
      bankAccountId: [null, [Validators.required]],
      chequeNo: [null, [Validators.required]],
      chequeDate: [null, [Validators.required]],
      narration: [null],
      amount: [null, [Validators.required]],
      periodId: [null, [Validators.required]],
      periodName: [null],
      reversedReceiptNo: [null],
      sourceReceiptNo: [null]
    });
    this.frmReceipt.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmReceipt.reset();
    this.frmReceipt.enable();
    this.frmReceipt.controls.receiptNo.disable();
    this.frmReceipt.patchValue({ receiptDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.accountId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbRecall() {
    this.initForm();
    this.frmReceipt.controls.receiptNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.receiptNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcReceipt.getReceipts().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Reciept", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.receiptNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmReceipt.enable();
    this.frmReceipt.controls.receiptNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.accountId.focus();
    agFormHelper.setGridToolbar(false);
  }

  tbSave() {
    try {
      this.frmReceipt.markAllAsTouched();
      if (!this.frmReceipt.invalid) {
        var formData: Receipt = this.frmReceipt.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.allocations = JSON.parse(sessionStorage.getItem("allocations"));
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcReceipt.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Record saved Successfully');
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

  tbReverse(receiptNo: string) {
    if (confirm('You are about to reverse Receipt # ' + receiptNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcReceipt.reverse(receiptNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Receipt # ' + receiptNo + ' reversed sucessfully!');
          this.initForm();
          agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
  }

  tbAllocation(): void {
    try {
      if (!this.frmReceipt.controls['clientId'].value) {
        this.svcToaster.showFailure('Please select valid Client before hitting Allocation button', 'Client Missing');
      }
      else {
        this.svcWaitDlg.open({});
        this.svcOSInvoice.open(this.frmReceipt.controls['clientId'].value, this.frmReceipt.controls['receiptNo'].value);
        this.svcOSInvoice.selected().subscribe(total => {
          if (total) {
            if (total != 0) {
              this.frmReceipt.controls.clientId.disable();
              this.frmReceipt.controls.amount.disable();
              this.frmReceipt.controls['amount'].setValue(total);
              var arId: number = this.arId, arNode;
              this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId == arId && rowNode.data.readOnly) { arNode = rowNode; }
              });
              if (arNode) {
                if (total >= 0) {
                  arNode.setDataValue("credit", total);
                  arNode.setDataValue("debit", 0);
                }
                else {
                  arNode.setDataValue("debit", Math.abs(total));
                  arNode.setDataValue("credit", 0);
                }
              }
              else {
                this.goDetail.api.applyTransaction({
                  add: [{
                    accountId: this.arId, departmentId: null, branchId: null, clientId: null, debit: total < 0 ? Math.abs(total) : 0,
                    credit: total >= 0 ? total : 0, description: null, readOnly: true
                  }]
                });
              }
              this.setFooter();
            }
          }
        },
          () => { },
          () => { this.svcWaitDlg.close() });
      }
    }
    catch (e) { this.svcOSInvoice.close(); this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region receipt Grid Definition & functions
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
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'red' }
    },
    {
      headerName: "Credit", field: "credit", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100,
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
    },
    { headerName: "Readonly", field: "readOnly", hide: true, suppressColumnsToolPanel: true }
  ];

  onAddLine() {
    try {
      var res = this.goDetail.api.applyTransaction({
        add: [{
          accountId: null, branchId: null, deptId: null, debit: 0, credit: 0, description: null, readOnly: false
        }]
      });
      this.goDetail.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "accountId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line:');
    }
  };

  onDeleteLine() {
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

  generateEntries() {
    try {
      if (!this.frmReceipt.controls.receiptNo.value) {
        var drNode, crNode, drAccount, crAccount, amount;
        amount = this.frmReceipt.controls.amount.value;
        drAccount = amount >= 0 ? this.frmReceipt.controls.bankAccountId.value : this.arId;
        crAccount = amount >= 0 ? this.arId : this.frmReceipt.controls.bankAccountId.value;

        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.accountId && rowNode.data.readOnly) {
            if (rowNode.data.debit == 0 && rowNode.data.credit == 0) {
              if (rowNode.data.accountId == crAccount) { crNode = rowNode }
              else if (rowNode.data.accountId == drAccount) { drNode = rowNode }
            }
            else if (rowNode.data.debit > 0) { drNode = rowNode }
            else if (rowNode.data.credit > 0) { crNode = rowNode }
          }
        });
        if (drNode) {
          drNode.setDataValue("accountId", drAccount);
          drNode.setDataValue("debit", amount);
        }
        else if (drAccount && amount) {
          this.goDetail.api.applyTransaction({
            add: [{
              accountId: drAccount, branchId: null, departmentId: null, debit: amount, credit: 0, description: null, readOnly: true
            }]
          });
        }
        if (crNode) {
          crNode.setDataValue("accountId", crAccount);
          crNode.setDataValue("credit", amount);
        }
        else if (crAccount && amount) {
          this.goDetail.api.applyTransaction({
            add: [{
              accountId: crAccount, branchId: null, departmentId: null, debit: 0, credit: amount, description: null, readOnly: true
            }]
          });
        }
        this.setFooter();
      }
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  setFooter() {
    try {
      let _debit = 0, _credit = 0, _delta = 0, bankNode, bankId: number = this.frmReceipt.controls.bankAccountId.value;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.accountId != undefined) { _debit += rowNode.data.debit, _credit += rowNode.data.credit }
        if (rowNode.data.readOnly && rowNode.data.accountId == bankId) { bankNode = rowNode }
      });
      if (bankNode) {
        _delta = _debit - _credit - bankNode.data.debit + bankNode.data.credit
        bankNode.setDataValue("credit", _delta >= 0 ? _delta : 0);
        bankNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
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

  getDetailFromGrid() {
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
    this.svcWaitDlg.open({});
    try {
      this.svcReceipt.get(Id).subscribe(
        rc => {
          if (rc) {
            this.frmReceipt.disable();
            this.frmReceipt.controls['receiptNo'].setValue(rc.receiptNo);
            this.frmReceipt.controls['receiptDate'].setValue(new Date(rc.receiptDate));
            this.frmReceipt.controls['clientId'].setValue(rc.clientId);
            this.frmReceipt.controls['bankAccountId'].setValue(rc.bankAccountId);
            this.frmReceipt.controls['chequeNo'].setValue(rc.chequeNo);
            this.frmReceipt.controls['chequeDate'].setValue(new Date(rc.chequeDate));
            this.frmReceipt.controls['narration'].setValue(rc.narration);
            this.frmReceipt.controls['amount'].setValue(rc.amount);
            this.frmReceipt.controls['periodId'].setValue(rc.periodId);
            this.frmReceipt.controls['periodName'].setValue(rc.periodName);
            this.frmReceipt.controls['reversedReceiptNo'].setValue(rc.reversedReceiptNo);
            this.frmReceipt.controls['sourceReceiptNo'].setValue(rc.sourceReceiptNo);
            this.detailData = rc.details;
            sessionStorage.setItem("allocations", JSON.stringify(rc.allocations));
            this.footer = rc.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            (document.getElementById('btnAllocation') as HTMLInputElement).disabled = true;
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
      this.svcReceipt.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          this.lstPeriod = data.lstPeriod;
          this.lstBankAccount = data.lstAccount.filter(x => x.parentAccountId === agFormHelper.bankControlId());
          sessionStorage.setItem("lstAccount", JSON.stringify(data.lstAccount));
          sessionStorage.setItem("lstDepartment", JSON.stringify(data.lstDepartment));
          sessionStorage.setItem("lstBranch", JSON.stringify(data.lstBranch));
          sessionStorage.setItem("lstChequeBook", JSON.stringify(data.lstChequeBook));
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

  private validate(rc: Receipt) {
    this.errors = [];

    if (Object.keys(rc.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
    }
    if (!rc.chequeNo || !rc.chequeDate) {
      this.errors.push('Please select valid Cheque Book & relevant cheque');
    }
    if (rc.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    if (rc.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    let debit: number = 0, credit: number = 0;
    rc.details.forEach(a => { debit += a.debit; credit += a.credit; });

    if (debit != credit) {
      this.errors.push('The total of Debit / Credit must match');
    }
  }

  onBankChanged() {
    try {
      if (!this.frmReceipt.controls.receiptNo.value) {
        var bankNode, bankAccount: number = this.frmReceipt.controls.bankAccountId.value, arId: number = this.arId,
          amount: number = this.frmReceipt.controls.amount.value;

        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.readOnly && rowNode.data.accountId != arId) {
            bankNode = rowNode;
          }
        });
        if (bankNode) {
          bankNode.setDataValue("accountId", bankAccount);
          bankNode.setDataValue("debit", amount > 0 ? amount : 0);
          bankNode.setDataValue("credit", amount < 0 ? Math.abs(amount) : 0);
        }
        else if (bankAccount) {
          this.goDetail.api.applyTransaction({
            add: [{
              accountId: bankAccount, branchId: null, departmentId: null, debit: amount > 0 ? amount : 0,
              credit: amount < 0 ? Math.abs(amount) : 0, description: null, readOnly: true
            }]
          });
        }
        this.setFooter();
      }
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  private initForm() {
    this.frmReceipt.reset();
    this.frmReceipt.disable();
    this.errors = [];
    this.detailData = [];
    sessionStorage.removeItem("allocations");
    agFormHelper.setGridToolbar(false);
    this.frmReceipt.patchValue({ receiptDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
