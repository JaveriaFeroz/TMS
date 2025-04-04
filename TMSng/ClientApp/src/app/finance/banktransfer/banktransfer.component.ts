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
import { BankTransfer } from './banktransfer';
import { BankTransferService } from './banktransfer.service';
import { BankTransferDetail } from './banktransferdetail';

@Component({
  selector: 'app-banktransfer',
  templateUrl: './banktransfer.component.html',
  styleUrls: ['./banktransfer.component.css']
})

export class BankTransferComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Bank To Bank Transfers';
  detailData: BankTransferDetail[] = [];
  readonly colSearch =
    [
      { headerName: 'Transfer #', field: 'transferNo', },
      { headerName: 'Date', field: 'transferDate' },
      { headerName: 'Payment Ins.', field: 'instrumentName' },
      { headerName: 'Cheque #', field: 'chequeNo' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source Trf #', field: 'sourceTransferNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmBankTransfer: any;
  lstBankAccount: any[];
  lstAccount: any[];
  lstInstrument: any[];
  lstChequeBook: any[];
  lstPeriod: any[];
  periodId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date().setDate(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('crBankAccountId', { static: true }) crBankAccountId: MatSelect;
  @ViewChild('transferNo', { static: true }) transferNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private Enum: AgilityEnum,
    private svcB2B: BankTransferService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService)
  {
    this.loadLookup();
    this.periodId = agFormHelper.glPeriodId();
    this.initGrid();
  }

  ngOnInit() {
    this.frmBankTransfer = this.formbulider.group({
      transferNo: [null, [Validators.required]],
      transferDate: [null, [Validators.required]],
      instrumentId: [null, [Validators.required]],
      crBankAccountId: [null, [Validators.required]],
      drBankAccountId: [null, [Validators.required]],
      chequeBookId: [null],
      chequeNo: [null],
      //chequeId: [null],
      chequeDate: [null],      
      narration: [null, [Validators.required]],
      periodId: [null, [Validators.required]],
      periodName: [null],
      amount: [null],
      reversedTransferNo: [null],
      sourceTransferNo: [null]
    });
    this.frmBankTransfer.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmBankTransfer.reset();
    this.frmBankTransfer.enable();
    this.frmBankTransfer.controls.transferNo.disable();
    this.frmBankTransfer.patchValue({ transferDate: new Date(), periodId: this.periodId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.crBankAccountId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcB2B.getTransfers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Bank To Bank Transfers", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.transferNo);
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
    this.frmBankTransfer.controls.transferNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.transferNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmBankTransfer.enable();
    this.frmBankTransfer.controls.transferNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(false);
    this.crBankAccountId.focus();
  }

  tbSave() {
    try {
      this.frmBankTransfer.markAllAsTouched();
      if (!this.frmBankTransfer.invalid) {
        var formData: BankTransfer = this.frmBankTransfer.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcB2B.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Bank Transfer executed Successfully!');
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

  tbReverse(transferNo: string) {
    if (confirm('You are about to reverse Bank Transfer # ' + transferNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcB2B.reverse(transferNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Bank Transfer # ' + transferNo + ' reversed successfully!');
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
      let _debit = 0, _credit = 0;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.accountId != undefined) { _debit += rowNode.data.debit, _credit += rowNode.data.credit }
      });
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
    this.svcWaitDlg.open({});
    try {
      this.svcB2B.get(Id).subscribe(
        ia => {
          if (ia) {
            this.frmBankTransfer.disable();
            this.frmBankTransfer.controls['transferNo'].setValue(ia.transferNo);
            this.frmBankTransfer.controls['transferDate'].setValue(new Date(ia.transferDate));
            this.frmBankTransfer.controls['instrumentId'].setValue(ia.instrumentId);
            this.frmBankTransfer.controls['crBankAccountId'].setValue(ia.crBankAccountId);
            this.frmBankTransfer.controls['drBankAccountId'].setValue(ia.drBankAccountId);
            this.frmBankTransfer.controls['chequeBookId'].setValue(ia.chequeBookId);
            this.frmBankTransfer.controls['chequeNo'].setValue(ia.chequeNo);
            this.frmBankTransfer.controls['chequeDate'].setValue(new Date(ia.chequeDate));
            this.frmBankTransfer.controls['periodId'].setValue(ia.periodId);
            this.frmBankTransfer.controls['periodName'].setValue(ia.periodName);
            this.frmBankTransfer.controls['amount'].setValue(ia.amount);
            this.frmBankTransfer.controls['narration'].setValue(ia.narration);
            this.frmBankTransfer.controls['reversedTransferNo'].setValue(ia.reversedTransferNo);
            this.frmBankTransfer.controls['sourceTransferNo'].setValue(ia.sourceTransferNo);
            this.detailData = ia.details;
            this.footer = ia.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);            
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
      this.svcB2B.getLookup().subscribe(
        data => {         
          this.lstChequeBook = data.lstChequeBook;
          this.lstInstrument = data.lstInstrument;
          this.lstBankAccount = data.lstAccount.filter(x => x.parentAccountId === agFormHelper.bankControlId());
          this.lstPeriod = data.lstPeriod;
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

  private validate(bt: BankTransfer) {
    this.errors = [];

    if (bt.instrumentId == 1) {
      if (!bt.chequeBookId || !bt.chequeNo || !bt.chequeDate) {
        this.errors.push('Please select valid Cheque Book & relevant cheque');
      }
    }
    if (!bt.crBankAccountId || !bt.drBankAccountId) {
      this.errors.push('Please select valid Debit & Credit Bank Accounts');
    }
    else if (bt.crBankAccountId === bt.drBankAccountId) {
      this.errors.push('Debit & Credit Bank Accounts must be different');
    }

    if (Object.keys(bt.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
    }
    else if (bt.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    else if (bt.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }

    var rn = this.goDetail.api.getPinnedBottomRow(0);
    if (rn.data.debit != rn.data.credit || rn.data.debit == 0 || rn.data.credit == 0) {
      this.errors.push('The total of Debit and Credit must match and non-zero.');
    }
  }

  onPaymentInstrumentChanged(event) {
    if (event.value != 1) {
      this.frmBankTransfer.controls['chequeBookId'].setValue(null);
      this.frmBankTransfer.controls['chequeNo'].setValue(null);
      this.frmBankTransfer.controls['chequeDate'].setValue(null);
    }
  }

  onCRBankChanged(event) {
    this.lstChequeBook = JSON.parse(sessionStorage.getItem("lstChequeBook")).filter(x => x.accountId === event.value);
  }

  generateEntries() {
    try {
      if (!this.frmBankTransfer.controls.transferNo.value) {
        var drNode, crNode, drAccount, crAccount, amount;
        crAccount = this.frmBankTransfer.controls.crBankAccountId.value;
        drAccount = this.frmBankTransfer.controls.drBankAccountId.value;
        amount = this.frmBankTransfer.controls.amount.value;

        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.accountId && rowNode.data.readOnly) {
            if (rowNode.data.debit > 0) { drNode = rowNode }
            if (rowNode.data.credit > 0) { crNode = rowNode }
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

  private initForm() {
    this.frmBankTransfer.reset();
    this.frmBankTransfer.disable();
    this.errors = [];
    this.detailData = [];
    agFormHelper.setGridToolbar(false);
    this.frmBankTransfer.patchValue({ transferDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
