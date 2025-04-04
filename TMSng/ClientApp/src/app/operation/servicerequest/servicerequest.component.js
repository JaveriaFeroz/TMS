"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceRequestComponent = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const rxjs_1 = require("rxjs");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const AgilityEnum_1 = require("../../helper/AgilityEnum");
const footer_1 = require("../../helper/footer");
const submission_1 = require("../../helper/submission");
let ServiceRequestComponent = class ServiceRequestComponent {
    constructor(route, router, formbulider, svcServiceRequest, svcToaster, svcAuth, svcWaitDlg, svcSearchDlg, svcHistoryDlg, svcRecipient, svcFormSubmissionDlg) {
        this.route = route;
        this.router = router;
        this.formbulider = formbulider;
        this.svcServiceRequest = svcServiceRequest;
        this.svcToaster = svcToaster;
        this.svcAuth = svcAuth;
        this.svcWaitDlg = svcWaitDlg;
        this.svcSearchDlg = svcSearchDlg;
        this.svcHistoryDlg = svcHistoryDlg;
        this.svcRecipient = svcRecipient;
        this.svcFormSubmissionDlg = svcFormSubmissionDlg;
        //public ServiceRequests: ServiceRequest;
        //public submission: Submission;
        //ServiceRequests: ServiceRequest = new ServiceRequest();
        //submission: Submission = new Submission();
        //#region constant variables
        this.optionName = 'Service Request';
        this.colSearch = [
            { headerName: 'Request Id', field: 'requestId', width: 100 },
            { headerName: 'Date', field: 'requestDate' },
            { headerName: 'Type', field: 'requestTypeName' },
            { headerName: 'Priority', field: 'priorityName' },
            { headerName: 'Vehicle #', field: 'vehicleNo' },
            { headerName: 'Status', field: 'stateName' },
            { headerName: 'Complainant', field: 'complainantName' },
        ];
        this.colAssetHistory = [
            { headerName: 'WO #', field: 'woNo', width: 120 },
            { headerName: 'WODate', field: 'woDate', filter: 'agDateColumnFilter', valueFormatter: agGridHelper_1.agGridHelper.dateFormatter },
            { headerName: 'SR #', field: 'requestId' },
            { headerName: 'WO Type', field: 'woTypeName' },
            { headerName: 'Status', field: 'stateName' },
            { headerName: 'SR Created By', field: 'createdBy' },
            { headerName: 'MTR Reading', field: 'kmsReading', type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter' },
            { headerName: 'Estimates', field: 'estimates', type: "numericColumn", valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, filter: 'agNumberColumnFilter' },
            { headerName: 'Details', field: 'activityDetail' },
        ];
        //lstRecipient: any;
        this.errors = [];
        this.minDate = new Date(new Date().getDate() - 30);
        this.maxDate = new Date();
        this.submissionButtonsStatus = "";
        this.footer = new footer_1.agFooter();
        this.config = { childList: true, subtree: true };
        this.callback = function (mutationsList, observer) {
            for (let mutation of mutationsList) {
                if (mutation.addedNodes.length > 0) {
                    if (mutation.addedNodes[0].id === 'btnSave' && document.getElementById('btnEdit').disabled === false) {
                        mutation.addedNodes[0].disabled = true;
                    }
                }
            }
        };
        this.observer = new MutationObserver(this.callback);
        this.currentUserId = svcAuth.getUserId();
        this.loadLookup();
    }
    ngOnInit() {
        this.frmServiceRequest = this.formbulider.group({
            requestId: [null, [forms_1.Validators.required]],
            requestDate: [null, [forms_1.Validators.required]],
            requestTypeId: [null, [forms_1.Validators.required]],
            priorityId: [null, [forms_1.Validators.required]],
            vehicleId: [null, [forms_1.Validators.required]],
            requestDetail: [null, [forms_1.Validators.required]],
            complainantId: [null, [forms_1.Validators.required]],
            requestorName: [null, [forms_1.Validators.required]],
            remarks: [null],
            kMsReading: [null, [forms_1.Validators.required]],
            stateId: [null],
            stateName: [null],
            owner: [null],
            completed: [null],
        });
        this.frmServiceRequest.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
        var _formid = parseInt(this.route.snapshot.queryParamMap.get("formId"));
        if (_formid > 0) {
            this.get(_formid);
        }
        else {
            this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        }
    }
    ngAfterViewInit() {
        //it is necessary to disable save button as due to ngIf it remains active otherwise
        this.disableSave();
        this.targetNode = document.getElementById('divHToolbar'); //document.body;//document.getElementById('btnSave') as Node;
        this.observer.observe(this.targetNode, this.config);
    }
    //#region toolbar functions
    tbAdd() {
        this.frmServiceRequest.reset();
        this.frmServiceRequest.enable();
        this.frmServiceRequest.controls.requestId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Add);
        this.frmServiceRequest.patchValue({ requestDate: new Date(), stateId: 0, completed: false, stateName: "New", owner: this.currentUserId });
        //this.frmServiceRequest.controls.DocumentStatus.disable();
        this.footer.createdBy = this.currentUserId;
        this.complaintType.focus();
    }
    tbRecall() {
        this.initForm();
        this.frmServiceRequest.controls.requestId.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.requestId.nativeElement.focus();
    }
    tbSearch() {
        try {
            this.svcWaitDlg.open({});
            this.svcServiceRequest.getServiceRequests().subscribe(r => {
                this.svcSearchDlg.open("Search & Select Service Request", this.colSearch, r);
                this.svcSearchDlg.selected().subscribe(r => {
                    if (r) {
                        this.get(r.requestId);
                    }
                });
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbHistory(formId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(AgilityEnum_1.AgilityEnum.WorkFlow.ServiceRequest, formId).subscribe(r => {
                this.svcHistoryDlg.open("Service Request" + formId, agGridHelper_1.agGridHelper.colHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbAssetHistory(assetId) {
        try {
            var assetNo = this.lstAsset.find(o => o.assetId == assetId).assetNo;
            this.svcWaitDlg.open({});
            this.svcServiceRequest.getMaintenaceHistory(assetId).subscribe(r => {
                this.svcHistoryDlg.open("Asset History" + assetNo, this.colAssetHistory, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbEdit() {
        this.frmServiceRequest.enable();
        this.frmServiceRequest.controls.requestId.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
        //this.frmServiceRequest.controls.DocumentStatus.disable();
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.complaintType.focus();
    }
    tbSave() {
        try {
            this.frmServiceRequest.markAllAsTouched();
            if (!this.frmServiceRequest.invalid) {
                var formData = this.frmServiceRequest.getRawValue();
                formData.footer = this.footer;
                this.validate(formData);
                if (this.errors.length > 0) {
                    return;
                }
                this.svcWaitDlg.open({});
                this.svcServiceRequest.save(formData).subscribe(data => {
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.svcToaster.showSuccess('Service Request # ' + data.srNo + ' saved successfully. Press click Submit to proceed this request to workshop now!');
                    this.frmServiceRequest.controls['requestId'].setValue(data.srNo);
                    this.frmServiceRequest.controls['owner'].setValue(data.owner);
                    this.frmServiceRequest.controls['stateId'].setValue(1);
                    this.frmServiceRequest.controls['stateName'].setValue('Saved');
                    this.footer.createdBy = data.owner;
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (e) {
            this.svcSearchDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbUndo() {
        this.initForm();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region FormSubmission
    tbFormSubmission(formId, stateId) {
        this.svcWaitDlg.open({});
        let recipients;
        return new Promise((resolve, reject) => {
            try {
                if (stateId == 2) {
                    recipients = this.svcRecipient.getRecipients(AgilityEnum_1.AgilityEnum.WorkFlow.ServiceRequest, stateId);
                }
                else {
                    recipients = this.svcRecipient.getOwner(AgilityEnum_1.AgilityEnum.WorkFlow.ServiceRequest, formId);
                }
                rxjs_1.forkJoin([recipients]).subscribe(results => {
                    var data = results[0];
                    recipients = data["recipient"];
                    if (recipients === undefined || recipients.length == 0) {
                        this.svcToaster.showWarning("No submission user(s) are configured for current State of this Form. " +
                            "Submission process can not continue while users are missing.");
                        this.svcWaitDlg.close();
                        return;
                    }
                    else {
                        this.svcFormSubmissionDlg.open(AgilityEnum_1.AgilityEnum.getServiceRequestState(stateId) + "-" + formId, AgilityEnum_1.AgilityEnum.getServiceRequestState(stateId), recipients);
                        this.svcFormSubmissionDlg.selected().subscribe(r => {
                            if (r) {
                                if (r.recipientId !== undefined) {
                                    var submission = new submission_1.Submission();
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
                        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcFormSubmissionDlg.close(); this.svcWaitDlg.close(); });
                    }
                });
                resolve(true);
            }
            catch (e) {
                this.svcWaitDlg.close();
                this.svcToaster.showFailure(e);
                reject(e);
            }
        });
    }
    submit(sub) {
        if (sub.stateId == 4 || sub.stateId == 5) {
            sub.completed == true;
        }
        this.svcServiceRequest.submit(sub).subscribe(() => {
            this.svcToaster.showSuccess('Service Request # ' + sub.formId + ' was successfully submitted to ' + sub.owner + (sub.comments == "" ? " with no comments " : " with the comments " + sub.comments));
            this.initForm();
            this.router.navigate(['/MainForm']);
        }, error => { this.svcToaster.showFailure(error); }, () => { });
    }
    //#endregion FormSubmission
    //#region local functions
    get(Id) {
        this.svcWaitDlg.open({});
        try {
            this.svcServiceRequest.get(Id).subscribe(sr => {
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
                    sr.stateName = AgilityEnum_1.AgilityEnum.getServiceRequestState(sr.stateId);
                    this.frmServiceRequest.controls['stateName'].setValue(sr.stateName);
                    this.frmServiceRequest.controls['owner'].setValue(sr.owner);
                    this.frmServiceRequest.controls['completed'].setValue(sr.completed);
                    this.footer = sr.footer;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                    this.setActionBarVisibility(agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    loadLookup() {
        try {
            this.svcServiceRequest.getLookups().subscribe(data => {
                this.lstRequestType = data.lstRequestType;
                this.lstAsset = data.lstAsset.filter(x => x.assetTypeId === 1);
                this.lstPriority = data.lstPriority;
                this.lstComplainant = data.lstComplainant;
            }, error => {
                this.svcToaster.showFailure(error);
            });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate(sr) {
        this.errors = [];
        if (sr.completed || (sr.stateName != 'New' && sr.stateName != 'Saved' && sr.stateName != 'Returned by Workshop') ||
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
    setActionBarVisibility(formMode) {
        this.submissionButtonsStatus = (formMode != agFormHelper_1.agFormMode.ReadOnly && formMode != agFormHelper_1.agFormMode.Review) ? "disabled" : "";
    }
    disableSave() {
        if (document.getElementById("btnSave"))
            document.getElementById("btnSave").disabled = true;
    }
    initForm() {
        this.frmServiceRequest.reset();
        this.frmServiceRequest.disable();
        this.frmServiceRequest.patchValue({ stateId: 0 });
        this.errors = [];
        this.setActionBarVisibility(agFormHelper_1.agFormMode.Initialize);
        this.footer = new footer_1.agFooter();
    }
};
__decorate([
    core_1.ViewChild('requestId', { static: true })
], ServiceRequestComponent.prototype, "requestId", void 0);
__decorate([
    core_1.ViewChild('complaintType', { static: true })
], ServiceRequestComponent.prototype, "complaintType", void 0);
__decorate([
    core_1.ViewChild('btnEdit', { static: true })
], ServiceRequestComponent.prototype, "btnEdit", void 0);
ServiceRequestComponent = __decorate([
    core_1.Component({
        selector: 'app-servicerequest',
        templateUrl: './servicerequest.component.html',
        styleUrls: ['./servicerequest.component.css']
    })
], ServiceRequestComponent);
exports.ServiceRequestComponent = ServiceRequestComponent;
//# sourceMappingURL=servicerequest.component.js.map