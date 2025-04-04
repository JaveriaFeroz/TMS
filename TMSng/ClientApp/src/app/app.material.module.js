"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialModule = void 0;
const core_1 = require("@angular/core");
const autocomplete_1 = require("@angular/material/autocomplete");
const button_1 = require("@angular/material/button");
//import { MatButtonToggleModule } from '@angular/material/button-toggle';
const card_1 = require("@angular/material/card");
const checkbox_1 = require("@angular/material/checkbox");
const core_2 = require("@angular/material/core");
const datepicker_1 = require("@angular/material/datepicker");
const dialog_1 = require("@angular/material/dialog");
const divider_1 = require("@angular/material/divider");
const expansion_1 = require("@angular/material/expansion");
const form_field_1 = require("@angular/material/form-field");
//import { MatGridListModule } from '@angular/material/grid-list';
const icon_1 = require("@angular/material/icon");
const input_1 = require("@angular/material/input");
const list_1 = require("@angular/material/list");
//import { MatListModule } from '@angular/material/list';
const menu_1 = require("@angular/material/menu");
//import { MatProgressBarModule } from '@angular/material/progress-bar';
//import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
const radio_1 = require("@angular/material/radio");
const select_1 = require("@angular/material/select");
const sidenav_1 = require("@angular/material/sidenav");
const slide_toggle_1 = require("@angular/material/slide-toggle");
//import { MatSliderModule } from '@angular/material/slider';
//import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { MatSortModule } from '@angular/material/sort';
const tabs_1 = require("@angular/material/tabs");
//import { MatTableModule } from '@angular/material/table';
const toolbar_1 = require("@angular/material/toolbar");
const tooltip_1 = require("@angular/material/tooltip");
/*import { MatChipsModule } from */ '@angular/material/chips';
//import { MatTreeModule } from '@angular/material/tree';
let MaterialModule = class MaterialModule {
};
MaterialModule = __decorate([
    core_1.NgModule({
        imports: [
            autocomplete_1.MatAutocompleteModule,
            button_1.MatButtonModule,
            card_1.MatCardModule,
            checkbox_1.MatCheckboxModule,
            datepicker_1.MatDatepickerModule,
            dialog_1.MatDialogModule,
            divider_1.MatDividerModule,
            input_1.MatInputModule,
            menu_1.MatMenuModule,
            tabs_1.MatTabsModule,
            toolbar_1.MatToolbarModule,
            tooltip_1.MatTooltipModule,
            select_1.MatSelectModule,
            expansion_1.MatExpansionModule,
            //MatButtonToggleModule,
            //MatChipsModule,
            //MatExpansionModule,
            //MatGridListModule,
            icon_1.MatIconModule,
            //MatListModule,
            core_2.MatNativeDateModule,
            //MatProgressBarModule,
            //MatProgressSpinnerModule,
            radio_1.MatRadioModule,
            list_1.MatListModule,
            //MatRippleModule,
            //MatSelectModule,
            sidenav_1.MatSidenavModule,
            slide_toggle_1.MatSlideToggleModule,
            //MatSliderModule,
            //MatSnackBarModule,
            //MatSortModule,
            //MatTableModule,
            //MatTreeModule
        ],
        exports: [
            autocomplete_1.MatAutocompleteModule,
            button_1.MatButtonModule,
            card_1.MatCardModule,
            checkbox_1.MatCheckboxModule,
            datepicker_1.MatDatepickerModule,
            dialog_1.MatDialogModule,
            divider_1.MatDividerModule,
            input_1.MatInputModule,
            menu_1.MatMenuModule,
            tabs_1.MatTabsModule,
            toolbar_1.MatToolbarModule,
            tooltip_1.MatTooltipModule,
            radio_1.MatRadioModule,
            select_1.MatSelectModule,
            core_2.MatNativeDateModule,
            expansion_1.MatExpansionModule,
            list_1.MatListModule,
            //,
            //MatButtonToggleModule,
            //MatChipsModule,
            //MatExpansionModule,
            //MatGridListModule,
            icon_1.MatIconModule,
            //MatListModule,
            //MatProgressBarModule,
            //MatProgressSpinnerModule,
            //MatRadioModule,
            //MatRippleModule,
            //MatSelectModule,
            sidenav_1.MatSidenavModule,
            slide_toggle_1.MatSlideToggleModule,
            //MatSliderModule,
            //MatSnackBarModule,
            //MatSortModule,
            //MatTableModule,
            //MatTreeModule
        ],
        providers: [
            { provide: form_field_1.MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } }
        ],
    })
], MaterialModule);
exports.MaterialModule = MaterialModule;
//# sourceMappingURL=app.material.module.js.map