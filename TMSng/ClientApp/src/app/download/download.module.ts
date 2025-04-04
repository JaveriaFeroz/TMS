import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { InoviceSummaryComponent } from '../download/invoicesummary/invoicesummary.component';
import { OpsSummaryComponent } from '../download/opssummary/opssummary.component';
import { PLSummaryComponent } from '../download/plsummary/plsummary.component';
import { TripExpenseSummaryComponent } from '../download/tripexpensesummary/tripexpensesummary.component';
import { WOReImbursementExtractComponent } from '../download/woreimbursement/woreimbursementextract.component';
import { WOExtractComponent } from '../download/workorder/woextract.component';
import { CreditFuelComponent } from '../download/creditfuel/creditfuel.component';
import { ShortageComponent } from '../download/shortage/shortage.component';
import { SupplierAgingComponent } from '../download/supplieraging/supplieraging.component';
import { ExpenseSummaryComponent } from '../download/expensesummary/expensesummary.component';
import { agGridHelper } from '../helper/agGridHelper';
//import { NumberDirective } from '../helper/numbers-only.directive';
import { SharedModule } from '../shared.module';
import { DownloadRoutes } from './download.routes';

@NgModule({
  declarations: [PLSummaryComponent, TripExpenseSummaryComponent,
    OpsSummaryComponent, InoviceSummaryComponent, WOExtractComponent, WOReImbursementExtractComponent,
    CreditFuelComponent, ShortageComponent, SupplierAgingComponent,ExpenseSummaryComponent],
  imports: [
    RouterModule.forChild(DownloadRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  providers: [agGridHelper], 
})
export class DownloadModule { }
