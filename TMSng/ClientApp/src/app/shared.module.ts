import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders } from '@angular/compiler/src/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AgGridModule } from 'ag-grid-angular';
import { ToastrModule } from 'ngx-toastr';
import { MaterialModule } from './app.material.module';
import { FooterComponent } from './common/footer/footer.component';
import { FormSubmissionDialogComponent } from './helper/formsubmissionDialog/formsubmission-dialog.component';
import { FormSubmissionDialogService } from './helper/formsubmissionDialog/formsubmission-dialog.service';
import { HistoryDialogComponent } from './helper/historyDialog/history-dialog.component';
import { HistoryDialogService } from './helper/historyDialog/history-dialog.service';
import { OutstandingInvoiceComponent } from './helper/outstandinginvoice/outstandinginvoice.component';
import { OutstandingInvoiceService } from './helper/outstandinginvoice/outstandinginvoice.service';
import { OutstandingPIVComponent } from './helper/outstandingpiv/outstandingpiv.component';
import { OutstandingPIVService } from './helper/outstandingpiv/outstandingpiv.service';
import { OutstandingSlipComponent } from './helper/outstandingslip/outstandingslip.component';
import { OutstandingSlipService } from './helper/outstandingslip/outstandingslip.service';
import { OutstandingTripComponent } from './helper/outstandingtrip/outstandingtrip.component';
import { OutstandingTripService } from './helper/outstandingtrip/outstandingtrip.service';
import { SearchDialogComponent } from './helper/searchDialog/search-dialog.component';
import { SearchDialogService } from './helper/searchDialog/search-dialog.service';
import { ErrorInterceptorService } from './helper/service/errorInterceptor.service';
import { agToasterService } from './helper/service/toaster.service';
import { TokenInterceptorService } from './helper/service/tokenInterceptor.service';
import { WaitDialogComponent } from './helper/waitDialog/wait-dialog.component';
import { WaitDialogService } from './helper/waitDialog/wait-dialog.service';
//import { TabService } from "./common/main/tab.service";
//import { TabContentComponent } from "./common/main/tab-content.component";
//import { ContentContainerDirective } from "./common/main/content-container.directive";

@NgModule({
  declarations: [FooterComponent, WaitDialogComponent, SearchDialogComponent, HistoryDialogComponent, FormSubmissionDialogComponent,
    OutstandingInvoiceComponent, OutstandingPIVComponent, OutstandingSlipComponent, OutstandingTripComponent],
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, MatProgressBarModule, AgGridModule.withComponents([]),
    ToastrModule.forRoot({ timeOut: 2000, enableHtml: true })],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, FooterComponent, MatProgressBarModule, AgGridModule, ToastrModule],
  entryComponents: [WaitDialogComponent, SearchDialogComponent, HistoryDialogComponent, FormSubmissionDialogComponent,
    OutstandingInvoiceComponent, OutstandingPIVComponent, OutstandingSlipComponent, OutstandingTripComponent]
})
export class SharedModule { 
static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [WaitDialogService,
        SearchDialogService,
        HistoryDialogService,
        FormSubmissionDialogService,
        agToasterService,
        OutstandingInvoiceComponent,
        OutstandingPIVComponent,
        OutstandingSlipComponent,
        OutstandingTripComponent,
        OutstandingInvoiceService,
        OutstandingPIVService,
        OutstandingSlipService,
        OutstandingTripService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptorService,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ErrorInterceptorService,
          multi: true,
        }]
    };
  }
}
//to be used when services to be shared like search, wait etc
