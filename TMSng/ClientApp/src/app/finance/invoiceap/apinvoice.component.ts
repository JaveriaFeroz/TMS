import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { OutstandingSlipService } from '../../helper/outstandingslip/outstandingslip.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { APInvoice } from './apinvoice';
import { APInvoiceService } from './apinvoice.service';
import { APInvoiceDetail } from './apinvoicedetail';

@Component({
  selector: 'app-apinvoice',
  templateUrl: './apinvoice.component.html',
  styleUrls: ['./apinvoice.component.css']
})

export class APInvoiceComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  optionName: string = 'Purchase Invoice';
  readonly colSearch =
    [
      { headerName: 'PIV #', field: 'pivNo', },
      { headerName: 'PIV Date', field: 'pivDate' },
      { headerName: 'Supplier Name', field: 'supplierName' },
      { headerName: 'Supplier Inv #', field: 'supplierInvNo' },
      { headerName: 'Amount', field: 'Amount' },
      { headerName: 'Period', field: 'periodName' },
      { headerName: 'Source PIV #', field: 'sourcePIVNo' },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Created On', field: 'createdOn' },
    ];
  frmPIV: any;
  detailData: APInvoiceDetail[];
  lstSupplier: any;
  lstPeriod: any;
  periodId: number;
  fuelExpACId: number;
  apId: number;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('supplierId', { static: true }) supplierId: MatSelect;
  @ViewChild('pivNo', { static: true }) pivNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcPIV: APInvoiceService, private svcToaster: agToasterService, private Enum: AgilityEnum,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private svcOSSlip: OutstandingSlipService) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.apPeriodId();
    this.fuelExpACId = agFormHelper.fuelExpACId();
    this.apId = agFormHelper.apId();
  }

  ngOnInit() {
    this.frmPIV = this.formbulider.group({
      pivNo: [null, [Validators.required]],
      pivDate: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      supplierInvNo: [null, [Validators.required]],
      supplierInvDate: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      narration: [null],
      periodId: [null, [Validators.required]],
      periodName: [null],
      reversedPIVNo: [null],
      sourcePIVNo: [null],
      hasSlip: [null],
      slipDateFrom: [null],
      slipDateTo: [null]
    });
    this.frmPIV.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmPIV.reset();
    this.frmPIV.enable();
    this.frmPIV.controls.pivNo.disable();
    this.frmPIV.patchValue({ pivDate: new Date(), supplierInvDate: new Date(), periodId: this.periodId, hasSlip: false });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.goDetail.api.applyTransaction({
      add: [{
        accountId: this.apId, branchId: null, departmentId: null, debit: 0, credit: 0, description: null, readOnly: true
      }]
    });
    this.supplierId.focus();
    agFormHelper.setGridToolbar(true);
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcPIV.getPIVs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Payment Invoice", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.pivNo);
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
    this.frmPIV.controls.pivNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.pivNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmPIV.enable();
    this.frmPIV.controls.pivNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmPIV.controls.hasSlip.disable();
    agFormHelper.setGridToolbar(false);
    if (this.frmPIV.controls['hasSlip'].value) {
      (<HTMLInputElement>document.getElementById("btnSlip")).disabled = false;
    }
    this.frmPIV.controls.supplierId.disable();
  }

  tbSave() {
    try {
      this.frmPIV.markAllAsTouched();
      if (!this.frmPIV.invalid) {
        var formData: APInvoice = this.frmPIV.getRawValue();
        formData.details = this.getDetailFromGrid();
        if (formData.hasSlip) {
          formData.slips = JSON.parse(sessionStorage.getItem("slips"));
        }
        else {
          formData.slips = [];
        }
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcPIV.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Purchase Invoice saved Successfully');
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

  tbReverse(pivNo: string) {
    if (confirm('You are about to reverse Purchase Invoice # ' + pivNo + '. Are you sure you want to reverse this transaction?')) {
      this.svcWaitDlg.open({});
      this.svcPIV.reverse(pivNo).subscribe(
        () => {
          this.svcToaster.showSuccess('Purchase Invoice # ' + pivNo + ' reversed sucessfully!');
          this.initForm();
          agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
  }

  tbSlip(): void {
    try {
      if (!this.frmPIV.controls['supplierId'].value) {
        this.svcToaster.showFailure('Please select valid supplier before hitting slip button', 'Supplier missing');
      }
      else if (!this.frmPIV.controls['slipDateFrom'].value || !this.frmPIV.controls['slipDateTo'].value) {
        this.svcToaster.showFailure('Please select valid slip Date From & To before hitting slip button', 'Slip Date missing');
      }
      else if (this.frmPIV.controls['slipDateFrom'].value > this.frmPIV.controls['slipDateTo'].value) {
        this.svcToaster.showFailure('Date From must always be older or same as Date To', 'Invalid Date Range');
      }
      else {
        this.svcWaitDlg.open({});
        this.svcOSSlip.open(this.frmPIV.controls['supplierId'].value, this.frmPIV.controls['pivNo'].value,
          this.frmPIV.controls['slipDateFrom'].value, this.frmPIV.controls['slipDateTo'].value);
        this.svcOSSlip.selected().subscribe(total => {
          if (total) {
            if (total > 0) {
              this.frmPIV.controls.supplierId.disable();
              this.frmPIV.controls.hasSlip.disable();
              this.frmPIV.controls.slipDateFrom.disable();
              this.frmPIV.controls.slipDateTo.disable();
              this.frmPIV.controls['amount'].setValue(Math.abs(total));
              var fuelId: number = this.fuelExpACId, fuelNode;
              this.goDetail.api.forEachNode(function (rowNode, index) {
                if (rowNode.data.accountId == fuelId && rowNode.data.readOnly) { fuelNode = rowNode }
              });
              if (fuelNode) {
                fuelNode.setDataValue("debit", total);
                fuelNode.setDataValue("credit", 0);
              }
              else {
                this.goDetail.api.applyTransaction({
                  add: [{
                    accountId: this.fuelExpACId, departmentId: null, branchId: null, clientId: null, debit: total, credit: 0, description: null, readOnly: true
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
    catch (e) { this.svcOSSlip.close(); this.svcToaster.showFailure(e); }
    finally { this.svcWaitDlg.close(); }
  }
  //#endregion toolbar functions

  //#region grid setup
  //#region PIV Detail Grid Definition & functions
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

  private setFooter() {
    try {
      let _debit = 0, _credit = 0, _delta = 0, apNode, apId: number = this.apId;
      this.goDetail.api.forEachNode(function (rowNode, index) {
        if (rowNode.data.accountId != undefined) { _debit += rowNode.data.debit, _credit += rowNode.data.credit }
        if (rowNode.data.accountId == apId) { apNode = rowNode }
      });
      if (apNode) {
        _delta = _debit - _credit - apNode.data.debit + apNode.data.credit
        apNode.setDataValue("debit", _delta < 0 ? Math.abs(_delta) : 0);
        apNode.setDataValue("credit", _delta > 0 ? _delta : 0);
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
  //#endregion

  //#region local functions
  get(Id: string) {
    if (Id) {
      this.svcWaitDlg.open({});
      try {
        this.svcPIV.get(Id).subscribe(
          ia => {
            if (ia) {
              this.frmPIV.disable();
              this.frmPIV.controls['pivNo'].setValue(ia.pivNo);
              this.frmPIV.controls['pivDate'].setValue(new Date(ia.pivDate));
              this.frmPIV.controls['supplierId'].setValue(ia.supplierId);
              this.frmPIV.controls['supplierInvNo'].setValue(ia.supplierInvNo);
              this.frmPIV.controls['supplierInvDate'].setValue(new Date(ia.supplierInvDate));
              this.frmPIV.controls['narration'].setValue(ia.narration);
              this.frmPIV.controls['amount'].setValue(ia.amount);
              this.frmPIV.controls['reversedPIVNo'].setValue(ia.reversedPIVNo);
              this.frmPIV.controls['sourcePIVNo'].setValue(ia.sourcePIVNo);
              this.frmPIV.controls['periodId'].setValue(ia.periodId);
              this.frmPIV.controls['periodName'].setValue(ia.periodName);
              this.frmPIV.controls['hasSlip'].setValue(ia.hasSlip);
              this.frmPIV.controls['slipDateFrom'].setValue(ia.slipDateFrom);
              this.frmPIV.controls['slipDateTo'].setValue(ia.slipDateTo);
              this.detailData = ia.details;
              if (ia.hasSlip) {
                sessionStorage.setItem("slips", JSON.stringify(ia.slips));
              }
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
  }

  private loadLookup() {
    try {
      this.svcPIV.getLookup().subscribe(
        data => {
          this.lstSupplier = data.lstSupplier;
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

  private validate(piv: APInvoice) {
    this.errors = [];
    if (Object.keys(piv.details).length == 0) {
      this.errors.push('Atleast one entry must exist in AP Invoice detail to perform save operation');
    }
    else if (piv.details.some(x => (x.debit == 0 && x.credit == 0) || (x.debit != 0 && x.credit != 0))) {
      this.errors.push('One of Debit and Credit must be non-zero in each row of Grid.');
    }
    else if (piv.details.some(x => x.debit < 0 || x.credit < 0)) {
      this.errors.push('None of Debit & Credit value could be less than zero');
    }
    let debit: number = 0;
    piv.details.forEach(a => debit += a.debit);

    if (debit != piv.amount) {
      this.errors.push('The total of Debit / Credit entry in Invoice detail must match Supplier Invoice Amount');
    }
  }

  grdDetailCellValueChanged(params) {
    if (!params.data.readOnly && (params.column.getId() === "credit" || params.column.getId()=== "debit")) {
      this.setFooter();
    }
  }

  private initForm() {
    this.frmPIV.reset();
    this.frmPIV.disable();
    this.errors = [];
    this.detailData = [];
    sessionStorage.removeItem("slips");
    agFormHelper.setGridToolbar(false);
    this.frmPIV.patchValue({ pivDate: new Date(), supplierInvDate: new Date(), periodId: this.periodId });
    this.footer = new agFooter();
  }
  //#endregion local functions
}
