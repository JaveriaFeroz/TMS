"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelRWBEventComponent = void 0;
const common_1 = require("@angular/common");
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const agFormHelper_1 = require("../../helper/agFormHelper");
const agGridHelper_1 = require("../../helper/agGridHelper");
const footer_1 = require("../../helper/footer");
let CancelRWBEventComponent = class CancelRWBEventComponent {
    //#endregion
    constructor(router, formbulider, svcCancelRWBEvent, svcToaster, svcWaitDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcCancelRWBEvent = svcCancelRWBEvent;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.optionName = 'Cancel Trip Events';
        this.errors = [];
        this.footer = new footer_1.agFooter();
        this.colLog = [
            { headerName: "Event Name", field: "eventName", width: 240 },
            { headerName: "Event Date Time", field: "eventDateTime", width: 180 },
            { headerName: "Asset #", field: "vehicleNo", width: 80 },
            {
                headerName: "KM", field: "kmReading", type: "numericColumn", width: 80,
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
            },
            { headerName: "From City", field: "fromCityName", width: 100 },
            { headerName: "To City", field: "toCityName", width: 100 },
            { headerName: "Consignee", field: "consigneeName", width: 180 },
            { headerName: "Add", field: "add", hide: true, suppressColumnsToolPanel: true },
            { headerName: "Edit", field: "edit", hide: true, suppressColumnsToolPanel: true },
            { headerName: "Delete", field: "delete", hide: true, suppressColumnsToolPanel: true }
        ];
        this.initGrid();
    }
    ngOnInit() {
        this.frmCancelEvent = this.formbulider.group({
            rwbNo: [null, [forms_1.Validators.required]],
        });
        this.frmCancelEvent.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
    }
    //#region toolbar functions
    tbRecall() {
        this.initForm();
        this.frmCancelEvent.controls.rwbNo.enable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Recall);
        this.rwbNo.nativeElement.focus();
    }
    tbEdit() {
        this.frmCancelEvent.enable();
        this.frmCancelEvent.controls.rwbNo.disable();
        agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Edit);
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
                        " that happened on and after " + common_1.formatDate(this.eventDate, "dd-MMM-yy HH:mm", "en-US") + "? This action is non-reversible!")) {
                        this.svcCancelRWBEvent.cancel(formData.rwbNo, this.eventDate).subscribe(() => {
                            this.initForm();
                            agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.Initialize);
                            this.svcToaster.showSuccess('Relevant Event(s) cancelled Successfully');
                        }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
                    }
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
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
    //#region grid setup
    initGrid() {
        this.goLog = {
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
    onCellClicked(event) {
        if (event.api.getFocusedCell().column.colDef.headerName == "Event Date Time") {
            //this.eventDate = formatDate(event.node.data.eventDateTime, 'ddMMyyyyHH:mm', 'en-US');
            this.eventDate = event.node.data.eventDateTime;
        }
    }
    //#endregion
    //#region local functions
    get(rwbNo) {
        rwbNo = agFormHelper_1.agFormHelper.padL(rwbNo);
        this.svcWaitDlg.open({});
        try {
            this.svcCancelRWBEvent.get(rwbNo).subscribe(eventLog => {
                if (eventLog) {
                    this.frmCancelEvent.disable();
                    this.frmCancelEvent.controls['rwbNo'].setValue(rwbNo);
                    this.logData = eventLog;
                    agFormHelper_1.agFormHelper.setFormControls(this.optionName, agFormHelper_1.agFormMode.ReadOnly);
                }
                else {
                    this.svcToaster.showWarning('No record found with your provided key or you don`t have access to this record');
                }
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    validate() {
        this.errors = [];
        if (!this.eventDate) {
            this.errors.push('Please select valid event date/time from list to execute cancellation, please click on event date time column in the row from where you want to cancel including onwards events');
        }
    }
    initForm() {
        this.frmCancelEvent.reset();
        this.frmCancelEvent.disable();
        this.errors = [];
        this.logData = [];
        this.eventDate = null;
    }
};
__decorate([
    core_1.ViewChild('rwbNo', { static: true })
], CancelRWBEventComponent.prototype, "rwbNo", void 0);
CancelRWBEventComponent = __decorate([
    core_1.Component({
        selector: 'app-cancelrwbevents',
        templateUrl: './cancelrwbevents.component.html',
        styleUrls: ['./cancelrwbevents.component.css']
    })
], CancelRWBEventComponent);
exports.CancelRWBEventComponent = CancelRWBEventComponent;
//# sourceMappingURL=cancelrwbevents.component.js.map