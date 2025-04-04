import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { JV } from './jv';
import { JVService } from './jv.service';
import { JVDetail } from './jvdetail';

@Component({
  selector: 'app-journalvoucher',
  templateUrl: './jv.component.html',
  styleUrls: ['./jv.component.css']
})

export class JVComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Journal Voucher';
  readonly colSearch =
    [
      { headerName: 'Voucher #', field: 'voucherNo', },
      { headerName: 'Voucher Date', field: 'voucherDate' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source #', field: 'sourceVoucherNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmJV: any;
  detailData: JVDetail[];
  lstPeriod: any;
  periodId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('narration', { static: true }) narration: ElementRef;
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

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcJV: JVService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService,
    private svcSearchDlg: SearchDialogService, private Enum: AgilityEnum) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.glPeriodId();
  }

  ngOnInit() {
    this.frmJV = this.formbulider.group({
      voucherNo: [null, [Validators.required]],
      voucherDate: [null, [Validators.required]],
      periodId: [null, [Validators.required]],
      periodName: [null],
      narration: [null],
      reversedVoucherNo: [null],
      sourceVoucherNo: [null]
    });
    this.frmJV.disable();
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
    this.frmJV.reset();
    this.frmJV.enable();
    this.frmJV.controls.voucherNo.disable();
    this.frmJV.patchValue({ voucherDate: new Date(), periodId: this.periodId });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.narration.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcJV.getVouchers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Journal Voucher", this.colSearch, r);
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
    this.frmJV.controls.voucherNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.voucherNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmJV.enable();
    this.frmJV.controls.voucherNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.narration.nativeElement.focus();
    agFormHelper.setGridToolbar(false);
  }

  tbSave() {
    try {
      this.frmJV.markAllAsTouched();
      if (!this.frmJV.invalid) {
        var formData: JV = this.frmJV.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcJV.save(formData).subscribe(
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
    if (confirm('You are about to reverse Journal Voucher # ' + voucherNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcJV.reverse(voucherNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Journal Voucher # ' + voucherNo + ' reversed sucessfully!');
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
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'red' }
    },
    {
      headerName: "Credit", field: "credit", type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 100,
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
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
      this.svcToaster.showFailure(exception, 'Add Line:');
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

  setFooter() {
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
      this.svcJV.get(Id).subscribe(
        jv => {
          if (jv) {
            this.frmJV.disable();
            this.frmJV.controls['voucherNo'].setValue(jv.voucherNo);
            this.frmJV.controls['voucherDate'].setValue(new Date(jv.voucherDate));
            this.frmJV.controls['narration'].setValue(jv.narration);
            this.frmJV.controls['periodId'].setValue(jv.periodId);
            this.frmJV.controls['periodName'].setValue(jv.periodName);
            this.frmJV.controls['reversedVoucherNo'].setValue(jv.reversedVoucherNo);
            this.frmJV.controls['sourceVoucherNo'].setValue(jv.sourceVoucherNo);
            this.detailData = jv.details;
            this.footer = jv.footer;
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
      this.svcJV.getLookup().subscribe(
        data => {
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

  private validate(jv: JV) {
    this.errors = [];

    if (Object.keys(jv.details).length == 0) {
      this.errors.push('Atleast one entry must exist in JV detail to perform save operation');
    }
    if (jv.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    if (jv.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    var rn = this.goDetail.api.getPinnedBottomRow(0);
    if (rn.data.debit != rn.data.credit || rn.data.debit == 0 || rn.data.credit == 0) {
      this.errors.push('The total of Debit and Credit must match and non-zero.');
    }
  }

  private initForm() {
    this.frmJV.reset();
    this.frmJV.disable();
    this.errors = [];
    this.detailData = [];
    agFormHelper.setGridToolbar(false);
    this.footer = new agFooter();
    this.frmJV.patchValue({ voucherDate: new Date(), periodId: this.periodId });
  }
  //#endregion local functions
}
