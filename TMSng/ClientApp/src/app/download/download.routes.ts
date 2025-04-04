import { Routes } from '@angular/router';
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
import { AuthGuard } from '../helper/guard/auth.guard';

export const DownloadRoutes: Routes = [
  {
    path: 'PLSummary',
    component: PLSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Profit and Loss'
    }
  },

  {
    path: 'TripExpenseSummary',
    component: TripExpenseSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'TWB Expense Report'
    }
  },

  {
    path: 'OpsSummary',
    component: OpsSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Operational MIS Data Extract'
    }
  },

  {
    path: 'InvoiceSummary',
    component: InoviceSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Invoice Summary'
    }
  },

  {
    path: 'WorkOrderExtract', component: WOExtractComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'List of Work Orders & Service Request '
    }
  },

  {
    path: 'WOReImbursementExtract', component: WOReImbursementExtractComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Work Order ReImbursement Extract'
    }
  },

  {
    path: 'CreditFuel', component: CreditFuelComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'CreditFuel Extract'
    }
  },

  {
    path: 'Shortage', component: ShortageComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Shortage Extract'
    }
  },

  {
    path: 'SupplierAging', component: SupplierAgingComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Supplier Aging'
    }
  },

  {
    path: 'ExpenseSummary', component: ExpenseSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Expense Summary'
    }
  },

 
]
