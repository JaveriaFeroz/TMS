import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community/main';
import * as FileSaver from 'file-saver';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InsClaim } from './insclaim';
import { InsClaimService } from './insclaim.service';
import { InsClaim3rdParty } from './insclaim3rdparty';
import { InsClaimDoc } from './insclaimdoc';
import { InsClaimDriver } from './insclaimdriver';
/*import { InsClaimRecovery } from './insclaimrecovery';*/

@Component({
  selector: 'app-insclaim',
  templateUrl: './insclaim.component.html',
  styleUrls: ['./insclaim.component.css']
})

export class InsClaimComponent implements OnInit {
  //#region form variables
  public goDriver: GridOptions;
  public goDocument: GridOptions;
  public goParty: GridOptions;  
  readonly optionName: string = 'Insurance Claim';
  readonly colSearch =
    [
      { headerName: 'Claim #', field: 'claimId', width: 70 },
      { headerName: 'Date', field: 'claimDate', width: 80 },
      { headerName: 'Asset #', field: 'vehicleNo', width: 110 },
      { headerName: 'Accident Date', field: 'accidentDate', width: 80},
      { headerName: 'Insurance Type', field: 'insuranceTypeName' },
    ];
  frmInsClaim: any;
  driverData: InsClaimDriver[];
  documentData: InsClaimDoc[];
  partyData: InsClaim3rdParty[];
  lstAsset: any;
  lstStatus: any = [
    { id: 1, name: 'New' },
    { id: 2, name: 'Claimed' },
    { id: 3, name: 'Claim Received' },
  ];
  lstInsuranceType: any;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  lstDocumentTypes: any;
  wipDocument: File;
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('claimId', { static: true }) claimId: ElementRef;
  @ViewChild('assetId', { static: true }) assetId: MatSelect;
  @ViewChild('btnEdit', { static: true }) btnEdit: HTMLButtonElement;

