"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyFormComponent = void 0;
const core_1 = require("@angular/core");
const agGridHelper_1 = require("../../helper/agGridHelper");
let MyFormComponent = class MyFormComponent {
    constructor(router, formbulider, svcMyForm, Enum, svcToaster, svcWaitDlg, svcRecipient, svcHistoryDlg) {
        this.router = router;
        this.formbulider = formbulider;
        this.svcMyForm = svcMyForm;
        this.Enum = Enum;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.svcRecipient = svcRecipient;
        this.svcHistoryDlg = svcHistoryDlg;
        //#region constant variables
        this.histroyColDefs = [
            { headerName: 'Sender', field: 'sender' },
            { headerName: 'Recipient', field: 'recipient' },
            { headerName: 'State', field: 'status' },
            { headerName: 'Activity Date', field: 'activityDate' },
            { headerName: 'Comments', field: 'remarks' },
        ];
        //#endregion local functions
        //#region form Grid Definition & functions
        this.colForms = [
            {
                headerName: "Work Flow", field: "WorkFlowName", width: 110,
                cellStyle: {
                    backgroundColor: 'lightgoldenrodyellow',
                    color: 'darkgoldenrod',
                    fontWeight: 'bold'
                },
            },
            {
                headerName: "Form #", field: "formId", width: 90,
                cellRenderer: function (params) {
                    return '<a href="' + params.data.route + '?formId=' + params.value + '" title="Click to open this form">' + params.value + '</a>';
                },
                cellStyle: {
                    textDecoration: 'underline'
                }
            },
            { headerName: "State", field: "stateName", width: 160 },
            { headerName: "Sender", field: "sentBy", width: 120 },
            { headerName: "Recipient", field: "recipient", width: 120 },
            { headerName: "Sent On", field: "sentOn", width: 120 },
            {
                headerName: "Amount", field: "documentValue", type: "numericColumn", filter: "agNumberColumnFilter",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser, width: 90
            },
            { headerName: "Comments", field: "submissionComments", width: 200 },
            {
                headerName: "History", field: "WorkFlowName", width: 50, filter: false,
                cellStyle: {
                    backgroundColor: 'lightgoldenrodyellow',
                    color: 'darkgoldenrod',
                    fontWeight: 'bold'
                },
                cellRenderer: function () {
                    return 'History';
                }
            },
            // {
            //     headerName: "History", field: "History", width: 40, filter: false, 
            //     cellRenderer: function (params) {
            //         return '<a History></a'
            //     }},
            { headerName: 'WFId', field: 'workflowId', hide: true, suppressColumnsToolPanel: true },
            { headerName: 'C', field: 'route', hide: true, suppressColumnsToolPanel: true },
            { headerName: 'TK', field: 'trackingKey', hide: true, suppressColumnsToolPanel: true }
        ];
    }
    ngOnInit() {
        this.optionFormGroup = this.formbulider.group({
            options: ['0']
        });
        this.initGrid();
        this.GetMyForms(0);
    }
    //#region toolbar functions
    tbHistroy(_formId, _workFlowName, _workFlowId) {
        try {
            this.svcWaitDlg.open({});
            this.svcRecipient.getHistory(_workFlowId, _formId).subscribe(r => {
                this.svcHistoryDlg.open("History Of " + _workFlowName + " Request # " + _formId, this.histroyColDefs, r);
            }, error => { this.svcToaster.showFailure(error); }, () => { this.svcWaitDlg.close(); });
        }
        catch (e) {
            this.svcHistoryDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    tbExit() {
        this.router.navigate(['/MainForm']);
    }
    //#endregion toolbar functions
    //#region local functions
    GetMyForms(id) {
        try {
            if (id == 0) {
                this.svcMyForm.ActiveForms(this.Enum.WorkFlow('ALL')).subscribe(data => {
                    this.rowMyFormData = data;
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
            else if (id == 1) {
                this.svcMyForm.SentForms(this.Enum.WorkFlow('ALL')).subscribe(data => {
                    this.rowMyFormData = data;
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
            else if (id == 2) {
                this.svcMyForm.CompletedForms(this.Enum.WorkFlow('ALL')).subscribe(data => {
                    this.rowMyFormData = data;
                }, error => {
                    this.svcToaster.showFailure(error);
                });
            }
        }
        catch (e) {
            this.svcToaster.showFailure(e);
        }
    }
    initGrid() {
        this.grdForms = {
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
                this.grdForms.api.sizeColumnsToFit();
            }
        };
    }
    onCellClicked(event) {
        if (event.api.getFocusedCell().column.colDef.headerName == "History") {
            this.tbHistroy(event.node.data.formId, event.node.data.WorkFlowName, event.node.data.workflowId);
        }
    }
};
MyFormComponent = __decorate([
    core_1.Component({
        selector: 'app-myform',
        templateUrl: './myform.component.html',
        styleUrls: ['./myform.component.css']
    })
], MyFormComponent);
exports.MyFormComponent = MyFormComponent;
//# sourceMappingURL=myform.component.js.map