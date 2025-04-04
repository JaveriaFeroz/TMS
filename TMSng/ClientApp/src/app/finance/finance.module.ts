import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
import { SharedModule } from '../shared.module';
//import { NumberDirective } from '../helper/numbers-only.directive';
import { AccessorialInvoiceComponent } from './accessorialinvoice/accessorialinvoice.component';
//import { CreditNoteComponent } from './accessorialinvoice/creditnote.component';
//import { DebitNoteComponent } from './accessorialinvoice/debitnote.component';
import { BankTransferComponent } from './banktransfer/banktransfer.component';
//import { RateSetupComponent } from './ratesetup/ratesetup.component';
import { ChequeBookComponent } from './chequebook/chequebook.component';
import { ClientRateComponent } from './clientrate/clientrate.component';
import { COAComponent } from './coa/coa.component';
import { ExpenseReImbursementComponent } from './expensereimbursement/expensereimbursement.component';
import { financeRoutes } from './finance.routes';
import { FinancialPeriodComponent } from './financialperiod/financialperiod.component';
import { FreightRateComponent } from './freightrate/freightrate.component';
import { FuelPaymentRequestComponent } from './fuelpaymentrequest/fuelpaymentrequest.component';
import { InvoiceComponent } from './generateinvoice/generateinvoice.component';
import { GroupInvoiceComponent } from './groupinvoice/groupinvoice.component';
import { APInvoiceComponent } from './invoiceap/apinvoice.component';
import { ARInvoiceComponent } from './invoicear/arinvoice.component';
import { JPComponent } from './jp/jp.component';
import { JRComponent } from './jr/jr.component';
import { JVComponent } from './jv/jv.component';
//import { NoteComponent } from './note/note.component';
import { PaymentComponent } from './payment/payment.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ReOpenJobComponent } from './reopenjob/reopenjob.component';
import { UnInvoiceComponent } from './uninvoice/uninvoice.component';
import { WF_ClientRateComponent } from './wf_clientrate/wf_clientrate.component';
//import { agGridDateEditor } from "../helper/agGrid-date.component";
//import { AgGridModule } from "ag-grid-angular";

@NgModule({
  declarations: [AccessorialInvoiceComponent, ClientRateComponent, ExpenseReImbursementComponent,
    FuelPaymentRequestComponent, InvoiceComponent, GroupInvoiceComponent, ReOpenJobComponent, UnInvoiceComponent,
    ChequeBookComponent, COAComponent, FinancialPeriodComponent,//CreditNoteComponent, DebitNoteComponent, RateSetupComponent
    BankTransferComponent, ARInvoiceComponent, JPComponent, JRComponent, JVComponent, //NoteComponent,
    PaymentComponent, APInvoiceComponent, ReceiptComponent, FreightRateComponent, WF_ClientRateComponent],
  imports: [
    RouterModule.forChild(financeRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
    //AgGridModule.withComponents([MyDateEditor])
  ],
  providers: [agGridHelper], 
})
export class FinanceModule { }
