import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { forkJoin, Observable } from 'rxjs';
import { Recipient } from '../../common/recipient/recipient';
import { RecipientService } from '../../common/recipient/recipient.service';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { FormSubmissionDialogService } from '../../helper/formsubmissionDialog/formsubmission-dialog.service';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { AuthService } from '../../helper/service/auth.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { Submission } from '../../helper/submission';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InvTransfer } from './invtransfer';
import { InvTransferService } from './invtransfer.service';
import { InvTransferDetail } from './invtransferdetail';

@Component({
  selector: 'app-inventorytransfer',
  templateUrl: './invtransfer.component.html',
  styleUrls: ['./invtransfer.component.css']
})

export class InvTransferComponent implements OnInit {
  //#region form variables
  public goTransfer: GridOptions;
  readonly optionName: string = 'Inventory Transfer';
  readonly colSearch =
    [
      { headerName: 'Transfer #', field: 'transferId', width: 90 },
      { headerName: 'Date', field: 'transferDate', width: 75 },
      { headerName: 'Origin Branch', field: 'fromBranchName' },
      { headerName: 'Destination Branch', field: 'toBranchName' },
      { headerName: 'State', field: 'stateName' },
    ];
  frmInvTransfer: any;
  transferData: InvTransferDetail[];
  lstFBranch: any;
  lstTBranch: any;
  errors: string[] = [];
  currentUserId :string;
  footer: agFooter = new agFooter();
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  submissionButtonsStatus = "";
  @ViewChild('branchId' , { static: true }) branchId: MatSelect;
  @ViewChild('transferId', { static: true }) transferId: ElementRef;
  //#endregion

  constructor(private route:ActivatedRoute, private router: Router, private formbulider: FormBuilder,
    private svcInvTransfer: InvTransferService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, svcAuth: AuthService,
    private svcHistoryDlg: HistoryDialogService, private svcRecipient: RecipientService,
    private formsubmissionDlg: FormSubmissionDialogService) {
    this.currentUserId = null;
    this.currentUserId = svcAuth.getUserId();
    this.loadLookup();
    this.initGrid();     
  }

