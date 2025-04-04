"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchDialogService = void 0;
const core_1 = require("@angular/core");
const operators_1 = require("rxjs/operators");
const search_dialog_component_1 = require("../searchDialog/search-dialog.component");
let SearchDialogService = class SearchDialogService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open(title, colDefs, rowData) {
        this.dlgSearch = this.dialog.open(search_dialog_component_1.SearchDialogComponent, {
            data: {
                header: title,
                columnDefinitions: colDefs,
                displayData: rowData
            },
            height: '90vh',
            width: '95vw',
        });
    }
    selected() {
        return this.dlgSearch.afterClosed().pipe(operators_1.take(1), operators_1.map(res => { return res; }));
    }
    close() {
        if (this.dlgSearch)
            this.dlgSearch.close();
    }
};
SearchDialogService = __decorate([
    core_1.Injectable()
], SearchDialogService);
exports.SearchDialogService = SearchDialogService;
//# sourceMappingURL=search-dialog.service.js.map