"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoryDialogService = void 0;
const core_1 = require("@angular/core");
const history_dialog_component_1 = require("../historyDialog/history-dialog.component");
let HistoryDialogService = class HistoryDialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open(title, colDefs, rowData) {
        this.dialogRef = this.dialog.open(history_dialog_component_1.HistoryDialogComponent, {
            data: {
                header: title,
                columnDefinitions: colDefs,
                displayData: rowData
            },
            height: '92vh',
            width: '95vw',
        });
    }
    close() {
        this.dialogRef.close();
    }
};
HistoryDialogService = __decorate([
    core_1.Injectable()
], HistoryDialogService);
exports.HistoryDialogService = HistoryDialogService;
//# sourceMappingURL=history-dialog.service.js.map