import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
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
import { ServiceRequest } from './servicerequest';
import { ServiceRequestService } from './servicerequest.service';

@Component({
  selector: 'app-servicerequest',
  templateUrl: './servicerequest.component.html',
  styleUrls: ['./servicerequest.component.css']
})

export class ServiceRequestComponent implements OnInit {
  //public ServiceRequests: ServiceRequest;
  //public submission: Submission;
  //ServiceRequests: ServiceRequest = new ServiceRequest();
  //submission: Submission = new Submission();
  //#region constant variables
  readonly optionName: string = 'Service Request';
  readonly colSearch =
    [
      { headerName: 'Request Id', field: 'requestId', width: 100 },
      { headerName: 'Date', field: 'requestDate'  },
      { headerName: 'Type', field: 'requestTypeName' },
      { headerName: 'Priority', field: 'priorityName' },
      { headerName: 'Vehicle #', field: 'vehicleNo' },
      { headerName: 'Status', field: 'stateName' },
      { headerName: 'Complainant', field: 'complainantName' },
    ];
  readonly colAssetHistory =
    [
      { headerName: 'WO #', field: 'woNo', width: 120 },
      { headerName: 'WODate', field: 'woDate', filter: 'agDateColumnFilter', valueFormatter: agGridHelper.dateFormatter },
      { headerName: 'SR #', field: 'requestId' },
      { headerName: 'WO Type', field: 'woTypeName' },
      { headerName: 'Status', field: 'stateName' },
      { headerName: 'SR Created By', field: 'createdBy' },
      { headerName: 'MTR Reading', field: 'kmsReading', type: "numericColumn", valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter'},
      { headerName: 'Estimates', field: 'estimates', type: "numericColumn", valueFormatter: agGridHelper.formatNumbers, filter: 'agNumberColumnFilter' },
      { headerName: 'Details', field: 'activityDetail' },   
    ];
  //#endregion
  frmServiceRequest: any;
  lstRequestType: any;
  lstAsset: any;
  lstComplainant: any;
  lstPriority: any;
  //lstRecipient: any;
  errors: string[] = [];
  currentUserId :string;
  minDate = new Date(new Date().getDate() - 30);
  maxDate = new Date();
  submissionButtonsStatus = "";
  footer: agFooter = new agFooter();
  @ViewChild('requestId', { static: true }) requestId: ElementRef;
  @ViewChild('complaintType', { static: true }) complaintType: MatSelect;
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

  constructor(private route: ActivatedRoute, private router: Router, private formbulider: FormBuilder,
    private svcServiceRequest: ServiceRequestService, private svcToaster: agToasterService, private svcAuth: AuthService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService,
    private svcHistoryDlg: HistoryDialogService, private svcRecipient: RecipientService,
    private svcFormSubmissionDlg: FormSubmissionDialogService) {
    this.currentUserId = svcAuth.getUserId();
    this.loadLookup();
  }

  ngOnInit() {
    this.frmServiceRequest = this.formbulider.group({
      requestId: [null, [Validators.required]],
      requestDate: [null, [Validators.required]],
      requestTypeId: [null, [Validators.required]],
      priorityId: [null, [Validators.required]],
      vehicleId: [null, [Validators.required]],
      requestDetail: [null, [Validators.required]],
      complainantId: [null, [Validators.required]],
      requestorName: [null, [Validators.required]],
      remarks: [null],
      kMsReading: [null, [Validators.required]],
      stateId: [null],
      stateName: [null],
      owner: [null],
      completed: [null],
    });
    this.frmServiceRequest.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
    
    var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
    if (_formid > 0) {
      this.get(_formid)
    }
    else {
      this.setActionBarVisibility(agFormMode.Initialize);
    }
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    this.disableSave();
    this.targetNode = document.getElementById('divHToolbar');//document.body;//document.getElementById('btnSave') as Node;
    this.observer.observe(this.targetNode, this.config);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmServiceRequest.reset();
    this.frmServiceRequest.enable();
    this.frmServiceRequest.controls.requestId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmServiceRequest.patchValue({ requestDate: new Date(), stateId: 0, completed: false, stateName: "New", owner: this.currentUserId});
    //this.frmServiceRequest.controls.DocumentStatus.disable();
    this.footer.createdBy = this.currentUserId;
    this.complaintType.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmServiceRequest.controls.requestId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.requestId.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcServiceRequest.getServiceRequests().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Service Request", this.colSearch, r);
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

  tbHistory(formId: number): void {
    try {
      this.svcWaitDlg.open({});
      this.svcRecipient.getHistory(AgilityEnum.WorkFlow.ServiceRequest, formId).subscribe(r => {
        this.svcHistoryDlg.open("Service Request" + formId, agGridHelper.colHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbAssetHistory(assetId: number): void {
    try {
      var assetNo = this.lstAsset.find(o => o.assetId == assetId).assetNo;
      this.svcWaitDlg.open({});
      this.svcServiceRequest.getMaintenaceHistory(assetId).subscribe(r => {
        this.svcHistoryDlg.open("Asset History" + assetNo, this.colAssetHistory, r);
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcHistoryDlg.close(); this.svcToaster.showFailure(e); }
  }
   
  tbEdit() {
    this.frmServiceRequest.enable();
    this.frmServiceRequest.controls.requestId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    //this.frmServiceRequest.controls.DocumentStatus.disable();
    this.setActionBarVisibility(agFormMode.Initialize);
    this.complaintType.focus();
  }

  tbSave() {
    try {
      this.frmServiceRequest.markAllAsTouched();
      if (!this.frmServiceRequest.invalid) {
        var formData: ServiceRequest = this.frmServiceRequest.getRawValue();
        formData.footer = this.footer;
        this.validate(formData);
        if (this.errors.length > 0) { return; }
        this.svcWaitDlg.open({});
        this.svcServiceRequest.save(formData).subscribe(
          data => {
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.svcToaster.showSuccess('Service Request # ' + data.srNo + ' saved successfully. Press click Submit to proceed this request to workshop now!');
            this.frmServiceRequest.controls['requestId'].setValue(data.srNo);
            this.frmServiceRequest.controls['owner'].setValue(data.owner);
            this.frmServiceRequest.controls['stateId'].setValue(1);
            this.frmServiceRequest.controls['stateName'].setValue('Saved');
            this.footer.createdBy = data.owner;
            this.setActionBarVisibility(agFormMode.ReadOnly);
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region FormSubmission
  tbFormSubmission(formId: number, stateId: number) {
    this.svcWaitDlg.open({});
    let recipients;
    return new Promise((resolve, reject) => {
      try {
        if (stateId == 2) {
          recipients = this.svcRecipient.getRecipients(AgilityEnum.WorkFlow.ServiceRequest, stateId);
        }
        else {
          recipients = this.svcRecipient.getOwner(AgilityEnum.WorkFlow.ServiceRequest, formId);
        }
        forkJoin([recipients]).subscribe(results => {
          var data = results[0];
          recipients = data["recipient"];
          if (recipients === undefined || recipients.length == 0) {
            this.svcToaster.showWarning("No submission user(s) are configured for current State of this Form. " +
              "Submission process can not continue while users are missing.");
            this.svcWaitDlg.close();
            return;
          }
          else {
            this.svcFormSubmissionDlg.open(AgilityEnum.getServiceRequestState(stateId) + "-" + formId,
              AgilityEnum.getServiceRequestState(stateId), recipients);
            this.svcFormSubmissionDlg.selected().subscribe(r => {
              if (r) {
                if (r.recipientId !== undefined) {
                  var submission: Submission = new Submission();
                  submission.formId = formId;
                  submission.comments = r.submissionComment;
                  submission.owner = r.recipientId;
                  submission.stateId = stateId;
             /*     submission.userId = this.currentUserId;*/
                  this.submit(submission);
                }
                else {
                  this.svcToaster.showWarning("No submission user selected. Please select user to resubmit again. " +
                    "Submission process can not be executed while submission users are missing");
                  return;
                }
              }
            },
              error => { this.svcToaster.showFailure(error); },
              () => { this.svcFormSubmissionDlg.close(); this.svcWaitDlg.close(); }
            );
          }
        });
        resolve(true);
      }
      catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); reject(e); }
    });
  }

  private submit(sub: Submission) {
    if (sub.stateId == 4 || sub.stateId == 5) {
      sub.completed == true;
    }
    this.svcServiceRequest.submit(sub).subscribe(
      () => {
        this.svcToaster.showSuccess('Service Request # ' + sub.formId + ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments))
        this.initForm();
        this.router.navigate(['/MainForm']);
      },
      error => { this.svcToaster.showFailure(error); },
      () => { }
    );
  }
  //#endregion FormSubmission

  //#region local functions
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcServiceRequest.get(Id).subscribe(
        sr => {
          if (sr) {
            this.frmServiceRequest.disable();
            this.frmServiceRequest.controls['requestId'].setValue(sr.requestId);
            this.frmServiceRequest.controls['requestDate'].setValue(sr.requestDate);
            this.frmServiceRequest.controls['requestTypeId'].setValue(sr.requestTypeId);
            this.frmServiceRequest.controls['priorityId'].setValue(sr.priorityId);
            this.frmServiceRequest.controls['vehicleId'].setValue(sr.vehicleId);
            this.frmServiceRequest.controls['requestDetail'].setValue(sr.requestDetail);
            this.frmServiceRequest.controls['complainantId'].setValue(sr.complainantId);
            this.frmServiceRequest.controls['requestorName'].setValue(sr.requestorName);
            this.frmServiceRequest.controls['remarks'].setValue(sr.remarks);
            this.frmServiceRequest.controls['kMsReading'].setValue(sr.kMsReading);
            this.frmServiceRequest.controls['stateId'].setValue(sr.stateId);
            sr.stateName = AgilityEnum.getServiceRequestState(sr.stateId);
            this.frmServiceRequest.controls['stateName'].setValue(sr.stateName);
            this.frmServiceRequest.controls['owner'].setValue(sr.owner);
            this.frmServiceRequest.controls['completed'].setValue(sr.completed);
            this.footer = sr.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
            this.setActionBarVisibility(agFormMode.ReadOnly);
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
      this.svcServiceRequest.getLookups().subscribe(
        data => {
          this.lstRequestType = data.lstRequestType;
          this.lstAsset = data.lstAsset.filter(x => x.assetTypeId === 1);
          this.lstPriority = data.lstPriority;
          this.lstComplainant = data.lstComplainant;
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

  private validate(sr: ServiceRequest) {
    this.errors = [];
    if (sr.completed || (sr.stateName != 'New' && sr.stateName != 'Saved' && sr.stateName != 'Returned by Workshop')  ||
      sr.owner != sr.footer.createdBy ||
      sr.owner != this.currentUserId) {
      this.errors.push('No further changes can be made to this Service Request at this stage!');
    }
    if (sr.stateId == 3 && sr.owner != sr.footer.createdBy) {
      this.errors.push('The current owner of this Request is ' + sr.owner +
        '!. ' + sr.footer.createdBy + ' can make changes to SR contents provided it is returned to that user!');
    }
    if (sr.requestDate == null) {
      this.errors.push('Request Date is a required field');
    }
    if (sr.kMsReading == null) {
      this.errors.push('KM reading @ time of Service Request raised is a required field');
    }
    if (sr.requestTypeId == null) {
      this.errors.push('Complaint Type is a required field');
    }
    if (sr.priorityId == null) {
      this.errors.push('Pirority is a required field');
    }
    if (sr.vehicleId == null) {
      this.errors.push('Vehicle is a required field to lodge Service Request');
    }
  }

  private setActionBarVisibility(formMode: agFormMode) {
    this.submissionButtonsStatus = (formMode != agFormMode.ReadOnly && formMode != agFormMode.Review) ? "disabled" : "";
  }

  private disableSave() {
    if (<HTMLButtonElement>document.getElementById("btnSave"))
      (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  private initForm() {
    this.frmServiceRequest.reset();
    this.frmServiceRequest.disable();
    this.frmServiceRequest.patchValue({ stateId: 0 });
    this.errors = [];
    this.setActionBarVisibility(agFormMode.Initialize);
    this.footer = new agFooter();
  }
  //#endregion local functions
}