  targetNode: Node;
  config = { childList: true, subtree: true };
  callback = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.addedNodes.length > 0) {
        if (mutation.addedNodes[0].id === 'btnSave' && (<HTMLInputElement>document.getElementById('btnEdit')).disabled === false) {
          mutation.addedNodes[0].disabled = true;
        }
      }
    }
  };
  observer = new MutationObserver(this.callback);
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInsClaim: InsClaimService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
    this.initGrid();
    this.loadLookup();
  }

  ngOnInit() {
    this.frmInsClaim = this.formbulider.group({
      claimId: [null, [Validators.required]],
      claimDate: [null, [Validators.required]],
      assetId: [null, [Validators.required]],
      policyId: [null],
      accidentDate: [null, [Validators.required]],
      accidentLocation: [null, [Validators.required]],
      workShopName: [null, [Validators.required]],
      stateId: [null],
      typeId: [null, [Validators.required]],
      remarks: [null, [Validators.required]],
      lossNo: [null],
      surveyorName: [null],
      policyNo: [null],
      completed: [null],
      recovery: [null],     
      amount: [null],
      minDeductible: [null],
      amountRcvd: [null],
      chequeNo: [null],
      chequeDate: [null],
      bankName: [null],
      fileImage: null,
      addNew: [null],
      documentTypeId: [null],
    });
    this.frmInsClaim.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divHToolbar');//document.body;//document.getElementById('btnSave') as Node;
    this.observer.observe(this.targetNode, this.config);
    agFormHelper.setGridToolbar(false);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInsClaim.reset();
    this.frmInsClaim.enable();
    this.frmInsClaim.controls.claimId.disable();
    this.frmInsClaim.controls.stateId.disable();
    this.frmInsClaim.controls.policyNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);    
    this.frmInsClaim.patchValue({ stateId: 1, claimDate: new Date(), completed: false });    
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.assetId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmInsClaim.controls.claimId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.claimId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInsClaim.getClaims().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Insurance Claim", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.claimId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInsClaim.enable();
    this.frmInsClaim.controls.claimId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.frmInsClaim.controls.policyNo.disable();
    this.frmInsClaim.controls.assetId.disable();
    this.frmInsClaim.controls.claimDate.disable();
    this.frmInsClaim.controls.accidentDate.disable();
    this.frmInsClaim.controls.typeId.disable();
    this.assetId.focus();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
  }

  tbSave() {
    try {     
      this.frmInsClaim.markAllAsTouched();     
      if (!this.frmInsClaim.invalid) {        
        var formData: InsClaim = this.frmInsClaim.getRawValue();        
        formData.drivers = this.getDriverDataFromGrid();      
        //if (formData.stateId == 2) {
          formData.documents = this.getDocumentDataFromGrid();
          formData.parties = this.getPartyDataFromGrid();
        //}
        formData.footer = this.footer;       
        this.validate(formData);      
        if (this.errors.length > 0) { return; }        
        else {       
          this.svcWaitDlg.open({});        
          this.svcInsClaim.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Record saved Successfully');
            },
            error => {
              this.svcToaster.showFailure(error);
            },
            () => { this.svcWaitDlg.close(); }
          );
        }
      }
    }
    catch (e) {
      this.svcWaitDlg.close();
      this.svcToaster.showFailure(e);
    }
  }

  tbClose(id: number, stateId: number) {
    try {
    if (!this.frmInsClaim.invalid) {
      if (stateId != 3) {
        this.svcToaster.showSuccess('Claim status must be `Claim Received` before you close any Claim', 'Invalid status');
        return;
      }
      this.svcWaitDlg.open({});
      this.svcInsClaim.close(id).subscribe(
        () => {
          this.initForm();
          agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
          this.svcToaster.showSuccess('Insurance Claim #  ' + id + ' successfully closed in the system.!');
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
      }
    }
    catch (e) { this.svcToaster.showFailure(e); }
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
  initGrid() {
    this.goDriver = <GridOptions>{
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
      },
      onGridReady: () => {
        this.goDriver.api.sizeColumnsToFit();
      }
    };

    this.goDocument = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
        singleClickEdit: true
      },
      rowSelection: 'single',
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
      },
      onGridReady: () => {
        this.goDocument.api.sizeColumnsToFit();
      }
    };

    this.goParty = <GridOptions>{
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
      onCellClicked: function (event) {
        if (event.colDef.field == "paidInAdv") {
          if (!event.data.paidInAdv) {
            event.node.setDataValue('paidInAdv', true);
          }
          else {
            event.node.setDataValue('paidInAdv', false);
          }
        }
      },
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
      },
      onGridReady: () => {
        this.goParty.api.sizeColumnsToFit();
      }
    };
  }

  //#region Driver Detail Grid Definition & functions
  colDriver = [
    {
      headerName: 'Driver(s) Info',
      children: [
        {
          headerName: "DriverName", field: "driverName", width: 250
        },
        { headerName: "CNIC", field: "cnic", width: 120 },

        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }    
  ];

  onAddDriverLine  () {
    try {
      var res = this.goDriver.api.applyTransaction({
        add: [{
          driverName: null, cnic: null, add: true, edit: false, delete: false
        }]
      });
      this.goDriver.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "driverName" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeleteDriverLine () {
    try {
      if (this.goDriver.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDriver.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goDriver.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Driver Line Item: ' + exception, 'error');
    }
  };

  getDriverDataFromGrid() {
    let rowData = [];
    this.goDriver.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion 

  //#region Document Detail Grid Definition & functions
  colDocument = [
    {
      headerName: 'Supporting Document(s)',
      children: [
        { headerName: "DocumentId", field: "detailId", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Document Type", field: "typeName", width: 200 },
        {
          headerName: "File Name", field: "fileName", width: 300, cellRenderer: params => {
            return "<a  class='Template'  title='Click to view or download the document'>" + params.value + "</a>";
          },
          cellStyle: { textDecoration: 'underline', color: 'blue', bold: true, cursor: 'pointer' }
        },
        //{ headerName: "Add", field: "isNew", hide: true, suppressColumnsToolPanel: true },
        //{ headerName: "Edit", field: "Edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }   
  ];

  onAddDocument () {
    try {
      this.frmInsClaim.patchValue({ addNew: true });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onUndoDocument  () {
    try {
      this.frmInsClaim.patchValue({ addNew: false });
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  setWIPDocument(e) {
    this.wipDocument = e.target.files[0];
  }

  onUploadDocument() {
    try {
      if (!this.frmInsClaim.controls.documentTypeId.value) {
        this.svcToaster.showFailure("Please Select valid Document Type before clicking upload button!");
        return;
      }
      if (!this.wipDocument) {
        this.svcToaster.showFailure("Please select valid file to be uploaded and then click Upload button")
        return;
      }
      var claimdoc = new InsClaimDoc();
      claimdoc.image = this.wipDocument;
      var formData = new FormData();
      formData.append('image', claimdoc.image);
      formData.append('typeId', this.frmInsClaim.controls.documentTypeId.value);
      formData.append('claimId', this.frmInsClaim.controls.claimId.value);
      this.svcInsClaim.upload(formData).subscribe(
        () => {
          this.wipDocument = null;
          this.frmInsClaim.patchValue({ documentTypeId: null });
          this.svcInsClaim.getDocuments(this.frmInsClaim.controls.claimId.value).subscribe(
            ic => {
              if (ic) {
                this.documentData = ic;
              }
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); });     
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );      
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  onCellClicked(event) {
    var column = event.api.getFocusedCell().column.colDef.headerName;
    if (column == "File Name") {
      this.svcInsClaim.getDoc(event.node.data.detailId).subscribe(
        ic => {
          if (ic) {
            const byteCharacters = atob(ic.fileContent);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: ic.contentType });
            FileSaver.saveAs(blob, ic.fileName);
          }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
  }

  onDeleteDocument  () {
    try {
      if ((document.getElementById('btnEdit') as HTMLInputElement).disabled == false) {
        this.svcToaster.showFailure('Delete function will only work after you switch form to Edit mode!');
        return;
      }
      if (this.goDocument.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goDocument.api.getSelectedRows().forEach(x => x.delete = true);
          this.goParty.api.getSelectedRows().forEach(x => x.image = 'true');
          agGridHelper.setGridIsDeletedFilter(this.goDocument.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Document Line Item: ' + exception, 'error');
    }
  };

  getDocumentDataFromGrid() {
    let rowData = [];
    this.goDocument.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion 

  //#region 3rd Part Detail Grid Definition & functions
  colParty = [
    {
      headerName: '3rd Party Info (If Applicable)',
      children: [
        {
          headerName: "Party Name", field: "partyName", width: 250
        },
        { headerName: "CNIC", field: "cnic", width: 120 },
        {
          headerName: "Amount", field: "amount", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: 'Advance', field: 'paidInAdv', width: 90, editable: false, headerTooltip: 'Is claim paid in Advance to 3rd Party?',
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

  onAddPartyLine () {
    try {
      var res = this.goParty.api.applyTransaction({
        add: [{
          partyName: null, cnic: null, amount: 0, paidInAdv:false, add: true, edit: false, delete: false
        }]
      });
      this.goParty.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "partyName" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception, 'Add Line: ');
    }
  };

  onDeletePartyLine  () {
    try {
      if (this.goParty.api.getSelectedRows().length > 0) {
        if (confirm("Are you sure you want to Delete selected row?")) {
          this.goParty.api.getSelectedRows().forEach(x => x.delete = true);
          agGridHelper.setGridDeleteFilter(this.goParty.api);
        }
      }
      else
        this.svcToaster.showFailure('No Row selected to apply Delete operation. Please select row and then hit Delete button!', 'Delete Request Failed');
    }
    catch (exception) {
      this.svcToaster.showFailure('Delete Line Item: ' + exception, 'error');
    }
  };

  getPartyDataFromGrid() {
    let rowData = [];
    this.goParty.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }
  //#endregion  
  //#endregion

  //#region local functions
  validateGridStatus() {
    var rd = this.isReadOnly();
    agFormHelper.setGridStatus(!rd);
    agFormHelper.setGridToolbar(!rd);
  }

  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInsClaim.get(Id).subscribe(
        ic => {
          if (ic) {
            this.frmInsClaim.controls['claimId'].setValue(ic.claimId);
            this.frmInsClaim.controls['claimDate'].setValue(ic.claimDate);
            this.frmInsClaim.controls['assetId'].setValue(ic.assetId);
            this.frmInsClaim.controls['policyId'].setValue(ic.policyId);
            this.frmInsClaim.controls['accidentDate'].setValue(ic.accidentDate);
            this.frmInsClaim.controls['accidentLocation'].setValue(ic.accidentLocation);
            this.frmInsClaim.controls['workShopName'].setValue(ic.workShopName);
            this.frmInsClaim.controls['stateId'].setValue(ic.stateId);
            this.frmInsClaim.controls['typeId'].setValue(ic.typeId);
            this.frmInsClaim.controls['remarks'].setValue(ic.remarks);
            this.frmInsClaim.controls['lossNo'].setValue(ic.lossNo);
            this.frmInsClaim.controls['surveyorName'].setValue(ic.surveyorName);
            this.frmInsClaim.controls['policyNo'].setValue(ic.policyNo);
            this.frmInsClaim.controls['completed'].setValue(ic.completed);                       
            if (ic.stateId == 3) {
              this.frmInsClaim.controls['amount'].setValue(ic.amount);
              this.frmInsClaim.controls['minDeductible'].setValue(ic.minDeductible);
              this.frmInsClaim.controls['amountRcvd'].setValue(ic.amountRcvd);
              this.frmInsClaim.controls['chequeNo'].setValue(ic.chequeNo);
              this.frmInsClaim.controls['chequeDate'].setValue(ic.chequeDate);
              this.frmInsClaim.controls['bankName'].setValue(ic.bankName);
              this.frmInsClaim.controls['recovery'].setValue(1);
            }
            else {
              this.frmInsClaim.controls['recovery'].setValue(0);
            }
           this.driverData = ic.drivers;          
           //if (ic.stateId >=2) {
             this.documentData = ic.documents;
             this.partyData = ic.parties;
            //}
            this.footer = ic.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            agFormHelper.setGridStatus(false);
            agFormHelper.setGridToolbar(false);
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
      this.svcInsClaim.getLookups().subscribe(
        data => {
          this.lstStatus = this.lstStatus;
          this.lstInsuranceType = data.lstInsuranceType;
          this.lstAsset = data.lstAsset;
          this.lstDocumentTypes = data.lstDocumentTypes;
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }

  //private arrayBufferToBase64(buffer) {
  //  let binary = '';
  //  let bytes = new Uint8Array(buffer);
  //  let len = bytes.byteLength;
  //  for (let i = 0; i < len; i++) {
  //    binary += String.fromCharCode(bytes[i]);
  //  }
  //  return window.btoa(binary);
  //}

  private validate(ic: InsClaim) {
    this.errors = [];
    let regExpNIC = new RegExp('^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$');
    if (ic.stateId > 1 && !ic.claimId) {
      this.errors.push('Insurance Claim Status must be `New` when loding new Claim for the first time');
    }
    if (ic.completed) {
      this.errors.push('No further changes are allowed to already closed Claim');
    }
    else {
      if (!ic.assetId) {
        this.errors.push('Please Select Asset');
      }
      if (!ic.stateId) {
        this.errors.push('Please select claim State');
      }
      if (!ic.typeId) {
        this.errors.push('Please select Claim Type');
      }
      if (!ic.accidentDate) {
        this.errors.push('Please enter valid date of Accident');
      }
      if (!ic.accidentLocation) {
        this.errors.push('Please enter place of Accident');
      }
      if (!ic.workShopName) {
        this.errors.push('Please enter Work Shop name');
      }
      else if (!ic.remarks) {
        this.errors.push('Accident details are mandatory to lodge Insurance Claim');
      }
      if (ic.stateId > 1 && (!ic.lossNo || !ic.surveyorName)) {
        this.errors.push('Loss # & Surveyor information is mandatory at this state of Insurance Claim');
      }
      if (ic.stateId == 3 && ((!ic.amount || !ic.amountRcvd) && (!ic.chequeNo || !ic.chequeDate))) {
        this.errors.push('Claim Amount or Amount Recovered or Cheque Detail must carry valid value when status is set to `Claim Received`');
      }
      if (Object.keys(ic.drivers.filter(x => !x.delete)).length == 0) {
        this.errors.push('Atleast one Driver with CNIC must be entered in Driver Detail to lodge insurance claim');
      }
      else {
        if (ic.drivers.some(x => !x.delete && !x.driverName)) {
          this.errors.push('Driver Name cant be empty. Please remove rows that are no more required instead of keeping blank values');
        }
        if (ic.drivers.some(x => !x.delete && !x.cnic)) {
          this.errors.push('Driver CNIC is a mandatory field. Please remove rows that are no more required instead of keeping blank values');
        }
        if (ic.drivers.some(x => !x.delete && !regExpNIC.test(x.cnic))) {
          this.errors.push('Driver CNIC must be mentioned in proper format like #####-#######-#');
        }
        var valueddArr = ic.drivers.filter(x => !x.delete).map(function (item) { return item.driverName }).slice().sort();
        for (var i = 0; i < valueddArr.length - 1; i++) {
          if (valueddArr[i + 1] === valueddArr[i]) {
            this.errors.push('Driver name must be unique!');
            i = valueddArr.length;
          }
        } 

        var valuedcArr = ic.drivers.filter(x => !x.delete).map(function (item) { return item.cnic }).slice().sort();
        for (var i = 0; i < valuedcArr.length - 1; i++) {
          if (valuedcArr[i + 1] === valuedcArr[i]) {
            this.errors.push('Driver CNIC # must be unique!');
            i = valuedcArr.length;
          }
        }
      }
    
      if (Object.keys(ic.parties.filter(x => !x.delete)).length > 0) {
        if (ic.parties.some(x => !x.delete && !x.partyName)){
          this.errors.push('3rd party Name is mandatory. Please remove rows that are no more required instead of keeping blank values');
        }
        if (ic.parties.some(x => !x.delete && !x.cnic)){
          this.errors.push('3rd party CNIC # is a mandatory field. Please remove rows that are no more required instead of keeping blank values');
        }
        else if(ic.parties.some(x => !x.delete && !regExpNIC.test(x.cnic))) {
          this.errors.push('3rd party CNIC must be defined in proper format like #####-#######-#');
        }
        if (ic.parties.some(x => !x.delete && x.amount <= 0)) {
          this.errors.push('No row in Third Party grid can contain zero Amount');
        }

        var valuepArr = ic.parties.filter(x => !x.delete).map(function (item) { return item.partyName }).slice().sort();
        for (var i = 0; i < valuepArr.length - 1; i++) {
          if (valuepArr[i + 1] === valuepArr[i]) {
            this.errors.push('3rd Party receiver name must be unique!');
            i = valuepArr.length;
          }
        }

        var valuepcArr = ic.parties.filter(x => !x.delete).map(function (item) { return item.cnic }).slice().sort();
        for (var i = 0; i < valuepcArr.length - 1; i++) {
          if (valuepcArr[i + 1] === valuepcArr[i]) {
            this.errors.push('3rd party must have unique CNIC #!');
            i = valuepcArr.length;
          }
        }
      }
    }
  }

  private isReadOnly() {
    return (!document.querySelector('[id="btnEdit"]')['disabled']);
  }

  private disableSave() {
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  private initForm() {
    this.frmInsClaim.reset();
    this.frmInsClaim.disable();
    this.errors = [];
    this.driverData = [];
    this.partyData = [];
    this.documentData = [];
    this.wipDocument = null;
    this.footer = new agFooter();
    agFormHelper.setGridStatus(false);
    agFormHelper.setGridToolbar(false);
  }
  //#endregion local functions
}
