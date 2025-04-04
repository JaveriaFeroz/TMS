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
import { GRN } from './grn';
import { GRNService } from './grn.service';
import { GRNDetail } from './grndetail';

@Component({  
  selector: 'app-grn',  
  templateUrl: './grn.component.html',  
  styleUrls: ['./grn.component.css']  
})

export class GRNComponent implements OnInit {
  //#region form variables
  public goGRN: GridOptions;
  readonly optionName: string = 'Goods Receipt note';
  frmGRN: any;
  grnData: GRNDetail[];
  lstGRNType: any;
  lstSupplier: any;
  lstMoP: any;
  lstBranch: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('grnNo', { static: true }) grnNo: ElementRef;
  @ViewChild('branchId', { static: true }) branchId: MatSelect;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder, private svcSearchDlg: SearchDialogService,
    private svcGRN: GRNService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService)
  {
    this.initGrid();
    this.loadLookup();
  }

  ngOnInit() {
    this.frmGRN = this.formbulider.group({
      grnNo: [null, [Validators.required]],
      grnId: [null],
      grnDate: [null, [Validators.required]],
      grnTypeId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      moPId: [null, [Validators.required]],
      refNo: [null],
      refDate: [null],
      poNo: [null, [Validators.required]],
    });
    this.frmGRN.disable();
    this.frmGRN.controls.poNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    agFormHelper.setFormSearch(true);
    (<HTMLButtonElement>document.getElementById("tbPOSearch")).disabled = true;
  }

  //ngAfterViewInit() {
  //  //it is necessary to disable save button as due to ngIf it remains active otherwise
  //  (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  //}

  //#region toolbar functions
  tbAdd() {
    this.frmGRN.reset();
    this.frmGRN.enable();
    this.frmGRN.controls.grnNo.disable();
    this.frmGRN.controls.poNo.disable();
    this.frmGRN.patchValue({ grnDate: new Date() });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    (<HTMLButtonElement>document.getElementById("tbPOSearch")).disabled = false;
    this.branchId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmGRN.controls.grnNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.grnNo.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      var searchCols =
        [
          { headerName: 'GRN #', field: 'grnNo', width: 100 },
          { headerName: 'Date', field: 'grnDate', width: 70 },
          { headerName: 'PO #', field: 'poNo', width: 70 },
          { headerName: 'Branch', field: 'branchName' },
          { headerName: 'Supplier', field: 'supplierName' }
        ];
      this.svcGRN.getGRNs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select GRN", searchCols, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.grnNo);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbPOSearch(): void {
    try {
      var poSearchCols =
        [
          { headerName: 'PO #', field: 'poNo', width: 70 },
          { headerName: 'PODate', field: 'poDate', width: 90 },
          { headerName: 'PRNo', field: 'prNo', width: 90 },
          { headerName: 'Branch', field: 'branchName' },
          { headerName: 'Supplier', field: 'supplierName' }
        ];
      this.svcWaitDlg.open({});
      this.svcGRN.getPOs().subscribe(r => {
        this.svcSearchDlg.open("Search & Select PO for GRN", poSearchCols, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.getPODetails(r.poNo);
            if (this.grnData.length != 0) {
              this.frmGRN.controls.poNo.disable();
              agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
              agFormHelper.setFormSearch(false);
            }
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmGRN.enable();
    this.frmGRN.controls.grnId.disable();
    this.frmGRN.controls.poNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    (<HTMLButtonElement>document.getElementById("tbPOSearch")).disabled = true;
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.branchId.focus();
  }

  tbSave() {
    try {
      this.frmGRN.markAllAsTouched();
      if (!this.frmGRN.invalid) {
        var formData: GRN = this.frmGRN.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        else {
          this.svcWaitDlg.open({});
          this.svcGRN.save(formData).subscribe(
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
    sessionStorage.removeItem("lstProduct");
    sessionStorage.removeItem("lstUOM");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  private initGrid() {
    this.goGRN = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'blue', 'background-color': 'lightgray' };
        }
      },
      onRowDataChanged: () => { this.setGRNFooter(); }
    };
  }

  colGRN = [
    {
      headerName: 'GRN Detail',
      children:
        [
          {
            headerName: "Product", field: "productName", width: 230, editable: false, pinned: 'left', lockPinned: true
          },
          {
            headerName: "UoM", field: "uoMName", width: 70, editable: false, pinned: 'left', lockPinned: true
          },
          {
            headerName: "Qty", field: "quantity", type: "numericColumn", width: 70,
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter', valueParser: agGridHelper.numberValueParser
          },
          {
            headerName: "Price", field: "price", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 80, editable: false
          },
          {
            headerName: "Amount", field: "amount", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
            valueParser: agGridHelper.numberValueParser, width: 90, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
            valueGetter: function aPlusBValueGetter(params) {
              if (params.node.rowPinned) return params.data.amount;
              else
              return params.data.quantity * params.data.price;
            }
          },
          {
            headerName: "GST%", field: "gstRate", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
            valueParser: agGridHelper.numberValueParser, width: 80, editable: false
          },
          {
            headerName: "Disc%", field: "discRate", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
            valueParser: agGridHelper.numberValueParser, width: 80, editable: false
          },
          {
            headerName: "GST Amt", field: "gstAmount", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
            valueParser: agGridHelper.numberValueParser, width: 90, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
            valueGetter: function aPlusBValueGetter(params) {
              if (params.node.rowPinned) return params.data.gstAmount;
              else
              return +((params.data.quantity * params.data.price) * (params.data.gstRate / 100)).toFixed(2);
            }
          },
          {
            headerName: "Disc Amt", field: "discAmount", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
            valueParser: agGridHelper.numberValueParser, width: 90, editable: false, cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
            valueGetter: function aPlusBValueGetter(params) {
              if (params.node.rowPinned) return params.data.discAmount;
              else
              return (params.data.quantity * params.data.price) * (params.data.discRate / 100);
            }
          },
          {
            headerName: "Narration", field: "narration", width: 100, cellEditor: "agLargeTextCellEditor"
          },
          {
            headerName: "Net Amount", field: "netAmount", type: "numericColumn",
            valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter',
            valueParser: agGridHelper.numberValueParser, width: 120, editable: false, lockPinned: true, pinned: 'right',
            cellStyle: { backgroundColor: '#c0c0c0', color: 'blue' },
            valueGetter: function aPlusBValueGetter(params) {
              if (params.node.rowPinned) return params.data.netAmount;
              else
              return (params.data.quantity * params.data.price) + (params.data.quantity * params.data.price) * (params.data.gstRate / 100) - (params.data.quantity * params.data.price) * (params.data.discRate / 100);
            }
          },
          { headerName: "ProductId", field: "productId", hide: true, suppressColumnsToolPanel: true },
          { headerName: "UomId", field: "uomId", hide: true, suppressColumnsToolPanel: true },
        ]
    }
  ];

  onDeleteLine () {
    try {
      if (confirm("Are you sure you want to Delete selected row?")) {
        const selectedRow = this.goGRN.api.getFocusedCell();
        if (selectedRow) {
          var rowNode = this.goGRN.api.getRowNode(selectedRow.rowIndex.toString());
          this.goGRN.api.selectNode(rowNode);
          this.goGRN.api.applyTransaction({ remove: this.goGRN.api.getSelectedRows() });
        }
        else
          this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
      }
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  private getDetailFromGrid() {
    let rowData = [];
    this.goGRN.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcGRN.get(Id).subscribe(
        grn => {
          if (grn) {
            this.frmGRN.disable();
            this.frmGRN.controls['grnNo'].setValue(grn.grnNo);
            this.frmGRN.controls['grnId'].setValue(grn.grnId);
            this.frmGRN.controls['grnDate'].setValue(grn.grnDate);
            this.frmGRN.controls['grnTypeId'].setValue(grn.grnTypeId);
            this.frmGRN.controls['branchId'].setValue(grn.branchId);
            this.frmGRN.controls['supplierId'].setValue(grn.supplierId);
            this.frmGRN.controls['refNo'].setValue(grn.refNo);
            this.frmGRN.controls['refDate'].setValue(grn.refDate);
            this.frmGRN.controls['moPId'].setValue(grn.moPId);
            this.frmGRN.controls['poNo'].setValue(grn.poNo);
            this.grnData = grn.details;
            this.footer = grn.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
            this.setGRNFooter();
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  onGRNCellValueChanged(params) {
    if (params.column.getId() === "quantity") {
      this.setGRNFooter();
    }
  }

  private getPODetails(poId: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcGRN.getPODetails(poId).subscribe(
        grn => {
          if (grn) {
            this.frmGRN.controls['poNo'].setValue(poId);
            this.frmGRN.controls['branchId'].setValue(grn.branchId);
            this.frmGRN.controls['supplierId'].setValue(grn.supplierId);
            this.frmGRN.controls['grnTypeId'].setValue(grn.grnTypeId);
            this.frmGRN.controls['moPId'].setValue(grn.moPId);
            this.grnData = grn.details;
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
      this.svcGRN.getLookup().subscribe(
        data => {
          this.lstBranch = data.lstBranch;
          this.lstSupplier = data.lstSupplier;
          this.lstMoP = data.lstMoP;
          this.lstGRNType = data.lstGRNType;
          sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));
          sessionStorage.setItem("lstUOM", JSON.stringify(data.lstUom));
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

  private setGRNFooter() {
    try {
      let _amount:number = 0, _discamount:number = 0, _gstamount:number = 0, _netamount:number = 0;
      this.goGRN.api.forEachNode(function (rowNode, index) {
        if (!rowNode.data.delete) {
          _amount += rowNode.data.quantity * rowNode.data.price;
          _discamount += _amount * (rowNode.data.discRate / 100);
          _gstamount += +(_amount * (rowNode.data.gstRate / 100)).toFixed(2);
          _netamount += _amount + _gstamount - _discamount;
        }
      });
      this.goGRN.api.setPinnedBottomRowData([{ amount: _amount, discAmount: _discamount, gstAmount: _gstamount, netAmount: _netamount }]);
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  private validate(grn: GRN) {
    this.errors = [];
    if (Object.keys(grn.details).length == 0) {
      this.errors.push('At least one product must exist in GRN to perform save operation');
    }
    else if (grn.details.some(x => x.quantity <= 0)) {
      this.errors.push('No row in GRN can contain zero or -ve quantity');
    }       
  }

  private initForm() {
    this.frmGRN.reset();
    this.frmGRN.disable();
    this.errors = [];
    this.grnData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    (<HTMLButtonElement>document.getElementById("tbPOSearch")).disabled = true;
    this.footer = new agFooter();
  }
  //#endregion local functions
}
