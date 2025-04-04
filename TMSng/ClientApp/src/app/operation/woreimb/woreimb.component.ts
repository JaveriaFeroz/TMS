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
import { WOReImbursement } from './woreimb';
import { WOReImbService } from './woreimb.service';
import { WOReImbursementDetail } from './woreimbdetail';

@Component({
  selector: 'app-woreimb',
  templateUrl: './woreimb.component.html',
  styleUrls: ['./woreimb.component.css']
})

export class WOReImbComponent implements OnInit {
  //#region form variables
  public goWOReImb: GridOptions;
  readonly optionName: string = 'WO ReImbursement';
  readonly colSearch =
    [
      { headerName: 'Request #', field: 'requestId' },
      { headerName: 'Period From', field: 'periodFromName' },
      { headerName: 'Period To', field: 'periodToName' },
      { headerName: 'Branch Name', field: 'branchName' },
      { headerName: 'Supplier Name', field: 'supplierName' },
      { headerName: 'Lease Type', field: 'leaseTypeName' },
      { headerName: 'Status', field: 'stateName' },
    ];
  frmWOReImb: any;
  woReImbData: WOReImbursementDetail[];
  lstSupplier: any;
  lstBranch: any;
  lstDepartment: any;
  lstLeaseType: any;
  lstSubCategory: any;
  lstPeriod: any;
  periodId: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('supplierId', { static: true }) supplierId: MatSelect;
  @ViewChild('requestId', { static: true }) requestId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcWOReImb: WOReImbService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
    this.periodId = agFormHelper.opsPeriodId();
  }

  ngOnInit() {
    this.frmWOReImb = this.formbulider.group({
      requestId: [null, [Validators.required]],
      supplierId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
      leaseTypeId: [null, [Validators.required]],
      periodFromId: [null, [Validators.required]],
      periodToId: [null, [Validators.required]],
      subCategoryId: [null],
      closed: [null],
      status: [null],
      periodFromName: [null],
      periodToName: [null],
    });
    this.frmWOReImb.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmWOReImb.reset();
    this.frmWOReImb.enable();
    this.frmWOReImb.controls.requestId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmWOReImb.patchValue({ closed: false, status: 'Open' });
    this.frmWOReImb.controls.status.disable();
    this.frmWOReImb.patchValue({ periodFromId: this.periodId, periodToId: this.periodId });
    agFormHelper.setGridStatus(true);
    this.supplierId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmWOReImb.controls.requestId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.requestId.nativeElement.focus();
  } 

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcWOReImb.getReimbursements().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Work Order ReImbursement", this.colSearch, r);
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

  tbEdit() {
    this.frmWOReImb.enable();
    this.frmWOReImb.controls.requestId.disable();
    this.frmWOReImb.controls.supplierId.disable();
    this.frmWOReImb.controls.branchId.disable();
    this.frmWOReImb.controls.leaseTypeId.disable();
    this.frmWOReImb.controls.periodFromId.disable();
    this.frmWOReImb.controls.periodToId.disable();
    this.frmWOReImb.controls.subCategoryId.disable();
    this.frmWOReImb.controls.status.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridStatus(true);
    this.supplierId.focus();
  }

  tbLoad() {
    try {
      this.frmWOReImb.markAllAsTouched();
      var formData = this.frmWOReImb.getRawValue();
      if (formData.branchId == null || formData.supplierId == null || formData.leaseTypeId == null) {
      this.svcToaster.showFailure('Please select valid value for each parameter before hitting Load button');
      return;
      }
      else if (formData.leaseTypeId == 1 && formData.subCategoryId == null) {
      this.svcToaster.showFailure('Please select valid Sub Catagory before hitting Load button');
      return;
      }
      else if (formData.periodFromId > formData.periodToId) {
      this.svcToaster.showFailure('Period From must always be older or equal to Period To. Please correct your Period range criteria and retry');
      return;
    }
      else {
        if (formData.leaseTypeId != 1) {
          formData.subCategoryId = 0;
        }
        this.svcWOReImb.load(formData.branchId, formData.supplierId, formData.subCategoryId,
          formData.periodFromId, formData.periodToId, formData.leaseTypeId).subscribe(WOR => {
            if (WOR.length != 0) {
              this.woReImbData = WOR;
              this.frmWOReImb.controls.supplierId.disable();
              this.frmWOReImb.controls.branchId.disable();
              this.frmWOReImb.controls.leaseTypeId.disable();
              this.frmWOReImb.controls.periodFromId.disable();
              this.frmWOReImb.controls.periodToId.disable();
              this.frmWOReImb.controls.subCategoryId.disable();
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
          error => {
            this.svcToaster.showFailure(error);
          });
      }
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  tbSave() {
    this.frmWOReImb.markAllAsTouched();
    if (!this.frmWOReImb.invalid) {     
      var formData: WOReImbursement = this.frmWOReImb.getRawValue();
      formData.details = this.getDetailFromGrid();
      formData.footer = this.footer;
      this.validate(formData);
      if (this.errors.length > 0) { return; }
      else {
        this.svcWaitDlg.open({});
        this.svcWOReImb.save(formData).subscribe(
          data => {
            this.svcToaster.showSuccess('ReImbursement Request # ' + data.requestId +
              ' saved successfully. Press close button to finalize this ReImbursement request!');
            this.frmWOReImb.controls['requestId'].setValue(data.requestId);
            this.frmWOReImb.controls['status'].setValue('Saved');
            this.frmWOReImb.controls['closed'].setValue(0);
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }     
    }
  }

  tbClose(requestId: number) {  
    if (!this.frmWOReImb.invalid) {
      this.svcWaitDlg.open({});
      this.svcWOReImb.close(requestId).subscribe(
        () => {
          this.initForm();
          agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
          this.svcToaster.showSuccess('Work Order Reimbursement #  ' + requestId +
            ' successfully closed in the system.'); 
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
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

  //#region WO ReImbursement Grid Definition & functions
  colWOReImb = [
    {
      headerName: 'WO Detail',
      children: [
        {
          headerName: 'S', field: 'selected', width: 70, editable: false,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          cellRenderer: params => {
            if (params.value) {
              return "<input type='checkbox' checked />";
            }
            else {
              return "<input type='checkbox'/>";
            }
          },
          cellEditor: agGridHelper.getCellCheckBox()
        },
        { headerName: "Period", field: "periodName", editable: false, width: 70 },
        { headerName: 'WO #', field: 'woNo', editable: false, width: 100 },
        { headerName: 'Vehicle #', field: 'assetNo', editable: false, width: 80 },
        { headerName: 'WO Date', field: 'woDate', editable: false, width: 90 },
        { headerName: 'Category', field: 'categoryName', editable: false, width: 130 },
        { headerName: 'Close Date', field: 'woCloseDate', editable: false, width: 90 },
        { headerName: 'Amount', field: 'amount', editable: false, width: 120 },
        { headerName: 'Activity Detail', field: 'activityName', cellEditor: "agLargeTextCellEditor", editable: false, width: 500 },
        { headerName: 'woKey', field: 'woKey', hide: true, suppressColumnsToolPanel: true },
      ]
    }    
  ];

  getDetailFromGrid() {
    let rowData = [];
    this.goWOReImb.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  initGrid() {
    this.goWOReImb = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true,
        resizable: true,
        singleClickEdit: true
      },
      rowSelection: 'multiple',
      rowDeselection: true,
      onRowSelected: function (event) {
        if (event.node.isSelected()) {
            event.node.setDataValue('selected', true);
          }
        else {
            event.node.setDataValue('selected', false);
          }
      },
      onCellClicked: function (event) {
        if (event.colDef.field == "selected") {
          if (!event.data.selected) {
            event.node.setDataValue('selected', true);         
          }
          else {
            event.node.setDataValue('selected', false);
            event.node.setSelected(false);
          }
        }
      }      
    };
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcWOReImb.get(Id).subscribe(
        wor => {
          if (wor) {
            this.frmWOReImb.disable();
            this.frmWOReImb.controls['requestId'].setValue(wor.requestId);
            this.frmWOReImb.controls['supplierId'].setValue(wor.supplierId);
            this.frmWOReImb.controls['branchId'].setValue(wor.branchId);
            this.frmWOReImb.controls['periodFromId'].setValue(wor.periodFromId);
            this.frmWOReImb.controls['periodToId'].setValue(wor.periodToId);
            this.frmWOReImb.controls['subCategoryId'].setValue(wor.subCategoryId);
            this.frmWOReImb.controls['leaseTypeId'].setValue(wor.leaseTypeId);
            if (wor.closed == false) {
              this.frmWOReImb.controls['status'].setValue('Saved');
            }
            else {
              this.frmWOReImb.controls['status'].setValue('closed');
            }
          
            this.frmWOReImb.controls['closed'].setValue(wor.closed);
            this.woReImbData = wor.details;
            this.footer = wor.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridStatus(false);
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
      this.svcWOReImb.getLookup().subscribe(
        data => {
          this.lstBranch = data.lstBranch;
          this.lstSupplier = data.lstSupplier;
          this.lstSubCategory = data.lstSubCategory;
          this.lstLeaseType = data.lstLeaseType;
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

  private validate(wor: WOReImbursement) {
    this.errors = [];
    if (wor.closed == true) {
      this.errors.push('No further changes can be made to this Work order ReImbursement request while its status is Closed already.');
    }
    else if (wor.supplierId == null) {
      this.errors.push('Supplier selection is mandatory');
    }
    else if (wor.branchId == null) {
      this.errors.push('Branch selection is mandatory');
    }
    else if (wor.leaseTypeId != 2 && wor.subCategoryId == 0) {
      this.errors.push('Sub Category selection is mandatory');
    }
    else if (wor.periodFromId == 0) {
      this.errors.push('Period From selection is mandatory');
    }
    else if (wor.periodToId == 0) {
      this.errors.push('Period To selection is mandatory');
    }

    if (wor.details.length == wor.details.filter(x => !x.selected).length) {
      this.errors.push('Atleast one Work Order must be selected to save ReImbursement Request');
    }
  }

  private initForm() {
    this.frmWOReImb.reset();
    this.frmWOReImb.disable();
    this.errors = [];    
    this.woReImbData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
