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
import { InsType } from './instype';
import { InsTypeService } from './instype.service';
import { InsTypeDoc } from './instypedoc';

@Component({
  selector: 'app-instype',
  templateUrl: './instype.component.html',
  styleUrls: ['./instype.component.css']
})

export class InsTypeComponent implements OnInit {
  //#region form variables
  public goDoc: GridOptions;
  readonly optionName: string = 'Insurance Type';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'typeId', width: 70 },
      { headerName: 'Insurance Type Name', field: 'typeName' },
      { headerName: 'Is Active', field: 'isActive', width: 70 },
    ];
  frmInsType: any;
  docsData: InsTypeDoc[];
  lstDocumentType: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('typeName', { static: true }) typeName: ElementRef;
  @ViewChild('typeId', { static: true }) typeId: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInsType: InsTypeService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmInsType = this.formbulider.group({
      typeId: [null, [Validators.required]],
      typeName: [null, [Validators.required]],
      isActive: [null],
    });
    this.frmInsType.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInsType.reset();
    this.frmInsType.enable();
    this.frmInsType.controls.typeId.disable();
    this.frmInsType.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.typeName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmInsType.controls.typeId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.typeId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInsType.getInsTypes().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Insurance Type", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.typeId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInsType.enable();
    this.frmInsType.controls.typeId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.typeName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmInsType.markAllAsTouched();
      if (!this.frmInsType.invalid) {
        var formData: InsType = this.frmInsType.getRawValue();
        formData.docs = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcInsType.save(formData).subscribe(
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
    catch (e) { this.svcWaitDlg.close();  this.svcToaster.showFailure(e); }
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
  initGrid() {
    this.goDoc = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        sortable: true
      },
      rowSelection: 'single',
      onCellClicked: function (event) {
        if (event.colDef.field == "mandatory") {
          if (!event.data.mandatory) {
            event.node.setDataValue('mandatory', true);
          }
          else {
            event.node.setDataValue('mandatory', false);
          }
        }
      },
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "docTypeId") {
          if (params.data.docTypeId != "") {
            params.node.setDataValue("docTypeId", parseInt(params.data.docTypeId));
          }
          else {
            params.node.setDataValue("docTypeId", null);
          }
        }
      },
      overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
      overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
    };
  }

  colDoc = [
    {
      headerName: 'Requied Documents',
      children:
        [
          {
            headerName: "Document Type", field: "docTypeId", cellEditor: agGridHelper.getAgilitySelect(),
            cellEditorParams: { source: 'DocumentType', class: "300" },
            valueFormatter: agGridHelper.getDocumentType, width: 300
          },
          {
            headerName: 'Mandatory', field: 'mandatory', width: 100,
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

          { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ]
    }    
  ];

  onAddLine  () {
    try {
      var res = this.goDoc.api.applyTransaction({
        add: [{
          docTypeId: null, mandatory: false, add: true, edit: false, delete: false,
        }]
      });
      this.goDoc.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "docTypeId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goDoc.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDoc.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goDoc.api);
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
    this.goDoc.api.forEachNode(node => rowData.push(node.data));    
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInsType.get(Id).subscribe(
        instype => {
          if (instype) {
            this.frmInsType.disable();
            this.frmInsType.controls['typeId'].setValue(instype.typeId);
            this.frmInsType.controls['typeName'].setValue(instype.typeName);
            this.frmInsType.controls['isActive'].setValue(instype.isActive);
            this.docsData = instype.docs;
            this.footer = instype.footer;
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
      this.svcInsType.getLookup().subscribe(
        data => {
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

  private validate(int: InsType) {
    this.errors = []; 
    if (Object.keys(int.docs.filter(x => !x.delete)).length == 0) {
      this.errors.push('Atleast one entry must exist in Required Document List');
    }
    if (int.docs.some(x => !x.delete && !x.docTypeId)) {
      this.errors.push('Please select valid Document Type for each row in the Grid');
    }

    if (Object.keys(int.docs.filter(x => !x.delete)).length != 0) {
      var valueArr = int.docs.filter(x => !x.delete).map(function (item) { return item.docTypeId }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Document type must be unique!');
          i = valueArr.length;
        }
      }
    }
  }

  private initForm() {
    this.frmInsType.reset();
    this.frmInsType.disable();
    this.errors = [];    
    this.docsData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
  }
  //#endregion local functions
}
