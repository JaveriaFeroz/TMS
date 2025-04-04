import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { UnInvoiceService } from './uninvoice.service';

@Component({
  selector: 'app-uninvoice',
  templateUrl: './uninvoice.component.html',
  styleUrls: ['./uninvoice.component.css']
})

export class UnInvoiceComponent implements OnInit {
 //#region constant variables
  optionName: string = 'Un Invoice';
  //#endregion
  frmUnInvoice: any;
  errors: string[] = [];
  footer: agFooter = new agFooter(); 
  viewOption: any;
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcUnInvoice: UnInvoiceService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService)
  {
  }

  ngOnInit() {
    this.frmUnInvoice = this.formbulider.group({
      invoiceNo: [null, [Validators.required]],
    });   
  }
  //#region toolbar functions
  tbSave() {
    try {
      this.frmUnInvoice.markAllAsTouched();
      if (!this.frmUnInvoice.invalid) {
        var formData = this.frmUnInvoice.getRawValue();
        this.svcWaitDlg.open({});
        this.svcUnInvoice.unInvoice(formData.invoiceNo).subscribe(
          () => {
            this.initForm();
            this.svcToaster.showSuccess('Un invoice saved ');
          },
          error => { this.svcToaster.showFailure(error); },
          () => { this.svcWaitDlg.close(); }
        );
      }
    }
    catch (e) { this.svcWaitDlg.close(); this.svcToaster.showFailure(e); }
  }
  tbUndo() {
    this.initForm();
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }  
  //#endregion toolbar functions
  //#region local functions
  private initForm() {
    this.frmUnInvoice.reset();
    this.errors = [];  
  }
  //#endregion local functions
}



