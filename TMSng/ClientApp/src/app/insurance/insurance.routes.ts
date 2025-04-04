import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { InsClaimComponent } from './insclaim/insclaim.component';
import { InsCompanyComponent } from './inscompany/inscompany.component';
import { InsPolicyComponent } from './inspolicy/inspolicy.component';
import { InsTypeComponent } from './instype/instype.component';

export const insuranceRoutes: Routes = [
  {
    path: 'InsClaim',
    component: InsClaimComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Insurance Claim'
    }
  },

  {
    path: 'InsCompany',
    component: InsCompanyComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Insurance Company'
    }
  },

  {
    path: 'InsPolicy',
    component: InsPolicyComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Insurance Policy'
    }
  },

   {
    path: 'InsType',
    component: InsTypeComponent,
    canActivate: [AuthGuard],
    data: {
    title: 'Insurance Type'
    }
  }
]
