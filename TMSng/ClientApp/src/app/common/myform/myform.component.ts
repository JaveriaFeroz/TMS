import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { HistoryDialogService } from '../../helper/historyDialog/history-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { MyFormService } from '../myform/myform.service';
import { RecipientService } from '../recipient/recipient.service';

export interface DialogData {}
@Component({
  selector: 'app-myform',
  templateUrl: './myform.component.html',
  styleUrls: ['./myform.component.css']
})
export class MyFormComponent implements OnInit {
  //#region constant variables
  formData: any[];   
  public goForms: GridOptions;  
  optionFormGroup: any;  
  //#endregion

  constructor(private router:Router, private formbulider: FormBuilder,
    private svcMyForm:MyFormService, private Enum: AgilityEnum, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcRecipient: RecipientService, private svcHistoryDlg: HistoryDialogService) { }

  ngOnInit(): void {
     this.optionFormGroup = this.formbulider.group({ options:['0'] });  
    this.initGrid();
    this.GetMyForms(0)
  }
    //#region toolbar functions
  tbHistroy(_formId: number, _workFlowName: string, _workFlowId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(_workFlowId, _formId).subscribe(r => {
        this.svcHistoryDlg.open("History Of " + _workFlowName + " Request # " + _formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }
  
  tbExit() {
    this.router.navigate(['/MainForm']);
  }
    //#endregion toolbar functions

    //#region local functions
  GetMyForms(id:number)
  {
    try {
      if (id == 0) {
        this.svcMyForm.ActiveForms(AgilityEnum.WorkFlow.ALL).subscribe(
          data => {
            this.formData = data;
          },
          error => {
            this.svcToaster.showFailure(error);
          }
        );
      }
      else if (id == 1) {
        this.svcMyForm.SentForms(AgilityEnum.WorkFlow.ALL).subscribe(
          data => {
            this.formData = data;
          },
          error => {
            this.svcToaster.showFailure(error);
          }
        );
      }
      else if (id == 2) {
        this.svcMyForm.CompletedForms(AgilityEnum.WorkFlow.ALL).subscribe(
          data => {
            this.formData = data;
          },
          error => {
            this.svcToaster.showFailure(error);
          }
        );
      }
        
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    } 
  }
    //#endregion local functions

    //#region form Grid Definition & functions
  colForms = [
    {
      headerName: "Work Flow", field: "workFlowName", width: 110,
      cellStyle: { backgroundColor: 'lightgoldenrodyellow', color: 'darkgoldenrod', fontWeight: 'bold' },
    },
    {
      headerName: "Form #", field: "formId", width: 90,
      cellRenderer: function (params) { return '<a href="' + params.data.route + '?formId=' + params.value + '" title="Click to open this form">' + params.value + '</a>' },
      cellStyle: { textDecoration: 'underline' }
    },
    { headerName: "State", field: "stateName", width: 160 },
    { headerName: "Sender", field: "sender", width: 120 },
    { headerName: "Recipient", field: "recipient", width: 120 },
    { headerName: "Sent On", field: "sentOn", width: 120 },
    {
      headerName: "Amount", field: "documentValue", type: "numericColumn", filter: "agNumberColumnFilter",
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser, width: 70
    },
    { headerName: "Comments", field: "submissionComments", width: 200 },
    //{
    //  headerName: "History", field: "workFlowName" , width: 50, filter: false, 
    //    cellStyle: {
    //        backgroundColor: 'lightgoldenrodyellow',
    //        color: 'darkgoldenrod',
    //        fontWeight: 'bold'
    //  },
    //  cellRenderer: function () {
    //    return 'History';
    //  }
    //},      
    {
      headerName: "History", field: "History", width: 40, filter: false,
      cellRenderer: function (params) {
        return '<a title="Click to view history of selected form"><img src="../../../assets/images/history.png" width="20" height="20"/></a>'
          /*< img src = "../../../assets/images/history.png" />*/
      }
    },
    { headerName: 'WFId', field: 'workFlowId', hide: true, suppressColumnsToolPanel: true },
    { headerName: 'route', field: 'route', hide: true, suppressColumnsToolPanel: true },
    { headerName: 'trackingkey', field: 'trackingKey', hide: true, suppressColumnsToolPanel: true }
  ];

  initGrid()
  {
    this.goForms = <GridOptions>{
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
      },
      headerHeight: 25,       
      rowHeight: 32,
      animateRows: true,    
      columnDefs: this.colForms,
      rowData: [],
      rowSelection: 'single',
      onGridReady: () => {  
            this.goForms.api.sizeColumnsToFit();                   
      }  
    };
  }

  onCellClicked(event) {
    if (event.api.getFocusedCell().column.colDef.headerName == "History") {  
      if (event.node.data.workflowId != 3) {
        this.tbHistroy(event.node.data.trackingKey, event.node.data.WorkFlowName, event.node.data.workFlowId);
      }
      else {
        this.tbHistroy(event.node.data.formId, event.node.data.workFlowName, event.node.data.workFlowId);
      }     
    }
  }
  //#endregion
}
