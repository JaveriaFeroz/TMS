import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { InvoiceService } from './generateinvoice.service';

@Component({
  selector: 'app-generateinvoice',
  templateUrl: './generateinvoice.component.html',
  styleUrls: ['./generateinvoice.component.css']
})

export class InvoiceComponent implements OnInit {
  //#region constant variables
  optionName: string = 'Generate Invoice'; 
  //#endregion
  frmInvoice: any;
  lstClient: any;
  errors: string[] = [];
  MinDate = new Date(new Date().getDate() - 30);
  MaxDate = new Date();
  viewOption: any;
  @ViewChild('clientid', { static: true }) clientid: MatSelect;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcInvoice: InvoiceService, private svcToaster: agToasterService, private svcWaitDlg: WaitDialogService) {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmInvoice = this.formbulider.group({
      clientId: [null, [Validators.required]],
      invoiceFrom : [null, [Validators.required]],    
      invoiceTo: [null, [Validators.required]],
      reapplyRate: [null],
      taxRate: [null],
    });     
    this.frmInvoice.enable();
  //  agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.frmInvoice.patchValue({ InvoiceFrom: new Date(), InvoiceTo: new Date(), reapplyRate:false });

  }
  //#region toolbar functions
  tbSave() {
    this.svcWaitDlg.open({});
    try {
      this.frmInvoice.markAllAsTouched();
      if (!this.frmInvoice.invalid) {
        var formData = this.frmInvoice.getRawValue();
        if (formData.invoiceFrom > formData.invoiceTo) {
          this.svcToaster.showFailure('Invoice From Date cannot  be less then  Invoice To');
          return;
        }
        else {
          this.svcInvoice.generate(formData.clientId, formData.invoiceFrom, formData.invoiceTo, formData.reapplyRate, formData.taxRate).subscribe(
            data => {
              this.initForm();
              if (data.invoiceCount > 0) {
                this.svcToaster.showSuccess(data.invoiceCount  +  ' Invoices Generated Successfully');
              }
              else {
                this.svcToaster.showFailure('No Invoice Generated');
              }
            },
            error => { this.svcToaster.showFailure(error); },
            () => { this.svcWaitDlg.close(); }
          );
        }
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbUndo() {
    this.initForm();
  //  agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  } 
  //#endregion toolbar functions

  //#region local functions
  private loadLookup() {
    try {
      this.svcInvoice.getClients().subscribe(
        data => {
          this.lstClient = data;
        },
        error => {
          this.svcToaster.showFailure(error);
        }
      );
    }
    catch (e) {
      this.svcToaster.showFailure(e);
    }
  }


  onChange(event) {
    var Client = this.lstClient;
    var Tax = Client.filter(function (item) { return item.clientId == event; }).map(function (Client) { return Client.taxRate; });
    this.frmInvoice.controls['taxRate'].setValue(Tax[0]);
  }

  private initForm() {
    this.frmInvoice.reset();
   // this.frmInvoice.disable();
    this.errors = [];
    this.frmInvoice.patchValue({ InvoiceFrom: new Date(), InvoiceTo: new Date() });
  }
  //#endregion local functions
}



