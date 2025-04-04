"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutstandingTripComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
const agGridHelper_1 = require("../agGridHelper");
let OutstandingTripComponent = class OutstandingTripComponent {
    constructor(data, formbulider, svcJP, svcToaster, svcWaitDlg, mdTrip) {
        this.formbulider = formbulider;
        this.svcJP = svcJP;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.mdTrip = mdTrip;
        this.errors = [];
        //#endregion toolbar functions
        //#region grid setup
        this.colTrip = [
            { headerName: "RWB #", field: "rwbNo", width: 105 },
            { headerName: "Job #", field: "jobNo", width: 105 },
            { headerName: "Document #", field: "clientRefNo", width: 105 },
            { headerName: "Pack Slip #", field: "packSlipNo", width: 105 },
            { headerName: "Vehicle #", field: "vehicleNo", width: 105 },
            { headerName: "Departure Date", field: "departureDate", width: 105 },
            { headerName: "Job Close Date", field: "jobCloseDate", width: 105 }, {
                headerName: "Total Expense", field: "amount", width: 125, type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
            },
            {
                headerName: 'S', field: 'selected', width: 60,
                cellRenderer: params => {
                    if (params.node.isRowPinned()) {
                        return null;
                    }
                    else if (params.value) {
                        return "<input type='checkbox' checked />";
                    }
                    else {
                        return "<input type='checkbox'/>";
                    }
                },
                cellEditor: agGridHelper_1.agGridHelper.getCellCheckBox()
            }
        ];
        this.initGrid();
        this.clientId = data.clientId;
        this.voucherNo = data.voucherNo;
        this.dateFrom = data.dateFrom;
        this.dateTo = data.dateTo;
    }
    ngOnInit() {
        try {
            this.tripData = JSON.parse(sessionStorage.getItem("trips"));
            if (!this.tripData || this.tripData.length == 0 && !this.voucherNo) {
                this.svcJP.getOSTrips(this.clientId, this.dateFrom, this.dateTo).subscribe(out => {
                    if (out.length != 0) {
                        this.tripData = out;
                        this.setFooter();
                    }
                    else {
                        this.tripData = [];
                        this.svcToaster.showWarning('No oustanding Trips found with your selected parameters or you don`t have access to this record');
                    }
                }, error => {
                    this.svcToaster.showFailure(error);
                }, () => { this.svcWaitDlg.close(); });
            }
        }
        catch (exception) {
            this.svcToaster.showFailure(exception, "Error Occured");
        }
    }
    //#region toolbar functions
    onSubmit() {
        try {
            this.errors = [];
            var formData = this.getTripsFromGrid();
            sessionStorage.removeItem("trips");
            sessionStorage.setItem("trips", JSON.stringify(formData));
            if (!formData.some(x => x.selected))
                this.errors.push('Atleast one Trip must be selected before hitting ok button!');
            if (this.errors.length > 0) {
                alert(this.errors);
                return;
            }
            else {
                this.setFooter();
                if (this.totalAmount == 0) {
                    this.errors.push('The total amount of slips selected for Invoice must be greater than zero!');
                }
                else {
                    this.mdTrip.close(this.totalAmount);
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    onClose() {
        this.mdTrip.close();
    }
    getTripsFromGrid() {
        let rowData = [];
        this.goTrip.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    initGrid() {
        this.goTrip = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            defaultColDef: {
                editable: false,
                sortable: true
            },
            rowSelection: 'single',
            onCellClicked: function (event) {
                if (event.colDef.field == "selected") {
                    event.node.setDataValue('selected', !event.data.selected);
                }
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>',
            onGridReady: () => {
                this.setFooter();
            }
        };
    }
    onSelected(params) {
        if (params.column.getId() === "selected") {
            this.setFooter();
        }
    }
    setFooter() {
        try {
            let totalAmount = 0;
            this.goTrip.api.forEachNode(n => { if (n.data.selected) {
                totalAmount += n.data.amount;
            } });
            var footer = [{ rwbNo: null, amount: totalAmount, selected: null }];
            this.totalAmount = totalAmount;
            this.goTrip.api.setPinnedBottomRowData(footer);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
};
OutstandingTripComponent = __decorate([
    core_1.Component({
        selector: 'app-outstandingtrip',
        templateUrl: './outstandingtrip.component.html',
        styleUrls: ['./outstandingtrip.component.css']
    }),
    __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
], OutstandingTripComponent);
exports.OutstandingTripComponent = OutstandingTripComponent;
//# sourceMappingURL=outstandingtrip.component.js.map