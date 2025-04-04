import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { AgilityEnum } from '../../helper/AgilityEnum';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { ChequeBook } from './chequebook';
import { ChequeBookService } from './chequebook.service';

@Component({
  selector: 'app-chequebook',
  templateUrl: './chequebook.component.html',
  styleUrls: ['./chequebook.component.css']
})

export class ChequeBookComponent implements OnInit {
  //#region form variables
  readonly optionName: string = 'Cheque Book';
  frmCB: any;
  lstBankAccount: any[];
  errors: string[] = [];
  footer: agFooter = new agFooter();
  minDate = new Date().setDate(new Date().getDate() - 30);
  maxDate = new Date();
  @ViewChild('bookName', { static: true }) bookName: ElementRef;
  @ViewChild('bookId', { static: true }) bookId: ElementRef;
  colSearch = [
    { headerName: "Book Id", field: "bookId", width: 60},
    { headerName: "Cheque Book Name", field: "bookName", width: 150 },
    { headerName: "Bank Name", field: "accountName", width: 150 },
    { headerName: "Start Chq #", field: "startChqNo", width: 120 },
    { headerName: "End Chq #", field: "endChqNo", width: 120 },
    { headerName: 'Created By', field: 'createdBy' },
    { headerName: 'Created On', field: 'createdOn' },
  ];
   //#endregion
  
  constructor(private router: Router, private formbulider: FormBuilder,
    private svcChqBook: ChequeBookService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService, private Enum: AgilityEnum)
  {
    this.loadLookup();
  }

  ngOnInit() {
    this.frmCB = this.formbulider.group({
      bookId: [null, [Validators.required]],
      bookName: [null, [Validators.required]],
      accountId: [null, [Validators.required]],
      issueDate: [null, [Validators.required]],
      prefix: [null],
      startChqNo: [null, [Validators.required]],
      endChqNo: [null, [Validators.required]],
    });
    this.frmCB.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  ngAfterViewInit() {
    //it is necessary to disable save button as due to ngIf it remains active otherwise
    (<HTMLButtonElement>document.getElementById("btnSave")).disabled = true;
  }

  //#region toolbar functions
  tbAdd() {
    this.frmCB.reset();
    this.frmCB.enable();
    this.frmCB.controls.bookId.disable();
    this.frmCB.patchValue({ issueDate: new Date() });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.bookName.nativeElement.focus();
  }

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcChqBook.getBooks().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Cheque Book", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.bookId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbRecall() {
    this.initForm();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.frmCB.controls.bookId.enable();
    this.bookId.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmCB.markAllAsTouched();
      if (!this.frmCB.invalid) {
        var formData: ChequeBook = this.frmCB.getRawValue();
        this.validate(formData);
        if (this.errors.length > 0) {
          return;
        }
        else {
          this.svcWaitDlg.open({});
          this.svcChqBook.save(formData).subscribe(
            () => {
              this.initForm();
              agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
              this.svcToaster.showSuccess('Record saved Successfully');
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
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  tbExit() {
    this.router.navigate(['/MainForm']);
  }
  //#endregion toolbar functions

  //#region local functions
  get(id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcChqBook.get(id).subscribe(
        cb => {
          if (cb) {
            this.frmCB.disable();
            this.frmCB.controls['bookId'].setValue(cb.bookId);
            this.frmCB.controls['bookName'].setValue(cb.bookName);
            this.frmCB.controls['accountId'].setValue(cb.accountId);
            this.frmCB.controls['issueDate'].setValue(new Date(cb.issueDate));
            this.frmCB.controls['prefix'].setValue(cb.prefix);
            this.frmCB.controls['startChqNo'].setValue(cb.startChqNo);
            this.frmCB.controls['endChqNo'].setValue(cb.endChqNo);
            this.footer = cb.footer;
            agFormHelper.setFormControls(this.optionName, agFormMode.ReadOnly);
          }
          else { this.svcToaster.showWarning('No record found with your provided key value or you don`t have access to this record'); }
        },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcToaster.showFailure(e); }
  }

  private loadLookup() {
    try {
      this.svcChqBook.getLookup().subscribe(
        data => {        
          this.lstBankAccount = data.lstBankAccount;
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

  private validate(cb: ChequeBook) {
    this.errors = [];
    if (cb.startChqNo > cb.endChqNo) {
      this.errors.push('End cheque # of the book must be higher than start cheque #');
    }
    if (cb.endChqNo - cb.startChqNo > 99) {
      this.errors.push('Cheque book can`t contain more than 100 leaves in single book');
    }
  }  

  private initForm() {
    this.frmCB.reset();
    this.frmCB.disable();
    this.errors = [];
    this.footer = new agFooter();
  }
  //#endregion local functions
}
