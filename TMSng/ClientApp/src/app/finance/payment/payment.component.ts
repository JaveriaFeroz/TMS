import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { OutstandingPIVService } from '../../helper/outstandingpiv/outstandingpiv.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { Payment } from './payment';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Payment';
  readonly colSearch =
    [
      { headerName: 'Voucher #', field: 'pyNo', },
      { headerName: 'Voucher Date', field: 'pyDate' },
      { headerName: 'Supplier Name', field: 'supplierName' },
      { headerName: 'Cheque #', field: 'chequeNo' },
      { headerName: 'Amount', field: 'amount' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source #', field: 'sourcePYNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmPY: any;
  detailData: any[];
  lstBankAccount: any;
  lstInstrument: any;
  lstChequeBook: any;
  lstSupplier: any;
  lstPeriod: any;
  periodId: number;
  apId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('bankAccountId', { static: true }) accountId: MatSelect;
  @ViewChild('pyNo', { static: true }) pyNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private Enum: AgilityEnum,
    private svcPayment: PaymentService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService,
    private svcSearchDlg: SearchDialogService, private svcOSPIV: OutstandingPIVService) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.apPeriodId();
    this.apId = agFormHelper.apId();
  }

  ngOnInit() {
    this.frmPY = this.formbulider.group({
      pyNo: [null, [Validators.required]],
      pyDate: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      bankAccountId: [null, [Validators.required]],
      instrumentId: [null, [Validators.required]],
      chequeBookId: [null],
      chequeNo: [null],
      chequeDate: [null],
      narration: [null],      
      amount: [null, [Validators.required]],
      periodId: [null, [Validators.required]],
      periodName: [null],
      reversedPYNo: [null],
      sourcePYNo: [null]
    });
    this.frmPY.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmPY.reset();
    this.frmPY.enable();
    this.frmPY.controls.pyNo.disable();
    this.frmPY.patchValue({ pyDate: new Date(), periodId: this.periodId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.accountId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbRecall() {
    this.initForm();
    this.frmPY.controls.pyNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.pyNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcPayment.getPayments().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Payment", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.pyNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmPY.enable();
    this.frmPY.controls.pyNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.accountId.focus();
    agFormHelper.setGridToolbar(false);
  }

  tbSave() {
    try {
      this.frmPY.markAllAsTouched();
      if (!this.frmPY.invalid) {
        var formData: Payment = this.frmPY.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.allocations = JSON.parse(sessionStorage.getItem("allocations"));
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcPayment.save(formData).subscribe(
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

  tbReverse(pyNo: string) {
    if (confirm('You are about to reverse Payment # ' + pyNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcPayment.reverse(pyNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Payment # ' + pyNo + ' reversed sucessfully!');
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
      if (!this.frmPY.controls['supplierId'].value) {
        this.svcToaster.showFailure('Please select valid Supplier before hitting Allocation button', 'Supplier Missing');
      }
      else {
        this.svcWaitDlg.open({});
        this.svcOSPIV.open(this.frmPY.controls['supplierId'].value, this.frmPY.controls['pyNo'].value);
        this.svcOSPIV.selected().subscribe(total => {
          if (total) {
            if (total != 0) {
              this.frmPY.controls.supplierId.disable();
              this.frmPY.controls.amount.disable();
              this.frmPY.controls['amount'].setValue(total);
              var apId: number = this.apId, apNode;
              this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId == apId && rowNode.data.readOnly) { apNode = rowNode; }
              });
              if (apNode) {
                if (total >= 0) {
                  apNode.setDataValue("debit", total);
                  apNode.setDataValue("credit", 0);
                }
                else {
                  apNode.setDataValue("credit", Math.abs(total));
                  apNode.setDataValue("debit", 0);
                }
              }
              else {
                this.goDetail.api.applyTransaction({
                  add: [{
                    accountId: this.apId, departmentId: null, branchId: null, clientId: null, debit: total >= 0 ? total : 0,
                    credit: total < 0 ? Math.abs(total) : 0, description: null, readOnly: true
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
    catch (e) { this.svcOSPIV.close(); this.svcToaster.showFailure(e); }
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region payment Grid Definition & functions
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
      if (!this.frmPY.controls.pyNo.value) {
        var drNode, crNode, drAccount, crAccount, amount;
        amount = this.frmPY.controls.amount.value;
        crAccount = amount >= 0 ? this.frmPY.controls.bankAccountId.value : this.apId;
        drAccount = amount >= 0 ? this.apId : this.frmPY.controls.bankAccountId.value;

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
      let _debit = 0, _credit = 0, _delta = 0, bankNode, bankId: number = this.frmPY.controls.bankAccountId.value;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.accountId != undefined) { _debit += rowNode.data.debit, _credit += rowNode.data.credit }
        if (rowNode.data.readOnly && rowNode.data.accountId == bankId) { bankNode = rowNode }
      });
      if (bankNode) {
        _delta = _debit - _credit - bankNode.data.debit + bankNode.data.credit
        bankNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
        bankNode.setDataValue("credit", _delta > 0 ? _delta : 0);
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
      this.svcPayment.get(Id).subscribe(
        py => {
          if (py) {
            this.frmPY.disable();
            this.frmPY.controls['pyNo'].setValue(py.pyNo);
            this.frmPY.controls['pyDate'].setValue(new Date(py.pyDate));
            this.frmPY.controls['supplierId'].setValue(py.supplierId);
            this.frmPY.controls['bankAccountId'].setValue(py.bankAccountId);
            this.frmPY.controls['instrumentId'].setValue(py.instrumentId);
            this.frmPY.controls['chequeBookId'].setValue(py.chequeBookId);
            this.frmPY.controls['chequeNo'].setValue(py.chequeNo);
            this.frmPY.controls['chequeDate'].setValue(new Date(py.chequeDate));
            this.frmPY.controls['narration'].setValue(py.narration);
            this.frmPY.controls['amount'].setValue(py.amount);
            this.frmPY.controls['periodId'].setValue(py.periodId);
            this.frmPY.controls['periodName'].setValue(py.periodName);
            this.frmPY.controls['reversedPYNo'].setValue(py.reversedPYNo);
            this.frmPY.controls['sourcePYNo'].setValue(py.sourcePYNo);
            this.detailData = py.details;
            sessionStorage.setItem("allocations", JSON.stringify(py.allocations));
            this.footer = py.footer;
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
      this.svcPayment.getLookup().subscribe(
        data => {
          this.lstSupplier = data.lstSupplier;
          this.lstPeriod = data.lstPeriod;
          this.lstChequeBook = data.lstChequeBook;
          this.lstInstrument = data.lstInstrument;
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

  private validate(py: Payment) {
    this.errors = [];

    if (Object.keys(py.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
    }

    if (py.instrumentId == 1) {
      if (!py.chequeBookId || !py.chequeNo || !py.chequeDate) {
        this.errors.push('Please select valid Cheque Book & relevant cheque');
      }
    }
    else if (py.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    else if (py.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    let debit: number = 0, credit: number = 0;
    py.details.forEach(a => { debit += a.debit; credit += a.credit; });

    if (debit != credit) {
      this.errors.push('The total of Debit / Credit must match');
    }
  }

  onPaymentInstrumentChanged(event) {
    if (event.value != 1) {
      this.frmPY.controls['chequeBookId'].setValue(null);
      this.frmPY.controls['chequeNo'].setValue(null);
      this.frmPY.controls['chequeDate'].setValue(null);
    }
  }

  onBankChanged() {
    try {
      if (!this.frmPY.controls.pyNo.value) {
        var bankNode, bankAccount: number = this.frmPY.controls.bankAccountId.value, apId: number = this.apId,
          amount: number = this.frmPY.controls.amount.value, bookId: number = this.frmPY.controls.chequeBookId.value;
        this.lstChequeBook = JSON.parse(sessionStorage.getItem("lstChequeBook")).filter(x => x.accountId === bankAccount);
        if (!this.lstChequeBook.some(x => x.bookId == bookId))
          this.frmPY.controls.chequeBookId.value = null;

        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.readOnly && rowNode.data.accountId != apId) {
            bankNode = rowNode;
          }
        });
        if (bankNode) {
          bankNode.setDataValue("accountId", bankAccount);
          bankNode.setDataValue("debit", amount < 0 ? Math.abs(amount) : 0);
          bankNode.setDataValue("credit", amount > 0 ? amount : 0);
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
    this.frmPY.reset();
    this.frmPY.disable();
    this.errors = [];
    this.detailData = [];
    sessionStorage.removeItem("allocations");
    agFormHelper.setGridToolbar(false);
    this.frmPY.patchValue({ pyDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
