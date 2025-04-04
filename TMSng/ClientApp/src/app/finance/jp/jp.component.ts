import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { OutstandingTripService } from '../../helper/outstandingtrip/outstandingtrip.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { JP } from './jp';
import { JPService } from './jp.service';

@Component({
  selector: 'app-journalpayment',
  templateUrl: './jp.component.html',
  styleUrls: ['./jp.component.css']
})

export class JPComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Journal Payment';
  readonly colSearch =
    [
      { headerName: 'Voucher #', field: 'voucherNo', },
      { headerName: 'Voucher Date', field: 'voucherDate' },
      { headerName: 'Cheque #', field: 'chequeNo' },
      { headerName: 'Payee Name', field: 'payeeName' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source JP #', field: 'sourceJPNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmJP: any;
  detailData: any[];
  lstBankAccount: any; 
  lstInstrument: any;
  lstChequeBook: any;
  lstClient: any;
  lstPeriod: any;
  periodId: number;
  advExpACId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('bankAccountId', { static: true }) accountId: MatSelect;
  @ViewChild('voucherNo', { static: true }) voucherNo: ElementRef;
  targetNode: HTMLElement;
  config = { childList: true, subtree: true, attributes: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (
          !(<HTMLInputElement>document.getElementById('btnEdit')).disabled || !(<HTMLInputElement>document.getElementById('btnExit')).disabled)) { mutation.addedNodes[0].disabled = true; }
      }
    }
  };
  observer = new MutationObserver(this.callback);
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private Enum: AgilityEnum,
    private svcJP: JPService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService,
    private svcSearchDlg: SearchDialogService, private svcOSTrip: OutstandingTripService) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.apPeriodId();
    this.advExpACId = agFormHelper.advanceACId();
  }

  ngOnInit() {
    this.frmJP = this.formbulider.group({
      voucherNo: [null, [Validators.required]],
      voucherDate: [null, [Validators.required]],
      bankAccountId: [null, [Validators.required]],
      instrumentId: [null, [Validators.required]],
      chequeBookId: [null],
      chequeNo: [null],
      chequeDate: [null],
      payeeName: [null, [Validators.required]],
      narration: [null],
      amount: [null, [Validators.required]],
      periodId: [null, [Validators.required]],
      periodName: [null],
      reversedJPNo: [null],
      sourceJPNo: [null],
      hasTrip: [null],
      clientId: [null],
      jobDateFrom: [null],
      jobDateTo: [null]
    });
    this.frmJP.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.targetNode = document.getElementById('divSave');
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmJP.reset();
    this.frmJP.enable();
    this.frmJP.controls.voucherNo.disable();
    this.frmJP.patchValue({ voucherDate: new Date(), chequeDate: new Date(), periodId: this.periodId, hasTrip: false });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.accountId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcJP.getPayments().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Journal Payment", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.voucherNo);
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
    this.frmJP.controls.voucherNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.voucherNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmJP.enable();
    this.frmJP.controls.voucherNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmJP.controls.hasTrip.disable();
    agFormHelper.setGridToolbar(false);
    if (this.frmJP.controls['hasTrip'].value) {
      (<HTMLInputElement>document.getElementById("btnTrip")).disabled = false;
    }
    this.frmJP.controls.clientId.disable();
  }

  tbSave() {
    try {
      this.frmJP.markAllAsTouched();
      if (!this.frmJP.invalid) {
        var formData: JP = this.frmJP.getRawValue();
        formData.details = this.getDetailFromGrid();
        if (formData.hasTrip) {
          formData.trips = JSON.parse(sessionStorage.getItem("trips"));
        }
        else {
          formData.trips = [];
        }
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcJP.save(formData).subscribe(
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

  tbReverse(voucherNo: string) {
    if (confirm('You are about to reverse Journal Payment # ' + voucherNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcJP.reverse(voucherNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Journal Payment # ' + voucherNo + ' reversed sucessfully!');
          this.initForm();
          agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
  }

  tbTrip(): void {
    try {
      if (!this.frmJP.controls['jobDateFrom'].value || !this.frmJP.controls['jobDateTo'].value) {
        this.svcToaster.showFailure('Please select valid Job closure Date range before hitting trip button', 'Job Closure Date missing');
      }
      else if (this.frmJP.controls['jobDateFrom'].value > this.frmJP.controls['jobDateTo'].value) {
        this.svcToaster.showFailure('Date From must always be older or same as Date To', 'Invalid Date Range');
      }
      else {
        this.svcWaitDlg.open({});
        this.svcOSTrip.open(this.frmJP.controls['clientId'].value, this.frmJP.controls['voucherNo'].value,
          this.frmJP.controls['jobDateFrom'].value, this.frmJP.controls['jobDateTo'].value);
        this.svcOSTrip.selected().subscribe(total => {
          if (total) {
            if (total > 0) {
              this.frmJP.controls.clientId.disable();
              this.frmJP.controls.hasTrip.disable();
              this.frmJP.controls.jobDateFrom.disable();
              this.frmJP.controls.jobDateTo.disable();
              this.frmJP.controls['amount'].setValue(Math.abs(total));
              var advId: number = this.advExpACId, advNode;
              this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId == advId && rowNode.data.readOnly) { advNode = rowNode }
              });
              if (advNode) {
                advNode.setDataValue("debit", total);
                advNode.setDataValue("credit", 0);
              }
              else {
                this.goDetail.api.applyTransaction({
                  add: [{
                    accountId: this.advExpACId, departmentId: null, branchId: null, clientId: null, debit: total, credit: 0, description: null, readOnly: true
                  }]
                });
              }
              this.setFooter();
            }
          }
        });
        () => { };
      }
    }
    catch (e) { this.svcOSTrip.close(); this.svcToaster.showFailure(e); }
    finally { this.svcWaitDlg.close(); }
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region Detail Grid Definition & functions
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
          accountId: null, branchId: null, deptId: null, clientId: null, debit: 0, credit: 0, description: null, readOnly: false
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

  setFooter() {
    try {
      let _debit = 0, _credit = 0, _delta = 0, bankNode, bankId: number = this.frmJP.controls.bankAccountId.value;
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
  initGrid() {
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
      this.svcJP.get(Id).subscribe(
        jp => {
          if (jp) {
            this.frmJP.disable();
            this.frmJP.controls['voucherNo'].setValue(jp.voucherNo);
            this.frmJP.controls['voucherDate'].setValue(new Date(jp.voucherDate));
            this.frmJP.controls['bankAccountId'].setValue(jp.bankAccountId);
            this.frmJP.controls['instrumentId'].setValue(jp.instrumentId);
            this.frmJP.controls['chequeBookId'].setValue(new Date(jp.chequeBookId));
            this.frmJP.controls['chequeNo'].setValue(jp.chequeNo);
            this.frmJP.controls['chequeDate'].setValue(new Date(jp.chequeDate));
            this.frmJP.controls['payeeName'].setValue(jp.payeeName);
            this.frmJP.controls['narration'].setValue(jp.narration);
            this.frmJP.controls['amount'].setValue(jp.amount);
            this.frmJP.controls['periodId'].setValue(jp.periodId);
            this.frmJP.controls['periodName'].setValue(jp.periodName);
            this.frmJP.controls['reversedJPNo'].setValue(jp.reversedJPNo);
            this.frmJP.controls['sourceJPNo'].setValue(jp.sourceJPNo);
            this.frmJP.controls['hasTrip'].setValue(jp.hasTrip);
            this.frmJP.controls['clientId'].setValue(jp.clientId);
            this.frmJP.controls['jobDateFrom'].setValue(jp.jobDateFrom);
            this.frmJP.controls['jobDateTo'].setValue(jp.jobDateTo);
            this.detailData = jp.details;
            if (jp.hasTrip) {
              sessionStorage.setItem("trips", JSON.stringify(jp.trips));
            }
            this.footer = jp.footer;
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
      this.svcJP.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
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

  private validate(jp: JP) {
    this.errors = [];

    if (Object.keys(jp.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
    }
    if (jp.instrumentId == 1) {
      if (!jp.chequeBookId || !jp.chequeNo || !jp.chequeDate) {
        this.errors.push('Please select valid Cheque Book & relevant cheque');
      }
    }
    else if (jp.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    else if (jp.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    let debit: number = 0, credit: number = 0, bankAmount: number = 0, bankId: number = this.frmJP.controls.bankAccountId.value;
    jp.details.forEach(a => { debit += a.debit; credit += a.credit; if (a.accountId == bankId && a.readOnly) { bankAmount = a.credit - a.debit; } });

    if (debit != credit) {
      this.errors.push('The total of Debit / Credit must match');
    }
    if (this.frmJP.controls.amount.value != bankAmount) {
      this.errors.push('The Bank amount must match');
    }
  }

  onPaymentInstrumentChanged(event) {
    if (event.value != 1) {
      this.frmJP.controls['chequeBookId'].setValue(null);
      this.frmJP.controls['chequeNo'].setValue(null);
      this.frmJP.controls['chequeDate'].setValue(null);
    }
  }

  onBankChanged() {
    try {
      if (!this.frmJP.controls.voucherNo.value) {
        var bankNode, bankAccount: number = this.frmJP.controls.bankAccountId.value,
          amount: number = this.frmJP.controls.amount.value, bookId: number = this.frmJP.controls.chequeBookId.value;
        this.lstChequeBook = JSON.parse(sessionStorage.getItem("lstChequeBook")).filter(x => x.accountId === bankAccount);
        if (!this.lstChequeBook.some(x => x.bookId == bookId))
          this.frmJP.controls.chequeBookId.value = null;

        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.readOnly && rowNode.data.accountId == bankAccount) {
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
    this.frmJP.reset();
    this.frmJP.disable();
    this.errors = [];
    this.detailData = [];
    sessionStorage.removeItem("trips");
    agFormHelper.setGridToolbar(false);
    this.frmJP.patchValue({ voucherDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
