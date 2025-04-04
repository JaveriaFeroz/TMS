import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { AssetStatusComponent } from './assetstatus/assetstatus.component';
import { AssetSwapComponent } from './assetswap/assetswap.component';
import { CancelRWBEventComponent } from './cancelrwbevents/cancelrwbevents.component';
import { JobComponent } from './job/job.component';
import { JobCloseComponent } from './jobclose/jobclose.component';
import { PMComponent } from './pm/pm.component';
import { RWBComponent } from './rwb/rwb.component';
import { RWBEventComponent } from './rwbevent/rwbevent.component';
import { RWBExpenseComponent } from './rwbexpense/rwbexpense.component';
import { RWBUpdateComponent } from './rwbupdate/rwbupdate.component';
import { ServiceRequestComponent } from './servicerequest/servicerequest.component';
import { WorkOrderComponent } from './workorder/workorder.component';
import { WOReImbComponent } from './woreimb/woreimb.component';

export const operationRoutes: Routes = [
  {
    path: 'PM', component: PMComponent, canActivate: [AuthGuard],
    data: { title: 'Preventive Maintenance' }
  },
  {
    path: 'ServiceRequest', component: ServiceRequestComponent, canActivate: [AuthGuard],
    data: { title: 'Service Request' }
  },
  {
    path: 'WorkOrder', component: WorkOrderComponent, canActivate: [AuthGuard],
    data: { title: 'Work Order' }
  },
  {
    path: 'WOReImb', component: WOReImbComponent, canActivate: [AuthGuard],
    data: { title: 'Work Orde ReImbursement' }
  },
  {
    path: 'AssetStatus', component: AssetStatusComponent, canActivate: [AuthGuard],
    data: { title: 'Asset Status' }
  },
  {
    path: 'AssetSwap', component: AssetSwapComponent, canActivate: [AuthGuard],
    data: { title: 'Asset Swap' }
  },
  {
    path: 'CancelRWBEvent', component: CancelRWBEventComponent, canActivate: [AuthGuard],
    data: { title: 'Cancel RWB Event' }
  },
  {
    path: 'Job', component: JobComponent, canActivate: [AuthGuard],
    data: { title: 'Job'}
  },
  {
    path: 'JobClose', component: JobCloseComponent, canActivate: [AuthGuard],
    data: { title: 'Job Closure' }
  },
  {
    path: 'RWB', component: RWBComponent, canActivate: [AuthGuard],
    data: { title: 'Road Way Bill'}
  },
  {
    path: 'RWBEvent', component: RWBEventComponent, canActivate: [AuthGuard],
    data: { title: 'Trip Events' }
  },
  {
    path: 'RWBExpense', component: RWBExpenseComponent, canActivate: [AuthGuard],
    data: { title: 'Rwb Expense'}
  },
  {
    path: 'RWBUpdate', component: RWBUpdateComponent, canActivate: [AuthGuard],
    data: { title: 'Trip Updates'}
  }
]
