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
import { FuelPaymentRequest } from './fuelpaymentrequest';
import { FuelPaymentRequestService } from './fuelpaymentrequest.service';
import { FuelPaymentRequestDetail } from './fuelpaymentrequestdetail';

@Component({
  selector: 'app-fuelpaymentrequest',
  templateUrl: './fuelpaymentrequest.component.html',
  styleUrls: ['./fuelpaymentrequest.component.css']
})

export class FuelPaymentRequestComponent implements OnInit {
  //#region from variables
  public goDetail: GridOptions;
  readonly optionName: string = 'Fuel Payment Request';
  readonly colSearch =
    [
      { headerName: 'Request #', field: 'requestId' },
      { headerName: 'Date From', field: 'dateFrom' },
      { headerName: 'Date To', field: 'dateTo' },
      { headerName: 'Payment Method', field: 'paymentTypeName' },
      { headerName: 'Card Name', field: 'cardNo' },
      { headerName: 'Supplier Name', field: 'supplierName' },
    ];
  frmFP: any;
  detailData: any[];
  lstCard: any;
  lstSupplier: any;
  minDate = new Date(new Date().getDate() - 364);
  maxDate = new Date();
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('supplierId', { static: true }) supplierId: MatSelect;
  @ViewChild('cardId', { static: true }) cardId: MatSelect;
  @ViewChild('requestId', { static: true }) requestId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcFuelPayment: FuelPaymentRequestService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmFP = this.formbulider.group({
      requestId: [null],
      dateFrom: [null, [Validators.required]],
      dateTo: [null, [Validators.required]],
      supplierId: [null],
      isCardPayment: [false, [Validators.required]], 
      cardId: [null],
      //Closed: [null],
      //Status: [null],
    });
    this.frmFP.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.setLoadButton(true);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmFP.reset();
    this.frmFP.enable();
    this.frmFP.controls.requestId.disable();
    this.frmFP.patchValue({ isCardPayment: false, dateFrom: new Date(), dateTo: new Date()  });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.setLoadButton(false);
    //this.supplierId.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcFuelPayment.getRequests().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Fuel Payment Request", this.colSearch, r);
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
    this.frmFP.controls.requestId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.requestId.nativeElement.focus();
  }

  tbEdit() {
    this.frmFP.enable();
    this.frmFP.controls.requestId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.setLoadButton(true);
  }

  tbLoad() {
    try {
      if (((this.frmFP.controls.isCardPayment.value == true && !this.frmFP.controls.cardId.value) ||
        (!this.frmFP.controls.isCardPayment.value && !this.frmFP.controls.supplierId.value)) || !this.frmFP.controls.dateFrom.value || !this.frmFP.controls.dateTo.value) {
        this.svcToaster.showWarning("Please select valid Parameters before loading corresponding Fuel Slip for Payment Request", "Mandatory Parameters missing");
        return;
      }
      else if (this.frmFP.controls.dateFrom.value > this.frmFP.controls.dateTo.value) {
        this.svcToaster.showFailure('Date From must always be older or equal to Date To. Please correct your Date range criteria and retry', 'Invalid Date Range');
        return;
      }
      this.frmFP.markAllAsTouched();
      this.svcWaitDlg.open({});
      //else {
      if (!this.frmFP.controls.isCardPayment.value) {
        this.svcFuelPayment.getSupplierPending(this.frmFP.controls.supplierId.value,
          this.frmFP.controls.dateFrom.value, this.frmFP.controls.dateTo.value).subscribe(fp => {
            if (fp.length != 0) {
              this.detailData = fp;
              this.setLoadButton(true);
            }
            else { this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record'); }
          },
            error => {
              this.svcToaster.showFailure(error);
            },
            () => { this.svcWaitDlg.close(); });
      }
      if (this.frmFP.controls.isCardPayment.value == true) {
        this.svcFuelPayment.getCardPending(this.frmFP.controls.cardId.value,
          this.frmFP.controls.dateFrom.value, this.frmFP.controls.dateTo.value).subscribe(fp => {
            if (fp.length != 0) {
              this.detailData = fp;
              this.setLoadButton(true);
            }
            else { this.svcToaster.showWarning('No record found with your provided parameters or you don`t have access to this record'); }
        },
            error => {
              this.svcToaster.showFailure(error);
            },
            () => { this.svcWaitDlg.close(); });
      }
    }
    catch (e) {
      this.svcToaster.showFailure(e); this.svcWaitDlg.close();
    }
  }

  tbSave() {
    try {
      this.frmFP.markAllAsTouched();
      if (!this.frmFP.invalid) {
        var formData: FuelPaymentRequest = this.frmFP.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcFuelPayment.save(formData).subscribe(
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
  //#endregion toolbar functions

  //#region grid setup
  //#region Fuel Payment Grid Definition & functions
  colDetail = [
    {
      headerName: "Slip #", field: "slipNo", width: 140,
        headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true
    },
    { headerName: 'Slip Date', field: 'slipDate', width: 100 },
    { headerName: 'Job #', field: 'jobNo', width: 100 },
    { headerName: 'Genset?', field: 'genset', width: 100 },
    { headerName: 'Asset #', field: 'assetNo', width: 100 },
    { headerName: 'Fuel Litre', field: 'litre', width: 100 , type: "numericColumn"},
    {
      headerName: 'Amount', field: 'amount', width: 100, type: "numericColumn",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser,
      pinned: 'right', lockPinned: true, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
    },
    { headerName: 'jobId', field: 'jobId', hide: true, suppressColumnsToolPanel: true },
    { headerName: 'slipId', field: 'slipId', hide: true, suppressColumnsToolPanel: true },
  ];

  getDetailFromGrid(): FuelPaymentRequestDetail[] {
    let rowData: FuelPaymentRequestDetail[] = [];
    this.goDetail.api.getSelectedNodes().forEach(node => rowData.push(node.data));
    return rowData;
  }

  private setFooter() {
    try {
      let _amount = 0, _litre = 0;
      if (this.requestId.nativeElement.value) {
        this.goDetail.api.forEachNode(function (rowNode, index) {
          _litre += rowNode.data.litre; _amount += rowNode.data.amount;
        });
      }
      else {
        this.goDetail.api.getSelectedNodes().forEach(function (rowNode, index) {
          _litre += rowNode.data.litre; _amount += rowNode.data.amount;
        });
      }
      this.goDetail.api.setPinnedBottomRowData([{
        clientName: "Total", litre: _litre, amount: _amount
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
      onRowDataChanged: () => { this.setFooter(); }
    };
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcFuelPayment.get(Id).subscribe(
        fp => {
          if (fp) {
            this.frmFP.disable();
            this.frmFP.controls['requestId'].setValue(fp.requestId);
            this.frmFP.controls['dateFrom'].setValue(fp.dateFrom);
            this.frmFP.controls['dateTo'].setValue(fp.dateTo);
            this.frmFP.controls['isCardPayment'].setValue(fp.isCardPayment);
            this.frmFP.controls['supplierId'].setValue(fp.supplierId);
            this.frmFP.controls['cardId'].setValue(fp.cardId);
            this.detailData = fp.details;
            this.footer = fp.footer;
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
      this.svcFuelPayment.getLookup().subscribe(
        data => {
          this.lstCard = data.lstCard;
          this.lstSupplier = data.lstSupplier;
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

  private validate(fp: FuelPaymentRequest) {
    this.errors = [];
    if (!fp.dateFrom || !fp.dateTo) {
      this.errors.push('Date range is mandatory');
    }
    if (!fp.isCardPayment && !fp.supplierId) {
      this.errors.push('Please select valid Supplier against which fuel payment request needs to be created');
    }
    if (fp.isCardPayment && !fp.cardId) {
      this.errors.push('Please select valid card against which fuel payment request needs to be created');
    }

    if (fp.dateFrom > fp.dateTo) {
      this.errors.push('Date From must always be older or equal to Date To. Please correct your Date range criteria and retry');
    }
    if (this.goDetail.api.getSelectedNodes().length < 1)
      this.errors.push('Atleast 1 RWB must be selected to create Expense Reimbursement Request!');
  }

  private setLoadButton(disabled: boolean) {
    if (document.getElementById('btnLoad') as HTMLInputElement != null) {
      (<HTMLInputElement>document.getElementById("btnLoad")).disabled = disabled;
      if (disabled) {
        this.frmFP.controls.isCardPayment.disable();
        if (this.frmFP.controls.isCardPayment.value == true)
          this.frmFP.controls.cardId.disable();
        else
          this.frmFP.controls.supplierId.disable();
        this.frmFP.controls.dateFrom.disable();
        this.frmFP.controls.dateTo.disable();
      }
      else {
        this.frmFP.controls.isCardPayment.enable();
        if (this.frmFP.controls.isCardPayment.value == true)
          this.frmFP.controls.cardId.enable();
        else
          this.frmFP.controls.supplierId.enable();        
        this.frmFP.controls.dateFrom.enable();
        this.frmFP.controls.dateTo.enable();
      }
    }
  }

  private initForm() {
    this.frmFP.reset();
    this.frmFP.disable();
    this.errors = [];
    this.detailData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
