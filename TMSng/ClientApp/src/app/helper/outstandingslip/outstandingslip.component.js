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
exports.OutstandingSlipComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
const agGridHelper_1 = require("../agGridHelper");
let OutstandingSlipComponent = class OutstandingSlipComponent {
    constructor(data, //private formbulider: FormBuilder,
    svcPIV, svcToaster, svcWaitDlg, mdSlip) {
        this.svcPIV = svcPIV;
        this.svcToaster = svcToaster;
        this.svcWaitDlg = svcWaitDlg;
        this.mdSlip = mdSlip;
        this.errors = [];
        //#endregion toolbar functions    
        //#region grid setup
        this.colSlip = [
            { headerName: "Slip #", field: "slipNo", width: 135 },
            { headerName: "Slip Date", field: "slipDate", width: 105 },
            {
                headerName: "Fuel Litre ", field: "qty", width: 105, type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
            },
            {
                headerName: "Amount", field: "amount", width: 125, type: "numericColumn",
                valueFormatter: agGridHelper_1.agGridHelper.formatNumbers, valueParser: agGridHelper_1.agGridHelper.numberValueParser
            },
            {
                headerName: 'S', field: 'selected', width: 70,
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
        this.supplierId = data.supplierId;
        this.pivNo = data.pivNo;
        this.dateFrom = data.dateFrom;
        this.dateTo = data.dateTo;
    }
    ngOnInit() {
        try {
            this.slipData = JSON.parse(sessionStorage.getItem("slips"));
            if (!this.slipData || this.slipData.length == 0 && !this.pivNo) {
                this.svcPIV.getOSSlips(this.supplierId, this.dateFrom, this.dateTo).subscribe(out => {
                    if (out.length != 0) {
                        this.slipData = out;
                        this.setFooter();
                    }
                    else {
                        this.slipData = [];
                        this.svcToaster.showWarning('No oustanding fuel slip found with your selected parameters or you don`t have access to this record');
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
            var formData = this.getSlipsFromGrid();
            sessionStorage.removeItem("slips");
            sessionStorage.setItem("slips", JSON.stringify(formData));
            if (!formData.some(x => x.selected))
                this.errors.push('Atleast one slip must be selected before hitting ok button!');
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
                    this.mdSlip.close(this.totalAmount);
                }
            }
        }
        catch (e) {
            this.svcWaitDlg.close();
            this.svcToaster.showFailure(e);
        }
    }
    onClose() {
        this.mdSlip.close();
    }
    getSlipsFromGrid() {
        let rowData = [];
        this.goSlip.api.forEachNode(node => rowData.push(node.data));
        return rowData;
    }
    initGrid() {
        this.goSlip = {
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
    //#endregion
    onSelected(params) {
        if (params.column.getId() === "selected") {
            this.setFooter();
        }
    }
    setFooter() {
        try {
            let totalAmount = 0, totalQty = 0;
            this.goSlip.api.forEachNode(n => { if (n.data.selected) {
                totalAmount += n.data.amount, totalQty += n.data.qty;
            } });
            var footer = [{ slipNo: null, slipDate: null, qty: totalQty, amount: totalAmount, selected: null }];
            this.totalAmount = totalAmount;
            this.goSlip.api.setPinnedBottomRowData(footer);
        }
        catch (exception) {
            this.svcToaster.showFailure(exception);
        }
    }
    ;
};
OutstandingSlipComponent = __decorate([
    core_1.Component({
        selector: 'app-outstandingslip',
        templateUrl: './outstandingslip.component.html',
        styleUrls: ['./outstandingslip.component.css']
    }),
    __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
], OutstandingSlipComponent);
exports.OutstandingSlipComponent = OutstandingSlipComponent;
//# sourceMappingURL=outstandingslip.component.js.map