  ngOnInit() {
    this.frmInvTransfer = this.formbulider.group({
      transferId: [null, [Validators.required]],
      transferDate: [null, [Validators.required]],
      fromBranchId: [null, [Validators.required]],
      toBranchId: [null, [Validators.required]],
      statusName: [null],
      stateId: [null],
      owner: [null],
      completed: [null],
    });
    this.frmInvTransfer.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
    if (_formid > 0) {
      this.get(_formid)
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  //#region toolbar functions
  tbAdd() {
    this.frmInvTransfer.reset();
    this.frmInvTransfer.enable();
    this.frmInvTransfer.controls.transferId.disable();
    this.frmInvTransfer.patchValue({ transferDate: new Date(), stateId: 0, statusName: "New", completed:false  });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmInvTransfer.controls.statusName.disable();
    agFormHelper.setGridToolbar(true);
    agFormHelper.setGridStatus(true);
    this.branchId.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmInvTransfer.controls.transferId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.transferId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcInvTransfer.getInvTransfers().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Inventory Transfer", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.transferId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbHistory(formid: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(AgilityEnum.WorkFlow.InventoryTransfer, formid).subscribe(r => {
        this.svcHistoryDlg.open("Inventory Transfer" + formid, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmInvTransfer.enable();
    this.frmInvTransfer.controls.transferId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);
    this.frmInvTransfer.controls.statusName.disable();
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
    this.branchId.focus();
  }

  tbSave() {
    try {
      this.frmInvTransfer.markAllAsTouched();
      if (!this.frmInvTransfer.invalid) {
        var formData: InvTransfer = this.frmInvTransfer.getRawValue();
        formData.details = this.getDetailFromGrid();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        else {
          this.svcWaitDlg.open({});
          this.svcInvTransfer.save(formData).subscribe(
            data => {
              agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
              this.svcToaster.showSuccess('Inventory Transfer # ' + data.transferId +
                ' saved successfully. Please click Transfer button to initiate Inventory Transfer to Destination!');
              this.frmInvTransfer.controls['transferId'].setValue(data.transferId);
              this.frmInvTransfer.controls['owner'].setValue(data.owner);
              this.frmInvTransfer.controls['stateId'].setValue(1);
              this.frmInvTransfer.controls['statusName'].setValue('Saved');
              this.footer.createdBy = data.owner;
              this.frmInvTransfer.enable();
              this.setActionBarVisibility(agFormMode.ReadOnly);
              agFormHelper.setGridToolbar(false);
              agFormHelper.setGridStatus(false);
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
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region FormSubmission
  tbFormSubmission(formid: number, stateid: number) {
    this.svcWaitDlg.open({});
    let recipients: Observable<Recipient[]>;
    return new Promise((resolve, reject) => {
      try {
        if (stateid == 9) {
          recipients = this.svcRecipient.getInvTransferRecipients(formid);
        }
        else if (stateid == 10) {
          recipients = this.svcRecipient.getInvTransferOwners(formid);
        }
        else if (stateid == 99) {
          recipients = this.svcRecipient.getOwner(AgilityEnum.WorkFlow.InventoryTransfer, formid);
        }
        forkJoin([recipients]).subscribe(results => {
          var data = results[0];
          recipients = data["recipient"];
          if (!recipients || Object.keys(recipients).length == 0) {
            this.svcToaster.showWarning("No submission user is configured for selected Form State." +
              "Submission process can not be executed while submission users are missing" +
              "Please raise Service Request through eForms if you require any support from IT Department");
            this.svcWaitDlg.close();
            return;
          }
          else {
            this.formsubmissionDlg.open(AgilityEnum.getWorkFlowState(stateid) + " - Transfer # " + formid,
              AgilityEnum.getWorkFlowState(stateid), recipients);
            let sub: Submission = new Submission();
            this.formsubmissionDlg.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  sub.formId = formid;
                  sub.comments = r.submissionComment;
                  sub.owner = r.recipientId;
                  sub.stateId = stateid;
                  this.submit(sub);
                }
                else {
                  this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                    "Submission process can not be executed while submission users are missing");
                  return;
                }
              }
            },
              error => { this.svcToaster.showFailure(error); },
              () => { this.formsubmissionDlg.close(); this.svcWaitDlg.close(); }
            );
          }
        }, () => { }, () => { this.svcWaitDlg.close(); });
        resolve(true);
      }
      catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); reject(e); }
    });
  }

  private submit(sub: Submission) {
    if (sub.stateId == 9) {

      this.svcInvTransfer.transfer(sub).subscribe(
        () => {
          alert('Submit operation was successful. Inventory Transfer # ' + sub.formId +
            ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
          this.router.navigate(['/MainForm']);      
        },
        error => { this.svcToaster.showFailure(error); },
        () => { }
      );
    }
    else {
      if (sub.stateId == 99) {
        sub.completed = true;
        sub.rejected = true;

        this.svcInvTransfer.cancel(sub).subscribe(
          () => {
            alert('Cancel operation was successful. Inventory Transfer # ' + sub.formId +
              ' was successfully Cancel by ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
            this.router.navigate(['/MainForm']);
          },
          error => { this.svcToaster.showFailure(error); },
          () => { }
        );
      }
      else {
        sub.completed = true;
        this.svcInvTransfer.receive(sub).subscribe(
          () => {
            alert('Submit operation was successful. Inventory Transfer # ' + sub.formId +
              ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
            this.router.navigate(['/MainForm']);
          },
          error => { this.svcToaster.showFailure(error); },
          () => { }
        );
      } 
    }
  }
  //#endregion FormSubmission

  //#region grid setup
  initGrid() {
    this.goTransfer = <GridOptions>{
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
      getRowStyle: function (params) {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold', 'color': 'white', 'background-color': 'lightgray' };
        }
      },
      onCellValueChanged: function (params) {
        if (!params.data.add)
          params.data.edit = true;
        if (params.colDef.field == "productId") {
          if (params.data.productId == "") {
            params.node.setDataValue("productId", null);
          }
          else {
            var lstProduct = JSON.parse(sessionStorage.getItem("lstProduct"));
            var product = lstProduct.filter(x=> x.productId == params.data.productId)[0];
            params.node.setDataValue('price', product.purchasePrice);
            params.node.setDataValue('uoMName', product.uomName);
            params.node.setDataValue('uoMId', product.uomId);
            params.node.setDataValue("productId", parseInt(params.data.productId));
          }
        }
      }
    };
  }

  colTransfer = [
    {
      headerName: 'Inventory Transfer',
      children: [
        {
          headerName: "Product", field: "productId",
          cellEditor: agGridHelper.getAgilitySelect(),
          cellEditorParams: { source: 'Product', class: "300" },
          valueFormatter: agGridHelper.getProductName, width: 300, lockPinned: true
        },
        {
          headerName: "Qty", field: "quantity", type: "numericColumn", width: 80,
          valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser
        },
        {
          headerName: "UoM", field: "uoMName", width: 80, editable: false

        },
        { headerName: "UoMId", field: "uoMId", hide: true, suppressColumnsToolPanel: true },
        {
          headerName: "Price", field: "price", type: "numericColumn",
          valueFormatter: agGridHelper.formatNumbers,
          valueParser: agGridHelper.numberValueParser, width: 100, editable: false
        },

        { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
        { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
      ]
    }
  
  ];

  onAddLine() {
    try {
      var res = this.goTransfer.api.applyTransaction({
        add: [{
          productId: null, quantity: 0, uOMName: null, price: 0
        }]
      });
      this.goTransfer.api.startEditingCell({ rowIndex: res.add[0].rowIndex, colKey: "productId" });
    }
    catch (exception) {
      this.svcToaster.showFailure(exception);
    }
  };

  onDeleteLine() {
    try {
      if (confirm("Are you sure you want to Delete selected row?")) {
        const selectedRow = this.goTransfer.api.getFocusedCell();
        if (selectedRow) {
          var rowNode = this.goTransfer.api.getRowNode(selectedRow.rowIndex.toString());
          this.goTransfer.api.selectNode(rowNode);
          this.goTransfer.api.applyTransaction({ remove: this.goTransfer.api.getSelectedRows() });
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
    this.goTransfer.api.forEachNode(node => rowData.push(node.data));
    return rowData;
  }   
  //#endregion

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcInvTransfer.get(Id).subscribe(
        it => {
          if (it) {
            this.frmInvTransfer.disable();
            this.frmInvTransfer.controls['transferId'].setValue(it.transferId);
            this.frmInvTransfer.controls['transferDate'].setValue(it.transferDate);
            this.frmInvTransfer.controls['fromBranchId'].setValue(it.fromBranchId);
            this.frmInvTransfer.controls['toBranchId'].setValue(it.toBranchId);
            this.frmInvTransfer.controls['stateId'].setValue(it.stateId);
            if (it.stateId == 1) {
              it.statusName = "Saved";
            }
            else if (it.stateId == 9) {
              it.statusName = "Transferred (InTransit)";
            }
            else if (it.stateId == 10) {
              it.statusName = "Received";
            }
            else if (it.stateId == 99) {
              it.statusName = "Cancelled";
            }
            this.frmInvTransfer.controls['statusName'].setValue(it.statusName);
            this.frmInvTransfer.controls['owner'].setValue(it.owner);
            this.frmInvTransfer.controls['completed'].setValue(it.completed);
            this.transferData = it.details;
            this.footer = it.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
            agFormHelper.setGridToolbar(false);
            agFormHelper.setGridStatus(false);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcWaitDlg.close();  this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcInvTransfer.getLookup().subscribe(
        data => {
          this.lstFBranch = data.lstFBranch;
          this.lstTBranch = data.lstTBranch;
          sessionStorage.setItem("lstProduct", JSON.stringify(data.lstProduct));  
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
  
  private validate(it: InvTransfer) {
    this.errors = [];
    if (it.stateId > 1) {
      this.errors.push('No further changes can be made to this Inventory Transfer at this stage!');
    }
    if (it.transferDate == null) {
      this.errors.push('Please select valid Transfer date');
    }
    if (it.fromBranchId == it.toBranchId) {
      this.errors.push('From & To Branches cant be same for transfer operation');
    }    
    if (Object.keys(it.details).length == 0) {
      this.errors.push('Atleast one product must exist in Inventory Transfer Transaction to perform save operation');
    }
    if (it.details.some(x => !x.productId)) {
      this.errors.push(' Product must be selected in each row of Grid, please remove unnecessary rows');
    }
    if (it.details.some(x => x.quantity <= 0)) {
      this.errors.push('No row in Transfer Transaction can contain zero quantity');
    }
    if (Object.keys(it.details).length != 0) {
      var valueArr = it.details.map(function (item) { return item.productId }).slice().sort();
      for (var i = 0; i < valueArr.length - 1; i++) {
        if (valueArr[i + 1] === valueArr[i]) {
          this.errors.push('Product must be unique!');
          i = valueArr.length;
        }
      }
    }
  }
 
  private setActionBarVisibility(formMode: agFormMode) {
    this.submissionButtonsStatus = (formMode != agFormMode.ReadOnly && formMode != agFormMode.Review) ? "disabled" : "";
  }

  private initForm() {
    this.frmInvTransfer.reset();
    this.frmInvTransfer.disable();
    this.errors = [];    
    this.transferData = [];
    agFormHelper.setGridToolbar(false);
    agFormHelper.setGridStatus(false);
    this.setActionBarVisibility(agFormMode.Initialize);    
    this.footer = new agFooter();
  }
  //#endregion local functions
}
