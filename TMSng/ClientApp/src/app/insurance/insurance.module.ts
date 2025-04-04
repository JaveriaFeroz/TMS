import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
//import { NumberDirective } from '../helper/numbers-only.directive';
import { SharedModule } from '../shared.module';
import { insuranceRoutes } from './insurance.routes';
import { InsClaimComponent } from './insclaim/insclaim.component';
import { InsCompanyComponent } from './inscompany/inscompany.component';
import { InsPolicyComponent } from './inspolicy/inspolicy.component';
import { InsTypeComponent } from './instype/instype.component';

@NgModule({
  declarations: [InsClaimComponent, InsCompanyComponent,
    InsPolicyComponent, InsTypeComponent ],
  imports: [
    RouterModule.forChild(insuranceRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule   
  ],
  providers: [agGridHelper], 
})
export class InsuranceModule { }
