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
import { ExpenseReImbursement } from './expensereimbursement';
import { ExpenseReImbursementService } from './expensereimbursement.service';
import { ExpenseReImbursementDetail } from './expensereimbursementdetail';

@Component({
  selector: 'app-expensereimbursement',
  templateUrl: './expensereimbursement.component.html',
  styleUrls: ['./expensereimbursement.component.css']
})

export class ExpenseReImbursementComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  readonly optionName: string = 'Expense Reimbursement';
  readonly colSearch =
    [
      { headerName: 'Request #', field: 'requestId' },
      { headerName: 'Branch Name', field: 'branchName' },
      { headerName: 'Period From', field: 'periodFromName' },
      { headerName: 'Period To', field: 'periodToName' },
      //{ headerName: 'Status', field: 'status' },
    ];
  frmER: any;
  detailData: any[];
  lstBranch: any;
  lstPeriod: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('branchId', { static: true }) branchId: MatSelect;
  @ViewChild('requestId', { static: true }) requestId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcExpReimburse: ExpenseReImbursementService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
      this.frmER = this.formbulider.group({
      requestId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      periodFromId: [null, [Validators.required]],
      periodToId: [null, [Validators.required]],
      //Closed: [null],
      //Status: [null],
    });
    this.frmER.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.setLoadButton(true);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmER.reset();
    this.frmER.enable();
    this.frmER.controls.requestId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.setLoadButton(false);
    this.branchId.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcExpReimburse.getReimbursements().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Expense ReImbursement", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.requestId);
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
    this.frmER.controls.requestId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.requestId.nativeElement.focus();
  }

  tbEdit() {
    this.frmER.enable();
    this.frmER.controls.requestId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.branchId.focus();
    this.setLoadButton(true);
  }

  tbLoad() {
    try {
      if (!this.frmER.controls.branchId.value || !this.frmER.controls.periodFromId.value || !this.frmER.controls.periodToId.value) {
        this.svcToaster.showWarning("Please select valid Branch & Period Range before loading corresponding expenses for reimbursement", "Mandatory Parameters missing");
        return;
      }
      this.frmER.markAllAsTouched();
      this.svcWaitDlg.open({});
      this.svcExpReimburse.load(this.frmER.controls.branchId.value, this.frmER.controls.periodFromId.value,
        this.frmER.controls.periodToId.value).subscribe(erd => {
          if (erd.length != 0) {
            this.detailData = erd;
            this.setLoadButton(true);
          }
          else { this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record'); }
        },
          error => {
            this.svcToaster.showFailure(error);
          },
          () => { this.svcWaitDlg.close(); });
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  tbSave() {
    try {
      this.frmER.markAllAsTouched();
      if (!this.frmER.invalid) {
        var formData: ExpenseReImbursement = this.frmER.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcExpReimburse.save(formData).subscribe(
            data => {
              this.svcToaster.showSuccess('ReImbursement Request # ' + data.requestId + ' saved successfully.!');
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
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

  //tbClose(requestId: number) {
  //  if (!this.frmER.invalid) {
  //    this.svcWaitDlg.open({});
  //    this.svcExpReimburse.close(requestId).subscribe(
  //      () => {
  //        this.initForm();
  //        agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  //        this.svcToaster.showSuccess('Expense Reimbursement #  ' + requestId +
  //          ' successfully closed in the system.');
  //      },
  //      error => { this.svcToaster.showFailure(error); },
  //      () => { this.svcWaitDlg.close(); }
  //    );
  //  }
  //}
  //#endregion toolbar functions

  //#region grid setup
  //#region Expense ReImbursement Grid Definition & functions
  colDetail = [
    { headerName: 'Rwb #', field: 'rwbNo', width: 120, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true },
    { headerName: 'Job #', field: 'jobNo', width: 100 },
    { headerName: 'Route', field: 'routeName', width: 100 },
    { headerName: 'Asset #', field: 'assetNo', width: 80 },
    { headerName: 'Client', field: 'clientName', width: 150 },
    { headerName: 'Supplier', field: 'supplierName', width: 150 },
    { headerName: 'FuelAvg', field: 'fuelAvg', width: 80 },
    { headerName: 'Depature', field: 'depatureDateTime', width: 120 },
    { headerName: 'Arrival', field: 'arrivalDateTime', width: 120 },
    { headerName: 'Job Closure', field: 'jobClosureDateTime', width: 120 },
    { headerName: "Period", field: "periodName", width: 100 },
    {
      headerName: 'Amount', field: 'amount', width: 80, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, type: "numericColumn", pinned: 'right', lockPinned: true,
      cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' } },
    { headerName: 'RwbId', field: 'rwbId', hide: true, suppressColumnsToolPanel: true },
  ];

  getDetailFromGrid(): ExpenseReImbursementDetail[] {
    let rowData: ExpenseReImbursementDetail[] = [];
    this.goDetail.api.getSelectedNodes().forEach(node => rowData.push(node.data));
    return rowData;
  }

  private setFooter() {
    try {
      let _amount = 0;
      if (this.requestId.nativeElement.value) {
        this.goDetail.api.forEachNode(function (rowNode, index) {
          _amount += rowNode.data.amount;
        });
      }
      else {
        this.goDetail.api.getSelectedNodes().forEach(function (rowNode, index) {
          _amount += rowNode.data.amount;
        });
      }
      this.goDetail.api.setPinnedBottomRowData([{
        clientName: "Total", amount: _amount
      }]);
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
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      suppressRowClickSelection: true,
      rowSelection: 'multiple',
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
        }
      },
      onSelectionChanged: () => { this.setFooter(); },
      onCellClicked: function (event) {
        if (event.colDef.field == "selected") {
          if (!event.data.selected) {
            event.node.setDataValue('selected', true);
          }
          else {
            event.node.setDataValue('selected', false);
          }
        }
      },
      onRowDataChanged: () => { this.setFooter(); }
    };
  }
  //#endregion

  //#region local functions
  public get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcExpReimburse.get(Id).subscribe(
        er => {
          if (er) {
            this.frmER.disable();
            this.frmER.controls['requestId'].setValue(er.requestId);
            this.frmER.controls['branchId'].setValue(er.branchId);
            this.frmER.controls['periodFromId'].setValue(er.periodFromId);
            this.frmER.controls['periodToId'].setValue(er.periodToId);
            this.detailData = er.details;
            this.footer = er.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setFooter();
          }
          else { this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcExpReimburse.getLookups().subscribe(
        data => {
          this.lstBranch = data.lstBranch;
          this.lstPeriod = data.lstPeriod;
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

  private validate(er: ExpenseReImbursement) {
    this.errors = [];
    if (!er.branchId) {
      this.errors.push('Branch is a mandatory field');
    }
    if (!er.periodFromId || !er.periodToId) {
      this.errors.push('Period range selection is mandatory');
    }

    if (this.goDetail.api.getSelectedNodes().length < 1)
      this.errors.push('Atleast 1 RWB must be selected to create Expense Reimbursement Request!');
  }

  private setLoadButton(disabled: boolean) {
    if (document.getElementById('btnLoad') as HTMLInputElement != null) {
      (<HTMLInputElement>document.getElementById("btnLoad")).disabled = disabled;
      if (disabled) {
        this.frmER.controls.branchId.disable();
        this.frmER.controls.periodFromId.disable();
        this.frmER.controls.periodToId.disable();
      }
      else {
        this.frmER.controls.branchId.enable();
        this.frmER.controls.periodFromId.enable();
        this.frmER.controls.periodToId.enable();
      }
    }
  }

  private initForm() {
    this.frmER.reset();
    this.frmER.disable();
    this.errors = [];
    this.detailData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
