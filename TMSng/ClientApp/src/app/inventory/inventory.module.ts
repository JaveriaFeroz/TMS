import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
//import { NumberDirective } from '../helper/numbers-only.directive';
//import { NumberDirective } from '../helper/numbers-only.directive';
import { SharedModule } from '../shared.module';
import { GRNComponent } from './grn/grn.component';
import { inventoryRoutes } from './inventory.routes';
import { InvAdjustmentComponent } from './invadjustment/invadjustment.component';
import { InvTransferComponent } from './invtransfer/invtransfer.component';

@NgModule({
  declarations: [GRNComponent, InvAdjustmentComponent, InvTransferComponent],// NumberDirective
  imports: [
    RouterModule.forChild(inventoryRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule,
  ],
  providers: [agGridHelper], 
})
export class InventoryModule { }
