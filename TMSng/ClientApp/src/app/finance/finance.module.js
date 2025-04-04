"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
const shared_module_1 = require("../shared.module");
//import { NumberDirective } from '../helper/numbers-only.directive';
const accessorialinvoice_component_1 = require("./accessorialinvoice/accessorialinvoice.component");
//import { CreditNoteComponent } from './accessorialinvoice/creditnote.component';
//import { DebitNoteComponent } from './accessorialinvoice/debitnote.component';
const banktransfer_component_1 = require("./banktransfer/banktransfer.component");
//import { RateSetupComponent } from './ratesetup/ratesetup.component';
const chequebook_component_1 = require("./chequebook/chequebook.component");
const clientrate_component_1 = require("./clientrate/clientrate.component");
const coa_component_1 = require("./coa/coa.component");
const expensereimbursement_component_1 = require("./expensereimbursement/expensereimbursement.component");
const finance_routes_1 = require("./finance.routes");
const financialperiod_component_1 = require("./financialperiod/financialperiod.component");
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
const receipt_component_1 = require("./receipt/receipt.component");
const reopenjob_component_1 = require("./reopenjob/reopenjob.component");
const uninvoice_component_1 = require("./uninvoice/uninvoice.component");
const wf_clientrate_component_1 = require("./wf_clientrate/wf_clientrate.component");
//import { agGridDateEditor } from "../helper/agGrid-date.component";
//import { AgGridModule } from "ag-grid-angular";
let FinanceModule = class FinanceModule {
};
FinanceModule = __decorate([
    core_1.NgModule({
        declarations: [accessorialinvoice_component_1.AccessorialInvoiceComponent, clientrate_component_1.ClientRateComponent, expensereimbursement_component_1.ExpenseReImbursementComponent,
            fuelpaymentrequest_component_1.FuelPaymentRequestComponent, generateinvoice_component_1.InvoiceComponent, groupinvoice_component_1.GroupInvoiceComponent, reopenjob_component_1.ReOpenJobComponent, uninvoice_component_1.UnInvoiceComponent,
            chequebook_component_1.ChequeBookComponent, coa_component_1.COAComponent, financialperiod_component_1.FinancialPeriodComponent,
            banktransfer_component_1.BankTransferComponent, arinvoice_component_1.ARInvoiceComponent, jp_component_1.JPComponent, jr_component_1.JRComponent, jv_component_1.JVComponent,
            payment_component_1.PaymentComponent, apinvoice_component_1.APInvoiceComponent, receipt_component_1.ReceiptComponent, freightrate_component_1.FreightRateComponent, wf_clientrate_component_1.WF_ClientRateComponent],
        imports: [
            router_1.RouterModule.forChild(finance_routes_1.financeRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
            //AgGridModule.withComponents([MyDateEditor])
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], FinanceModule);
exports.FinanceModule = FinanceModule;
//# sourceMappingURL=finance.module.js.map