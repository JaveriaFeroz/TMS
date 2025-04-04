import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InsPolicy } from './inspolicy';
import { InsPolicyService } from './inspolicy.service';
import { InsPolicyAsset } from './inspolicyasset';

@Component({
  selector: 'app-inspolicy',
  templateUrl: './inspolicy.component.html',
  styleUrls: ['./inspolicy.component.css']
})

export class InsPolicyComponent implements OnInit {
  //#region form variables
  public goAsset: GridOptions;
  readonly optionName: string = 'Insurance Policy';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'policyId', width: 70 },
      { headerName: 'Policy #', field: 'policyNo' },
      { headerName: 'Effective Date', field: 'fromDate', width: 80},
      { headerName: 'Expiry Date', field: 'toDate', width: 80 },
      { headerName: 'Company', field: 'insuranceCompanyName' },  
    ];
  frmInsPolicy: any;
  assetData: InsPolicyAsset[];
  lstInsuranceCompany: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('policyId', { static: true }) policyId: ElementRef;
  @ViewChild('policyNo', { static: true }) policyNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInsPolicy: InsPolicyService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmInsPolicy = this.formbulider.group({
      policyId: [null, [Validators.required]],
      policyNo: [null, [Validators.required]],
      fromDate: [null, [Validators.required]],
      toDate: [null, [Validators.required]],
      insCompanyId: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmInsPolicy.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInsPolicy.reset();
    this.frmInsPolicy.enable();
    this.frmInsPolicy.controls.policyId.disable();
    this.frmInsPolicy.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.policyNo.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmInsPolicy.controls.policyId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.policyId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInsPolicy.getPolicies().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Insurance Policy", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.policyId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInsPolicy.enable();
    this.frmInsPolicy.controls.policyId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.policyNo.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmInsPolicy.markAllAsTouched();
      if (!this.frmInsPolicy.invalid) {
        var formData: InsPolicy = this.frmInsPolicy.getRawValue();
        formData.assets = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcInsPolicy.save(formData).subscribe(
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
    sessionStorage.removeItem("lstAsset");
    this.router.navigate(['/MainForm']);
  }
  //#endregion

  //#region grid setup
  initGrid() {
    this.goAsset = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;  
        if (params.colDef.field == "assetId") {
          if (params.data.assetId != "") {
            params.node.setDataValue("assetId", parseInt(params.data.assetId));
          }
          else {
            params.node.setDataValue("assetId", null);
          }
        }
      },
    };
  }

  colAsset = [
    {
      headerName: 'Vehicle covered under this Policy',
      children:
        [
          {
            headerName: "Asset", field: "assetId", width: 80, cellEditor: agGridHelper.getAgilitySelect(),
            cellEditorParams: { source: 'Asset', class: "80" }, valueFormatter: agGridHelper.getAssetName
          },
          {
            headerName: "Remarks", field: "remarks", width: 320, cellEditor: "agLargeTextCellEditor"
          },
          { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ]
    }    
  ];

  onAddAssetLine   () {
    try {
      var res = this.goAsset.api.applyTransaction({
        add: [{
          assetId: null, remarks: null, add: true, edit: false, delete: false
        }]
      });
      this.goAsset.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "assetId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteAssetLine () {
    try {
      if (this.goAsset.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goAsset.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goAsset.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  private getDetailFromGrid() {
    let rowData = [];
    this.goAsset.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInsPolicy.get(Id).subscribe(
        inspolicy => {
          if (inspolicy) {
            this.frmInsPolicy.disable();
            this.frmInsPolicy.controls['policyId'].setValue(inspolicy.policyId);
            this.frmInsPolicy.controls['policyNo'].setValue(inspolicy.policyNo);
            this.frmInsPolicy.controls['insCompanyId'].setValue(inspolicy.insCompanyId);
            this.frmInsPolicy.controls['fromDate'].setValue(inspolicy.fromDate);
            this.frmInsPolicy.controls['toDate'].setValue(inspolicy.toDate);
            this.frmInsPolicy.controls['isActive'].setValue(inspolicy.isActive);
            this.assetData = inspolicy.assets;
            this.footer = inspolicy.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
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
      this.svcWaitDlg.open({});
      this.svcInsPolicy.getLookup().subscribe(
        data => {
          this.lstInsuranceCompany = data.lstInsuranceCompany;
          sessionStorage.setItem("lstAsset", JSON.stringify(data.lstAsset));
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  private validate(ip: InsPolicy) {
    this.errors = [];
    if (Object.keys(ip.assets.filter(x => !x.delete)).length == 0) {
      this.errors.push('Atleast one entry must exist in applicable Asset');
    }
    if (ip.assets.some(x => !x.delete && !x.assetId)) {
      this.errors.push('Please select valid Asset for each row of the Grid');
    }
    if (Object.keys(ip.assets.filter(x => !x.delete)).length  != 0) {
      var valueArr = ip.assets.filter(x => !x.delete).map(function (item) { return item.assetId }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Asset must be unique!');
          i = valueArr.length;
        }
      }
    }
  }

  private initForm() {
    this.frmInsPolicy.reset();
    this.frmInsPolicy.disable();
    this.errors = [];    
    this.assetData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
  }
  //#endregion local functions
}
