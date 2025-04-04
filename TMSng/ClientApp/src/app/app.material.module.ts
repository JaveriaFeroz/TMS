import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
//import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
//import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
//import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
//import { MatProgressBarModule } from '@angular/material/progress-bar';
//import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
//import { MatSliderModule } from '@angular/material/slider';
//import { MatSnackBarModule } from '@angular/material/snack-bar';
//import { MatSortModule } from '@angular/material/sort';
import { MatTabsModule } from '@angular/material/tabs';
//import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
/*import { MatChipsModule } from */'@angular/material/chips';
//import { MatTreeModule } from '@angular/material/tree';

@NgModule({
  imports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatExpansionModule,//,
    //MatButtonToggleModule,
    //MatChipsModule,
    //MatExpansionModule,
    //MatGridListModule,
    MatIconModule,
    //MatListModule,
    MatNativeDateModule,
    //MatProgressBarModule,
    //MatProgressSpinnerModule,
    MatRadioModule,
    MatListModule,
    //MatRippleModule,
    //MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    //MatSliderModule,
    //MatSnackBarModule,
    //MatSortModule,
    //MatTableModule,
    //MatTreeModule
  ],
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatMenuModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatRadioModule,
    MatSelectModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatListModule,
    //,
    //MatButtonToggleModule,
    //MatChipsModule,
    //MatExpansionModule,
    //MatGridListModule,
    MatIconModule,
    //MatListModule,
    //MatProgressBarModule,
    //MatProgressSpinnerModule,
    //MatRadioModule,
    //MatRippleModule,
    //MatSelectModule,
    MatSidenavModule,
    MatSlideToggleModule,
    //MatSliderModule,
    //MatSnackBarModule,
    //MatSortModule,
    //MatTableModule,
    //MatTreeModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } }],
})

export class MaterialModule  { }
