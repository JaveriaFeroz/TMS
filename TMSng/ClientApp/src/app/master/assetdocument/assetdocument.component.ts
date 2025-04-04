import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridDateEditor } from '../../helper/agGrid-date.component';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { AssetDocument } from './assetdocument';
import { AssetDocumentService } from './assetdocument.service';
import { Documents } from './documents';

@Component({
  selector: 'app-assetdocument',
  templateUrl: './assetdocument.component.html',
  styleUrls: ['./assetdocument.component.css']
})

export class AssetDocumentComponent implements OnInit {
  public goDocs: GridOptions;
  //#region constant variables
  readonly optionName: string = 'Asset Document';
  readonly colSearch =
  [
    { headerName: 'AssetId', field: 'assetId', width: 70 },
    { headerName: 'Asset #', field: 'assetNo' },
  ];
  //#endregion
  frmAssetDocs: any;
  docsData: Documents[];
  lstAsset: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
 
  frameworkComponents = {
    agDateEditor: agGridDateEditor
  }
  @ViewChild('assetId', { static: true }) assetId: MatSelect;
  
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcAssetDoc: AssetDocumentService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmAssetDocs = this.formbulider.group({
      assetId: [null, [Validators.required]],
    });
    this.frmAssetDocs.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }
  //#region toolbar functions

  tbRecall() {
    this.initForm();
    this.frmAssetDocs.controls.assetId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.assetId.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcAssetDoc.getAssets().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Asset", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.assetId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmAssetDocs.enable();
    this.frmAssetDocs.controls.assetId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    //this.EnableGridButton();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmAssetDocs.markAllAsTouched();
      if (!this.frmAssetDocs.invalid) {
        var formData: AssetDocument = this.frmAssetDocs.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcAssetDoc.save(formData).subscribe(
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
    sessionStorage.removeItem("lstDocumentType");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  private initGrid() {
    this.goDocs = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      //columnDefs: this.colDocs,
      //rowData: [],
      /*rowSelection: 'multiple',*/
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "typeId") {
          if (params.data.typeId == "") {
            params.node.setDataValue("typeId", null);
          }
          else {
            params.node.setDataValue("typeId", parseInt(params.data.typeId));
          }
        }
      }
    };
  }

  colDocs = [
    {
      headerName: 'Asset Document',
      children:
        [
          {
            headerName: "Document Type", field: "typeId",
            cellEditor: agGridHelper.getAgilitySelect(),
            cellEditorParams: { source: 'DocumentType', class: "220" },
            valueFormatter: agGridHelper.getDocumentType, width: 220
          },
          {
            headerName: "Issue Date", field: "issueDate", width: 105,
            cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter
          },
          {
            headerName: "Expiry Date", field: "expiryDate", width: 105,
            cellEditor: 'agDateEditor', editable: true, valueFormatter: agGridHelper.dateFormatter,
            cellEditorParams: { minDate: '-0d', maxDate: '+360d' }
          },
          { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ]
    }   
  ];

  onAddLine  () {
    try {
      var res = this.goDocs.api.applyTransaction({
        add: [{
          typeId:null, issueDate: null, expiryDate: null,  add: true, edit: false, delete: false
        }]
      });
      this.goDocs.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "typeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goDocs.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDocs.api.getSelectedRows().forEach(x => x.delete = true);
          //this.goDocs.api.getFilterInstance('delete').onFilterChanged();
          agGridHelper.setGridDeleteFilter(this.goDocs.api);
        }
        //agGridHelper.setGridDeleteFilter(this.goDocs.api);
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
    this.goDocs.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
 //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcAssetDoc.get(Id).subscribe(
        assetDoc => {
          if (assetDoc) {
            this.frmAssetDocs.disable();
            this.frmAssetDocs.controls['assetId'].setValue(assetDoc.assetId);
            this.docsData = assetDoc.details;
            this.footer = assetDoc.footer;
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
      this.svcAssetDoc.getLookup().subscribe(
        data => {
          this.lstAsset = data.lstAsset;
          sessionStorage.setItem("lstDocumentType", JSON.stringify(data.lstDocumentType));  
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

  private validate(ad: AssetDocument) {
    this.errors = [];    
    if (Object.keys(ad.details.filter(x => !x.delete)).length == 0) {
      this.errors.push('Atleast one entry must exist in Asset Document Transaction to perform save operation');
    }
    else if (ad.details.some(x => !x.delete && x.issueDate > x.expiryDate)) {
      this.errors.push('Issue Date cannot be greater thne Expiry Date');
    }

    if (ad.details.some(x => !x.delete && x.typeId == null)) {
      this.errors.push('No row can have empty Vehcile Document');
    }

    if (Object.keys(ad.details.filter(x => !x.delete)).length != 0) {
      var valueArr = ad.details.filter(x => !x.delete).map(function (item) { return item.typeId }).slice().sort();
      var duplicates = [];
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Document Type  must be unique!');
          i = valueArr.length;
        }
      }
    }

  }
  
  onChange(event) {
    this.get(event);
  }

  private initForm() {
    this.frmAssetDocs.reset();
    this.frmAssetDocs.disable();
    this.errors = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.docsData = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
