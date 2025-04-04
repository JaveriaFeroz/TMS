import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { SKUCategory } from './skucategory';
import { SKUCategoryService } from './skucategory.service';
import { SKUCategoryClient } from './skucategoryclient';

@Component({
  selector: 'app-category',
  templateUrl: './skucategory.component.html',
  styleUrls: ['./skucategory.component.css']
})

export class SKUCategoryComponent implements OnInit {
  //#region form variables
  frmSKUCategory: any;
  public goClient: GridOptions;
  readonly optionName: string = 'SKU Category';
  readonly colSearch =
    [
      { headerName: 'Category Id', field: 'categoryId', width: 70 },
      { headerName: 'Category Name', field: 'categoryName' },
      { headerName: 'Active?', field: 'isActive' },
    ];
  //#endregion
  clientsData: SKUCategoryClient[];
  lstClient: any;
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  @ViewChild('categoryName', { static: true }) categoryName: ElementRef;
  @ViewChild('categoryId', { static: true }) categoryId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcCategory: SKUCategoryService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmSKUCategory = this.formbulider.group({
      categoryId: [null, [Validators.required]],
      categoryName: [null, [Validators.required]],    
      isActive: [null],
    });
    this.frmSKUCategory.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmSKUCategory.reset();
    this.frmSKUCategory.enable();
    this.frmSKUCategory.controls.categoryId.disable();
    this.frmSKUCategory.patchValue({ isActive: true});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);    
    this.categoryName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmSKUCategory.controls.categoryId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.categoryId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcCategory.getCategories().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Category", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.categoryId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmSKUCategory.enable();
    this.frmSKUCategory.controls.categoryId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);   
    this.categoryName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmSKUCategory.markAllAsTouched();
      if (!this.frmSKUCategory.invalid) {
        var formData: SKUCategory = this.frmSKUCategory.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcCategory.save(formData).subscribe(
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
    sessionStorage.removeItem("lstClient");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  private initGrid() {
    this.goClient = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: agGridHelper.allowEdit.bind(this),
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;   
        if (params.colDef.field == "clientId") {
          if (params.data.clientId) {
            params.node.setDataValue("clientId", parseInt(params.data.clientId));
          }
          else {
            params.node.setDataValue("clientId", null);
          }
        }
      },
    };
  }

  colClient = [
    {
      headerName: 'Clients Associated',
      children: [
        {
          headerName: "Client", field: "clientId", cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Client', class: "325" }, valueFormatter: agGridHelper.getClientName, width: 325
        },
        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddLine  () {
    try {
      var res = this.goClient.api.applyTransaction({
        add: [{ clientId: null,  add: true, edit: false, delete: false }]
      });
      this.goClient.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "clientId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine  () {
    try {
      if (this.goClient.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goClient.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goClient.api);
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
    this.goClient.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcCategory.get(Id).subscribe(
        sc => {
          if (sc) {
            this.frmSKUCategory.disable();
            this.frmSKUCategory.controls['categoryId'].setValue(sc.categoryId);
            this.frmSKUCategory.controls['categoryName'].setValue(sc.categoryName);
            this.frmSKUCategory.controls['isActive'].setValue(sc.isActive);
            this.clientsData = sc.details;
            this.footer = sc.footer;
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
      this.svcCategory.getLookup().subscribe(
        data => {
          sessionStorage.setItem("lstClient", JSON.stringify(data.lstClient));  
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

  private validate(sc: SKUCategory) {
    this.errors = [];
    if (Object.keys(sc.details.filter(x => !x.delete)).length == 0) {
      this.errors.push('At least one entry must exist in Client List to perform save operation');
    }
    else {
      if (sc.details.some(x => !x.delete && !x.clientId)) {
        this.errors.push('Each row must contain valid client');
      }
      if (Object.keys(sc.details.filter(x => !x.delete)).length != 0) {
        var valueArr = sc.details.filter(x => !x.delete).map(function (item) { return item.clientId }).slice().sort();
        for (var i = 0; i < valueArr.length - 1; i++) {
          if (valueArr[i + 1] === valueArr[i]) {
            this.errors.push('Clients must be unique!');
            i = valueArr.length;
          }
        }
      }
    }
  }

  private initForm() {
    this.frmSKUCategory.reset();
    this.frmSKUCategory.disable();
    this.errors = [];
    this.clientsData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
  }
  //#endregion local functions
}
