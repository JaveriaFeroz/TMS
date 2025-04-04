import { Routes } from '@angular/router';
import { AuthGLGuard } from '../helper/guard/auth.gl.guard';
import { AuthGuard } from '../helper/guard/auth.guard';
import { AuthNonGLGuard } from '../helper/guard/auth.nongl.guard';
import { AccessorialInvoiceComponent } from './accessorialinvoice/accessorialinvoice.component';
//import { CreditNoteComponent } from './accessorialinvoice/creditnote.component';
//import { DebitNoteComponent } from './accessorialinvoice/debitnote.component';
import { BankTransferComponent } from './banktransfer/banktransfer.component';
import { ChequeBookComponent } from './chequebook/chequebook.component';
import { ClientRateComponent } from './clientrate/clientrate.component';
import { COAComponent } from './coa/coa.component';
import { ExpenseReImbursementComponent } from './expensereimbursement/expensereimbursement.component';
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
//import { RateSetupComponent } from './ratesetup/ratesetup.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { ReOpenJobComponent } from './reopenjob/reopenjob.component';
import { UnInvoiceComponent } from './uninvoice/uninvoice.component';
import { WF_ClientRateComponent } from './wf_clientrate/wf_clientrate.component';


export const financeRoutes: Routes = [
  {
    path: 'AccessorialInvoice', component: AccessorialInvoiceComponent, canActivate: [AuthNonGLGuard],
    data: { title: 'Accessorial Invoice', workFlowId: 53 }
  },
  {
    path: 'DebitNote', component: AccessorialInvoiceComponent, canActivate: [AuthNonGLGuard],
    data: { title: 'Debit Note', workFlowId: 54 }
  },
  {
    path: 'CreditNote', component: AccessorialInvoiceComponent, canActivate: [AuthNonGLGuard],
    data: { title: 'Credit Note', workFlowId: 55 }
  },
  {
    path: 'ClientRate', component: ClientRateComponent, canActivate: [AuthGuard],
    data: { title: 'Client Rate' }
  },
  {
    path: 'clientRateSetup', component: WF_ClientRateComponent, canActivate: [AuthGuard],
    data: { title: 'Client Rate Setup Request' }
  },
  //{
  //  path: 'RateSetup',component: WF_ClientRateComponent,canActivate: [AuthGuard],
  //  data: { title: 'Client Rate Approval' }
  //},
  {
    path: 'ExpenseReImbursement', component: ExpenseReImbursementComponent, canActivate: [AuthNonGLGuard],
    data: { title: 'Expense ReImbursement' }
  },
  {
    path: 'PeriodClosure', component: FinancialPeriodComponent, canActivate: [AuthGuard],
    data: { title: 'Period Closure' }
  },
  {
    path: 'FuelPaymentRequest', component: FuelPaymentRequestComponent, canActivate: [AuthNonGLGuard],
    data: { title: 'Fuel Payment Request' }
  },
  {
    path: 'Invoice', component: InvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Invoice' }
  },
  {
    path: 'GroupInvoice',component: GroupInvoiceComponent,canActivate: [AuthGuard],
    data: {title: 'Group Invoice'}
  },
  {
    path: 'ReOpenJob', component: ReOpenJobComponent, canActivate: [AuthGuard],
    data: { title: 'Re Open Job' }
  },
  {
    path: 'UnInvoice', component: UnInvoiceComponent, canActivate: [AuthGuard],
    data: { title: 'Un Invoice' }
  },
  {
    path: 'ChequeBook', component: ChequeBookComponent, canActivate: [AuthGLGuard],
    data: { title: 'Cheque Book' }
  },
  {
    path: 'COA', component: COAComponent, canActivate: [AuthGLGuard],
    data: { title: 'COA' }
  },
  {
    path: 'BankTransfer', component: BankTransferComponent, canActivate: [AuthGLGuard],
    data: { title: 'Bank To Bank Transfer' }
  },
  {
    path: 'InvoiceAR', component: ARInvoiceComponent, canActivate: [AuthGLGuard],
    data: { title: 'AR Invoice' }
  },
  {
    path: 'JournalPayment', component: JPComponent, canActivate: [AuthGLGuard],
    data: { title: 'Journal Payment' }
  },
  {
    path: 'JournalReceipt', component: JRComponent, canActivate: [AuthGLGuard],
    data: { title: 'Journal Receipt' }
  },
  {
    path: 'JournalVoucher', component: JVComponent, canActivate: [AuthGLGuard],
    data: { title: 'Journal Voucher' }
  },
  //{
  //  path: 'Note', component: NoteComponent, canActivate: [AuthGuard],
  //  data: { title: 'Note' }
  //},
  {
    path: 'Payment', component: PaymentComponent, canActivate: [AuthGLGuard],
    data: { title: 'Payment' }
  },
  {
    path: 'InvoiceAP', component: APInvoiceComponent, canActivate: [AuthGLGuard],
    data: { title: 'Payment Invoice' }
  },
  {
    path: 'Receipt', component: ReceiptComponent, canActivate: [AuthGLGuard],
    data: { title: 'Receipt' }
  },
  {
    path: 'FreightRate', component: FreightRateComponent, canActivate: [AuthGuard],
    data: { title: 'Freight Rate' }
  }
]
