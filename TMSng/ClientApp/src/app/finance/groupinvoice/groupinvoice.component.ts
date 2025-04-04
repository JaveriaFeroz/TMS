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
import { GroupInvoice } from './groupinvoice';
import { GroupInvoiceService } from './groupinvoice.service';
import { GroupInvoiceDetail } from './groupinvoicedetail';

@Component({
  selector: 'app-groupinvoice',
  templateUrl: './groupinvoice.component.html',
  styleUrls: ['./groupinvoice.component.css']
})

export class GroupInvoiceComponent implements OnInit {
  //#region form variables
  public goDetail: GridOptions;
  readonly optionName: string = 'Group Invoice';
  readonly colSearch =
    [
      { headerName: 'Group Invoice #', field: 'groupInvoiceNo',  },
      { headerName: 'Invoice Date', field: 'invoiceDate' },
      { headerName: 'Client Name', field: 'clientName' },
    ];
  frmGI: any;
  detailData: any[]; 
  lstClient: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('clientId', { static: true }) clientId: MatSelect;
  @ViewChild('groupInvoiceNo', { static: true }) groupInvoiceNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcGroupInvoice: GroupInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmGI = this.formbulider.group({
      groupInvoiceNo: [null, [Validators.required]],
      invoiceDate: [null, [Validators.required]],
      clientId: [null, [Validators.required]]
    });
    this.frmGI.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.setLoadButton(true);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmGI.reset();
    this.frmGI.enable();
    this.frmGI.controls.groupInvoiceNo.disable();
    this.frmGI.patchValue({ invoiceDate: new Date()});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.setLoadButton(false);
    this.clientId.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcGroupInvoice.getInvoices().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Group Invoice", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.groupInvoiceNo);
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
    this.frmGI.controls.groupInvoiceNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.groupInvoiceNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmGI.enable();
    this.frmGI.controls.groupInvoiceNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.setLoadButton(true);
    this.clientId.focus();
  }

  tbLoad() {
    try {
      if (!this.frmGI.controls.clientId.value) {
        this.svcToaster.showWarning("Please select valid customer before loading corresponding invoices for grouping", "Client Mandatory");
        return;
      }
      this.frmGI.markAllAsTouched();
      this.svcWaitDlg.open({});
      this.svcGroupInvoice.load(this.frmGI.controls.clientId.value).subscribe(gid => {
        if (gid.length != 0) {
          this.detailData = gid;
          this.setLoadButton(true);
        }
        else { this.svcToaster.showWarning('No record found with your provided key or you don`t have access to this record'); }
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
      this.frmGI.markAllAsTouched();
      if (!this.frmGI.invalid) {
        var formData: GroupInvoice = this.frmGI.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcGroupInvoice.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Group Invoice generated successfully!');
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
  //#region group invoice Grid Definition & functions
  colDetail = [
    { headerName: "Invoice #", field: "invoiceNo", width: 130, headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true },
    { headerName: "Invoice Date", field: "invoiceDate", width: 120 },
    { headerName: "Invoice Type", field: "workFlowName", width: 180 },
    { headerName: "Net Amount", field: "amount", width: 120, valueFormatter: agGridHelper.formatNumbers,
      valueParser: agGridHelper.numberValueParser, type: "numericColumn", pinned: 'right', lockPinned: true,
      cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' }
    }
  ]; 

  getDetailFromGrid(): GroupInvoiceDetail[] {
    let rowData: GroupInvoiceDetail[] = [];
    this.goDetail.api.getSelectedNodes().forEach(node => rowData.push(node.data));
    return rowData;
  }

  private setFooter() {
    try {
      let _amount = 0;
      if (this.groupInvoiceNo.nativeElement.value) {
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
        workFlowName: "Total", amount: _amount
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
      onSelectionChanged: () => { this.setFooter();},
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

  //grdDetailCellValueChanged(params) {
  //  if (params.column.getId() === "selected") {
  //    this.setFooter();
  //  }
  //}
  //#endregion

  //#region local functions
  get(Id: string) {
    this.svcWaitDlg.open({});
    try {
      this.svcGroupInvoice.get(Id).subscribe(
        ia => {
          if (ia) {
            this.frmGI.disable();
            this.frmGI.controls['groupInvoiceNo'].setValue(ia.groupInvoiceNo);
            this.frmGI.controls['invoiceDate'].setValue(ia.invoiceDate);           
            this.frmGI.controls['clientId'].setValue(ia.clientId);          
            this.detailData = ia.details;
            this.footer = ia.footer;
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
      this.svcGroupInvoice.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
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

  private validate(gi: GroupInvoice) {
    this.errors = [];
    if (this.goDetail.api.getSelectedNodes().length < 2)
      this.errors.push('Atleast 2 invoices must be selected to create group invoice');
  }

  private setLoadButton(disabled: boolean) {
    if (document.getElementById('btnLoad') as HTMLInputElement != null) {
      (<HTMLInputElement>document.getElementById("btnLoad")).disabled = disabled;
      if (disabled)
        this.frmGI.controls.clientId.disable();
      else
        this.frmGI.controls.clientId.enable();
    }
  }

  private initForm() {
    this.frmGI.reset();
    this.frmGI.disable();
    this.errors = [];
    this.detailData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
