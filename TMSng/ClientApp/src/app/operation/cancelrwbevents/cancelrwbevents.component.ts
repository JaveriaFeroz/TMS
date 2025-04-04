import { formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GridOptions } from 'ag-grid-community';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agGridHelper } from '../../helper/agGridHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { CancelRWBEventService } from './cancelrwbevents.service';
import { RWBEvents } from './rwbevents';

@Component({
  selector: 'app-cancelrwbevents',
  templateUrl: './cancelrwbevents.component.html',
  styleUrls: ['./cancelrwbevents.component.css']
})

export class CancelRWBEventComponent implements OnInit {
  //#region form variables
  public goLog: GridOptions;
  readonly optionName: string = 'Cancel Trip Events';
  frmCancelEvent: any;
  logData: RWBEvents[];
  eventDate?: Date;
  errors: string[] = [];
  footer: agFooter = new agFooter();
  @ViewChild('rwbNo', { static: true }) rwbNo: ElementRef;
  //#endregion

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcCancelRWBEvent: CancelRWBEventService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) { 
    this.initGrid();
  }

  ngOnInit() {
    this.frmCancelEvent = this.formbulider.group({
      rwbNo: [null, [Validators.required]],
    });
    this.frmCancelEvent.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbRecall() {
    this.initForm();
    this.frmCancelEvent.controls.rwbNo.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.rwbNo.nativeElement.focus();
  }

  tbEdit() {
    this.frmCancelEvent.enable();
    this.frmCancelEvent.controls.rwbNo.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
  }

  tbSave() {
    try {
      this.frmCancelEvent.markAllAsTouched();
      if (!this.frmCancelEvent.invalid) {
        var formData = this.frmCancelEvent.getRawValue();
        this.validate();
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          if (confirm("Are you sure you want to cancel all events for RWB # " + formData.rwbNo +
            " that happened on and after " + formatDate(this.eventDate, "dd-MMM-yy HH:mm", "en-US") + "? This action is non-reversible!")) {
            this.svcCancelRWBEvent.cancel(formData.rwbNo, this.eventDate).subscribe(
              () => {
                this.initForm();
                agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
                this.svcToaster.showSuccess('Relevant Event(s) cancelled Successfully');
              },
              error => { this.svcToaster.showFailure(error); },
              () => { this.svcWaitDlg.close(); }
            );
          }
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
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region grid setup
  initGrid() {
    this.goLog = <GridOptions>{
      headerHeight: 25,
      rowHeight: 32,
      animateRows: true,
      defaultColDef: {
        editable: false,
        resizable: true,
        sortable: true,
      },
      rowSelection: 'single',
      getRowClass: params => {
        if (params.node.rowIndex % 2 === 0)
          return 'agEvenRow';
        else {
          //return { background: 'lightgoldenrodyellow', color: 'saddlebrown' };
          return 'agOddRow';
        }
      },
    };
  } 

  colLog= [
    { headerName: "Event Name", field: "eventName", width: 240 },
    { headerName: "Event Date Time", field: "eventDateTime", width: 180 },
    { headerName: "Asset #", field: "vehicleNo", width: 80 },
    {
      headerName: "KM", field: "kmReading", type: "numericColumn", width: 80,
      valueFormatter: agGridHelper.formatNumbers, valueParser: agGridHelper.numberValueParser
    },
    { headerName: "From City", field: "fromCityName", width: 100 },
    { headerName: "To City", field: "toCityName", width: 100 },
    { headerName: "Consignee", field: "consigneeName", width: 180 },
    { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
    { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
    { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
  ];

  onCellClicked(event) {
    if (event.api.getFocusedCell().column.colDef.headerName == "Event Date Time") {
      //this.eventDate = formatDate(event.node.data.eventDateTime, 'ddMMyyyyHH:mm', 'en-US');
      this.eventDate = event.node.data.eventDateTime;
    }
  }
  //#endregion

  //#region local functions
  get(rwbNo: string) {
    rwbNo = agFormHelper.padL(rwbNo);
    this.svcWaitDlg.open({});
    try {
      this.svcCancelRWBEvent.get(rwbNo).subscribe(
        eventLog => {
          if (eventLog) {
            this.frmCancelEvent.disable();
            this.frmCancelEvent.controls['rwbNo'].setValue(rwbNo);
            this.logData = eventLog;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }
  
  private validate() {
    this.errors = [];
    if (!this.eventDate) {
      this.errors.push('Please select valid event date/time from list to execute cancellation, please click on event date time column in the row from where you want to cancel including onwards events');
    }
  }

  private initForm() {
    this.frmCancelEvent.reset();
    this.frmCancelEvent.disable();
    this.errors = [];
    this.logData = [];
    this.eventDate = null;
  }
  //#endregion local functions
}
