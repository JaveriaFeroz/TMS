"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.financeRoutes = void 0;
const auth_gl_guard_1 = require("../helper/guard/auth.gl.guard");
const auth_nongl_guard_1 = require("../helper/guard/auth.nongl.guard");
const auth_guard_1 = require("../helper/guard/auth.guard");
const accessorialinvoice_component_1 = require("./accessorialinvoice/accessorialinvoice.component");
//import { CreditNoteComponent } from './accessorialinvoice/creditnote.component';
//import { DebitNoteComponent } from './accessorialinvoice/debitnote.component';
const banktransfer_component_1 = require("./banktransfer/banktransfer.component");
const chequebook_component_1 = require("./chequebook/chequebook.component");
const clientrate_component_1 = require("./clientrate/clientrate.component");
const coa_component_1 = require("./coa/coa.component");
const expensereimbursement_component_1 = require("./expensereimbursement/expensereimbursement.component");
const freightrate_component_1 = require("./freightrate/freightrate.component");
const fuelpaymentrequest_component_1 = require("./fuelpaymentrequest/fuelpaymentrequest.component");
const generateinvoice_component_1 = require("./generateinvoice/generateinvoice.component");
const groupinvoice_component_1 = require("./groupinvoice/groupinvoice.component");
const apinvoice_component_1 = require("./invoiceap/apinvoice.component");
const arinvoice_component_1 = require("./invoicear/arinvoice.component");
const jp_component_1 = require("./jp/jp.component");
const jr_component_1 = require("./jr/jr.component");
const jv_component_1 = require("./jv/jv.component");
//import { NoteComponent } from './note/note.component';
const payment_component_1 = require("./payment/payment.component");
//import { RateSetupComponent } from './ratesetup/ratesetup.component';
const receipt_component_1 = require("./receipt/receipt.component");
const reopenjob_component_1 = require("./reopenjob/reopenjob.component");
const uninvoice_component_1 = require("./uninvoice/uninvoice.component");
const wf_clientrate_component_1 = require("./wf_clientrate/wf_clientrate.component");
exports.financeRoutes = [
    {
        path: 'AccessorialInvoice', component: accessorialinvoice_component_1.AccessorialInvoiceComponent, canActivate: [auth_nongl_guard_1.AuthNonGLGuard],
        data: { title: 'Accessorial Invoice', workFlowId: 53 }
    },
    {
        path: 'DebitNote', component: accessorialinvoice_component_1.AccessorialInvoiceComponent, canActivate: [auth_nongl_guard_1.AuthNonGLGuard],
        data: { title: 'Debit Note', workFlowId: 54 }
    },
    {
        path: 'CreditNote', component: accessorialinvoice_component_1.AccessorialInvoiceComponent, canActivate: [auth_nongl_guard_1.AuthNonGLGuard],
        data: { title: 'Credit Note', workFlowId: 55 }
    },
    {
        path: 'ClientRate', component: clientrate_component_1.ClientRateComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Client Rate' }
    },
    {
        path: 'clientRateSetup', component: wf_clientrate_component_1.WF_ClientRateComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Client Rate Setup Request' }
    },
    //{
    //  path: 'RateSetup',component: WF_ClientRateComponent,canActivate: [AuthGuard],
    //  data: { title: 'Client Rate Approval' }
    //},
    {
        path: 'ExpenseReImbursement', component: expensereimbursement_component_1.ExpenseReImbursementComponent, canActivate: [auth_nongl_guard_1.AuthNonGLGuard],
        data: { title: 'Expense ReImbursement' }
    },
    {
        path: 'FuelPaymentRequest', component: fuelpaymentrequest_component_1.FuelPaymentRequestComponent, canActivate: [auth_nongl_guard_1.AuthNonGLGuard],
        data: { title: 'Fuel Payment Request' }
    },
    {
        path: 'Invoice', component: generateinvoice_component_1.InvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Invoice' }
    },
    {
        path: 'GroupInvoice', component: groupinvoice_component_1.GroupInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Group Invoice' }
    },
    {
        path: 'ReOpenJob', component: reopenjob_component_1.ReOpenJobComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Re Open Job' }
    },
    {
        path: 'UnInvoice', component: uninvoice_component_1.UnInvoiceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Un Invoice' }
    },
    {
        path: 'ChequeBook', component: chequebook_component_1.ChequeBookComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Cheque Book' }
    },
    {
        path: 'COA', component: coa_component_1.COAComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'COA' }
    },
    {
        path: 'BankTransfer', component: banktransfer_component_1.BankTransferComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Bank To Bank Transfer' }
    },
    {
        path: 'InvoiceAR', component: arinvoice_component_1.ARInvoiceComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'AR Invoice' }
    },
    {
        path: 'JournalPayment', component: jp_component_1.JPComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Journal Payment' }
    },
    {
        path: 'JournalReceipt', component: jr_component_1.JRComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Journal Receipt' }
    },
    {
        path: 'JournalVoucher', component: jv_component_1.JVComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Journal Voucher' }
    },
    //{
    //  path: 'Note', component: NoteComponent, canActivate: [AuthGuard],
    //  data: { title: 'Note' }
    //},
    {
        path: 'Payment', component: payment_component_1.PaymentComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Payment' }
    },
    {
        path: 'InvoiceAP', component: apinvoice_component_1.APInvoiceComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Payment Invoice' }
    },
    {
        path: 'Receipt', component: receipt_component_1.ReceiptComponent, canActivate: [auth_gl_guard_1.AuthGLGuard],
        data: { title: 'Receipt' }
    },
    {
        path: 'FreightRate', component: freightrate_component_1.FreightRateComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Freight Rate' }
    }
];
//# sourceMappingURL=finance.routes.js.map