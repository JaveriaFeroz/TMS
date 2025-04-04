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
import { Client } from './client';
import { ClientService } from './client.service';
import { ClientInvoiceFormat } from './clientinvoiceformat';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})

export class ClientComponent implements OnInit {
  public goInvFormat: GridOptions;
  //#region readonly variables
  readonly optionName: string = 'Client';
  readonly colSearch =
    [
      { headerName: 'Id', field: 'clientId', width: 70 },
      { headerName: 'Client Name', field: 'clientName' },
      { headerName: 'Active?', field: 'isActive', width: 70},
    ];
  //#endregion
  frmClient: any;
  invFormatData: ClientInvoiceFormat[];
  lstIndustry: any;
  lstPaymentMode: any;
  lstCity: any;
  lstInvoiceFormat: any;
  footer: agFooter = new agFooter();
  errors: string[] = [];
  @ViewChild('clientName', { static: true }) clientName: ElementRef;
  @ViewChild('clientId', { static: true }) clientId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcClient: ClientService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.loadLookup();
    this.initGrid();
  }

  ngOnInit() {
    this.frmClient = this.formbulider.group({
      clientId: [null, [Validators.required]],
      accountId: [null],
      clientName: [null, [Validators.required]],
      address: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      industryVerticalId: [null, [Validators.required]],
      contractPeriod: [null],
      paymentModeId: [null, [Validators.required]],
      creditDays: [null],
      creditLimit: [null],
      contactPerson: [null, [Validators.required]],
      contactNo: [null],
      email: [null],
      url: [null],
      ntn: [null, [Validators.required]],
      strn: [null, [Validators.required]],
      cwClientId: [null],
      isActive: [null],
      //routeByConsigneee: [null],
      shortName: [null, [Validators.required]],
    }); 
    this.frmClient.disable();    
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmClient.reset();
    this.frmClient.enable();
    this.frmClient.controls.clientId.disable();
    this.frmClient.patchValue({ isActive: true, contractPeriod: 0, creditLimit: 0, creditDays: 0 });//, RouteByConsigneee: this.routeByConsignee});
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.clientName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbRecall() {
    this.initForm();
    this.frmClient.controls.clientId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.clientId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcClient.getClients().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Client", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.clientId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmClient.enable();
    this.frmClient.controls.clientId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.clientName.nativeElement.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {
      this.frmClient.markAllAsTouched();
      if (!this.frmClient.invalid) {
        var formData: Client = this.frmClient.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return }
        else {
          this.svcWaitDlg.open({});
          this.svcClient.save(formData).subscribe(
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
    sessionStorage.removeItem("lstInvoiceFormat");
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  private initGrid() {
    this.goInvFormat = <GridOptions>{
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

        if (params.colDef.field == "formatId") {
          if (params.data.formatId != "") {
            params.node.setDataValue("formatId", parseInt(params.data.formatId));
          }
          else {
            params.node.setDataValue("formatId", null);
          }
        }
      }
    };
  }

  colInvFormat = [
    {
      headerName: 'Client Invoice Format',
      children:
        [
          {
            headerName: "Format", field: "formatId",
            cellEditor: agGridHelper.getAgilitySelect(),
            cellEditorParams: { source: 'InvFormat', class: "350" },
            valueFormatter: agGridHelper.getInvFormatName, width: 350
          },
          { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
          { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ]
    }  
  ];

  onAddLine  () {
    try {
      var res = this.goInvFormat.api.applyTransaction({
        add: [{ formatId: null, add: true, edit: false, delete: false }]
      });
      this.goInvFormat.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "formatId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteLine() {
    try {
      if (this.goInvFormat.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goInvFormat.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goInvFormat.api);
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
    this.goInvFormat.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcClient.get(Id).subscribe(
        client => {
          if (client) {
            this.frmClient.disable();
            this.frmClient.controls['clientId'].setValue(client.clientId);
            this.frmClient.controls['accountId'].setValue(client.accountId);
            this.frmClient.controls['clientName'].setValue(client.clientName);
            this.frmClient.controls['shortName'].setValue(client.shortName);
            this.frmClient.controls['address'].setValue(client.address);
            this.frmClient.controls['cityId'].setValue(client.cityId);
            this.frmClient.controls['industryVerticalId'].setValue(client.industryVerticalId);
            this.frmClient.controls['contractPeriod'].setValue(client.contractPeriod);
            this.frmClient.controls['contactNo'].setValue(client.contactNo);
            this.frmClient.controls['email'].setValue(client.email);
            this.frmClient.controls['url'].setValue(client.url);
            this.frmClient.controls['contactPerson'].setValue(client.contactPerson);
            this.frmClient.controls['paymentModeId'].setValue(client.paymentModeId);
            this.frmClient.controls['creditLimit'].setValue(client.creditLimit);
            this.frmClient.controls['creditDays'].setValue(client.creditDays);
            this.frmClient.controls['cwClientId'].setValue(client.cwClientId);
            this.frmClient.controls['ntn'].setValue(client.ntn);
            this.frmClient.controls['strn'].setValue(client.strn);
            //this.frmClient.controls['StandardLoadingTime'].setValue(client.standardLoadingTime); 
            this.frmClient.controls['isActive'].setValue(client.isActive);
//            this.frmClient.controls['RouteByConsigneee'].setValue(this.routeByConsignee);
            this.invFormatData = client.details;
            this.footer = client.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); this.svcWaitDlg.open({}); }
  }

  private loadLookup() {
    try {
      this.svcClient.getLookup().subscribe(
        data => {
          this.lstIndustry = data.lstIndustry;
          this.lstPaymentMode = data.lstPaymentMode;
          this.lstCity = data.lstCity;
          sessionStorage.setItem("lstInvoiceFormat", JSON.stringify(data.lstInvoiceFormat));
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

  private validate(c: Client) {
    this.errors = [];
    let reMobileNo = new RegExp('^[0-9]{4}-[0-9]{7}$');
    let reEmail = new RegExp('^[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}$');
    let reNTN = new RegExp('^[0-9]{7}-[0-9]{1}$');
    let reSTRN = new RegExp('^[0-9]{13}$');

    if (!reMobileNo.test(c.contactNo)) {
      this.errors.push('Contact # must be provided in valid format like xxxx-xxxxxxx');
    }
    if (!reEmail.test(c.email)) {
      this.errors.push('Email must be provided in valid format like someone@someone.com');
    }
    if (!reNTN.test(c.ntn)) {
      this.errors.push('NTN must be provided in valid format like xxxxxxx-x');
    }
    if (!reSTRN.test(c.strn)) {
      this.errors.push('STRN must be provided in valid format like xxxxxxxxxxxxx');
    }

    if (c.creditDays < 0)
      this.errors.push('Credit days must be non-negative');

    if (c.creditLimit < 0)
      this.errors.push('Credit Limit must be non-negative');

    if (Object.keys(c.details.filter(x => !x.delete)).length == 0) {
      this.errors.push('Invoice format must be selected in each row of Grid, please remove unnecessary rows');
    }

    if (c.details.some(x => !x.delete && x.formatId == null )) {
      this.errors.push('No row in  format grid can be  without Invoice Format');
    }
    
    if (Object.keys(c.details.filter(x => !x.delete)).length != 0) {
      var valueArr = c.details.filter(x => !x.delete).map(function (item) { return item.formatId }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Invoice Formats must be unique!');
          i = valueArr.length;
        }
      }
    }
  }

  private initForm() {
    this.frmClient.reset();    
    this.frmClient.disable();
    this.errors = [];
    this.invFormatData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.footer = new agFooter();
  }
  //#endregion local functions
}
