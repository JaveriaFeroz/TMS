import { GridOptions } from 'ag-grid-community';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { JRService } from './jr.service';
import { JR } from './jr';

@Component({
  selector: 'app-journalreceipt',
  templateUrl: './jr.component.html',
  styleUrls: ['./jr.component.css']
})

export class JRComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Journal Receipt';
  readonly colSearch =
    [
      { headerName: 'Voucher #', field: 'voucherNo', },
      { headerName: 'Voucher Date', field: 'voucherDate' },
      { headerName: 'Cheque #', field: 'chequeNo' },
      { headerName: 'Payer Name', field: 'payerName' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source JR #', field: 'sourceJRNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmJR: any;
  detailData: any[];
  lstBankAccount: any;
  lstPeriod: any;
  //arId: number;
  periodId: number;
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

  constructor(private router: Router, private formbulider: FormBuilder, private Enum: AgilityEnum, private svcWaitDlg: WaitDialogService,
    private svcJR: JRService, private svcToaster: agToasterService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.arPeriodId();
   // this.arId = agFormHelper.arId();
  }

  ngOnInit() {
    this.frmJR = this.formbulider.group({
      voucherNo: [null, [Validators.required]],
      voucherDate: [null, [Validators.required]],
      bankAccountId: [null, [Validators.required]],
      chequeNo: [null, [Validators.required]],
      chequeDate: [null, [Validators.required]],
      payerName: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      narration: [null],
      periodId: [null, [Validators.required]],
      periodName: [null],
      reversedJRNo: [null],
      sourceJRNo: [null],
    });  
    this.frmJR.disable();
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
    this.frmJR.reset();
    this.frmJR.enable();
    this.frmJR.controls.voucherNo.disable();
    this.frmJR.patchValue({ voucherDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.accountId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcJR.getReceipts().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Journal Reciept", this.colSearch, r);
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
    this.frmJR.controls.voucherNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.voucherNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmJR.enable();
    this.frmJR.controls.voucherNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.accountId.focus();
    agFormHelper.setGridToolbar(false);
  }

  tbSave() {
    try {
      this.frmJR.markAllAsTouched();
      if (!this.frmJR.invalid) {
        var formData: JR = this.frmJR.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcJR.save(formData).subscribe(
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

  tbReverse(voucherNo: string) {
    if (confirm('You are about to reverse JR # ' + voucherNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcJR.reverse(voucherNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Journal Receipt # ' + voucherNo + ' reversed successfully!');
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
      this.svcJR.get(Id).subscribe(
        jr => {
          if (jr) {
            this.frmJR.disable();
            this.frmJR.controls['voucherNo'].setValue(jr.voucherNo);
            this.frmJR.controls['voucherDate'].setValue(new Date(jr.voucherDate));
            this.frmJR.controls['bankAccountId'].setValue(jr.bankAccountId);
            this.frmJR.controls['chequeNo'].setValue(jr.chequeNo);
            this.frmJR.controls['chequeDate'].setValue(new Date(jr.chequeDate));
            this.frmJR.controls['payerName'].setValue(jr.payerName);
            this.frmJR.controls['amount'].setValue(jr.amount);
            this.frmJR.controls['narration'].setValue(jr.narration);
            this.frmJR.controls['reversedJRNo'].setValue(jr.reversedJRNo);
            this.frmJR.controls['sourceJRNo'].setValue(jr.sourceJRNo);
            this.frmJR.controls['periodId'].setValue(jr.periodId);
            this.frmJR.controls['periodName'].setValue(jr.periodName);
            this.detailData = jr.details;
            this.footer = jr.footer;
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

  onBankChanged() {
    try {
      if (!this.frmJR.controls.voucherNo.value) {
        var bankNode, bankAccount, amount;
        bankAccount = this.frmJR.controls.bankAccountId.value;
        amount = this.frmJR.controls.amount.value;
        this.goDetail.api.forEachNode(function (rowNode, index) {
          if (rowNode.data.readOnly) {
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

  onBankAmountChanged() {
    try {
      let bankNode, bankId: number = this.frmJR.controls.bankAccountId.value, amount: number = this.frmJR.controls.amount.value;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.accountId == bankId && rowNode.data.readOnly) { bankNode = rowNode }
      });

      if (bankNode) {
        bankNode.setDataValue("debit", amount > 0 ? amount : 0);
        bankNode.setDataValue("credit", amount < 0 ? Math.abs(amount) : 0);
        this.setFooter();
      }
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  }

  private loadLookup() {
    try {
      this.svcJR.getLookup().subscribe(
        data => {         
          this.lstPeriod = data.lstPeriod;
          this.lstBankAccount = data.lstAccount.filter(x => x.parentAccountId === agFormHelper.bankControlId());
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

  private validate(jr: JR) {
    this.errors = [];
    if (Object.keys(jr.details).length == 0) {
      this.errors.push('Atleast one entry must exist in grid Transaction to perform save operation');
    }
    else if (jr.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    else if (jr.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    let debit: number = 0, credit: number = 0;
    jr.details.forEach(a => { debit += a.debit; credit += a.credit });

    if (debit != jr.amount || credit != debit) {
      this.errors.push('The total of Debit / Credit entry must match Bank Amount');
    }
  }

  private initForm() {
    this.frmJR.reset();
    this.frmJR.disable();
    this.errors = [];
    this.detailData = [];
    agFormHelper.setGridToolbar(false);
    //this.frmJR.patchValue({ voucherDate: new Date(), chequeDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
