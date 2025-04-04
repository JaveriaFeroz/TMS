import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
//import { NumberDirective } from '../helper/numbers-only.directive';
import { SharedModule } from '../shared.module';
import { AssetStatusComponent } from './assetstatus/assetstatus.component';
import { AssetSwapComponent } from './assetswap/assetswap.component';
import { CancelRWBEventComponent } from './cancelrwbevents/cancelrwbevents.component';
import { JobComponent } from './job/job.component';
import { JobCloseComponent } from './jobclose/jobclose.component';
import { operationRoutes } from './operation.routes';
import { PMComponent } from './pm/pm.component';
import { RWBComponent } from './rwb/rwb.component';
import { RWBEventComponent } from './rwbevent/rwbevent.component';
import { RWBExpenseComponent } from './rwbexpense/rwbexpense.component';
import { RWBUpdateComponent } from './rwbupdate/rwbupdate.component';
import { ServiceRequestComponent } from './servicerequest/servicerequest.component';
import { WorkOrderComponent } from './workorder/workorder.component';
import { WOReImbComponent } from './woreimb/woreimb.component';

@NgModule({
  declarations: [PMComponent, ServiceRequestComponent,
    WorkOrderComponent, WOReImbComponent,
    AssetStatusComponent, AssetSwapComponent, CancelRWBEventComponent, JobComponent, JobCloseComponent,
    RWBComponent, RWBEventComponent, RWBExpenseComponent, RWBUpdateComponent],
  imports: [
    RouterModule.forChild(operationRoutes),
    ReactiveFormsModule, FormsModule, MaterialModule, SharedModule    
  ],
  providers: [agGridHelper], 
})
export class OperationModule { }
