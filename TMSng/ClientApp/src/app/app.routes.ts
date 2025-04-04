import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './common/login/login-layout.component';
import { MainLayoutComponent } from './common/main/main-layout.component';
import { MyFormComponent } from './common/myform/myform.component';
import { PageNotAuthorizedComponent } from './helper/error/page-not-authorized.component';
import { PageNotFoundComponent } from './helper/error/page-not-found.component';
import { AuthGuard } from './helper/guard/auth.guard';

export const mainRoutes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginLayoutComponent, data: { title: 'Login' } },
  { path: 'notauthorized', component: PageNotAuthorizedComponent},
  { path: 'MainForm', component: MainLayoutComponent, canActivate: [AuthGuard],
    data: { title: 'Main' }
  },
  {
    path: 'common/MyForm', component: MyFormComponent, canActivate: [AuthGuard],
    data: { title: 'My Forms' }
  }, 
  { path: 'master', loadChildren: () => import('./master/master.module').then(m => m.MasterModule) },
  { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryModule) },
  { path: 'insurance', loadChildren: () => import('./insurance/insurance.module').then(m => m.InsuranceModule) },
  { path: 'operation', loadChildren: () => import('./operation/operation.module').then(m => m.OperationModule) },
  { path: 'download', loadChildren: () => import('./download/download.module').then(m => m.DownloadModule) },
  { path: 'finance', loadChildren: () => import('./finance/finance.module').then(m => m.FinanceModule) },
  { path: '**', component: PageNotFoundComponent }
]
