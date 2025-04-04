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
exports.HistoryDialogComponent = void 0;
const core_1 = require("@angular/core");
const dialog_1 = require("@angular/material/dialog");
let HistoryDialogComponent = class HistoryDialogComponent {
    constructor(data, mdDialogRef) {
        this.data = data;
        this.mdDialogRef = mdDialogRef;
        this.gridHistory = {
            headerHeight: 25,
            rowHeight: 32,
            animateRows: true,
            floatingFilter: true,
            multiSortKey: 'ctrl',
            rowSelection: 'single',
            rowDeselection: true,
            suppressCellSelection: true,
            suppressPaginationPanel: true,
            suppressHorizontalScroll: false,
            defaultColDef: {
                sortable: true,
                filter: true,
                resizable: true,
                editable: false
            },
            onGridReady: () => {
                this.gridHistory.api.sizeColumnsToFit();
            },
            overlayLoadingTemplate: '<span class="ag-overlay-loading-center">Please wait while we are fetching requested records from database</span>',
            overlayNoRowsTemplate: '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow; color:red;">No rows available to display here</span>'
        };
        this.columnDefs = data.columnDefinitions;
        this.rowData = data.displayData;
    }
};
HistoryDialogComponent = __decorate([
    core_1.Component({
        //changeDetection: ChangeDetectionStrategy.OnPush,
        selector: 'app-history-dialog',
        templateUrl: './history-dialog.component.html',
        styleUrls: ['./history.component.css']
    }),
    __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
], HistoryDialogComponent);
exports.HistoryDialogComponent = HistoryDialogComponent;
//# sourceMappingURL=history-dialog.component.js.map