import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { GRNComponent } from './grn/grn.component';
import { InvAdjustmentComponent } from './invadjustment/invadjustment.component';
import { InvTransferComponent } from './invtransfer/invtransfer.component';

export const inventoryRoutes: Routes = [
  {
    path: 'GRN',
    component: GRNComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Goods Receipt note'
    }
  },

  {
    path: 'InvAdj',
    component: InvAdjustmentComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Inventory Adjustment'
    }
  },

  {
    path: 'InvTransfer',
    component: InvTransferComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Inventory Transfer'
    }
  }
];
