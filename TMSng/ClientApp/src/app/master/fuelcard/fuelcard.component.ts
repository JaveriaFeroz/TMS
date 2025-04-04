import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { agFormHelper, agFormMode } from '../../helper/agFormHelper';
import { agFooter } from '../../helper/footer';
import { SearchDialogService } from '../../helper/searchDialog/search-dialog.service';
import { agToasterService } from '../../helper/service/toaster.service';
import { WaitDialogService } from '../../helper/waitDialog/wait-dialog.service';
import { FuelCard } from './fuelcard';
import { FuelCardService } from './fuelcard.service';

@Component({
  selector: 'app-fuelcard',
  templateUrl: './fuelcard.component.html',
  styleUrls: ['./fuelcard.component.css']
})

export class FuelCardComponent implements OnInit {
  //#region constant variables
  readonly optionName: string = 'Fuel Card';
  readonly colSearch =
    [
      { headerName: 'Card Id', field: 'cardId', width: 70 },
      { headerName: 'Card #', field: 'cardNo', },
      { headerName: 'Is Active', field: 'isActive', width: 70},
    ];
  //#endregion
  frmFuelCard: any;
  lstClient: any;
  lstSupplier: any;
  footer: agFooter = new agFooter();
  @ViewChild('cardNo', { static: true }) cardNo: ElementRef;
  @ViewChild('cardId', { static: true }) cardId: ElementRef;

  constructor(private router: Router, private formbulider: FormBuilder,
    private svcFuelCard: FuelCardService, private svcToaster: agToasterService,
    private svcWaitDlg: WaitDialogService, private svcSearchDlg: SearchDialogService) {
  }

  ngOnInit() {
    this.frmFuelCard = this.formbulider.group({
      cardId: [null, [Validators.required]],
      cardNo: [null, [Validators.required]],
      cardLimit: [null, [Validators.required]],
      clientId: [null],
      supplierId: [null],
      isActive: [null],
    });
    this.frmFuelCard.disable();
    this.loadLookup();
    agFormHelper.setFormControls(this.optionName, agFormMode.Initialize);
  }

  //#region toolbar functions
  tbAdd() {
    this.frmFuelCard.reset();
    this.frmFuelCard.enable();
    this.frmFuelCard.controls.cardId.disable();
    this.frmFuelCard.patchValue({ isActive: true });
    agFormHelper.setFormControls(this.optionName, agFormMode.Add);
    this.cardNo.nativeElement.focus();
  }

  tbRecall() {
    this.initForm();
    this.frmFuelCard.controls.cardId.enable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Recall);
    this.cardId.nativeElement.focus();
  } 

  tbSearch(): void {
    try {
      this.svcWaitDlg.open({});
      this.svcFuelCard.getFuelCards().subscribe(r => {
        this.svcSearchDlg.open("Search & Select Fuel Card", this.colSearch, r);
        this.svcSearchDlg.selected().subscribe(r => {
          if (r) {
            this.get(r.cardId);
          }
        });
      },
        error => { this.svcToaster.showFailure(error); },
        () => { this.svcWaitDlg.close(); });
    }
    catch (e) { this.svcSearchDlg.close(); this.svcToaster.showFailure(e); }
  }

  tbEdit() {
    this.frmFuelCard.enable();
    this.frmFuelCard.controls.cardId.disable();
    agFormHelper.setFormControls(this.optionName, agFormMode.Edit);
    this.cardNo.nativeElement.focus();
  }

  tbSave() {
    try {
      this.frmFuelCard.markAllAsTouched();

      if (!this.frmFuelCard.invalid) {
        this.svcWaitDlg.open({});
        var formData: FuelCard = this.frmFuelCard.getRawValue();
        formData.footer = this.footer;
        this.svcFuelCard.save(formData).subscribe(
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
  get(Id: number) {
    this.svcWaitDlg.open({});
    try {
      this.svcFuelCard.get(Id).subscribe(
        fuelcard => {
          if (fuelcard) {
            this.frmFuelCard.disable();
            this.frmFuelCard.controls['cardId'].setValue(fuelcard.cardId);
            this.frmFuelCard.controls['cardNo'].setValue(fuelcard.cardNo);
            this.frmFuelCard.controls['cardLimit'].setValue(fuelcard.cardLimit);
            this.frmFuelCard.controls['clientId'].setValue(fuelcard.clientId);
            this.frmFuelCard.controls['supplierId'].setValue(fuelcard.supplierId);  
            this.frmFuelCard.controls['isActive'].setValue(fuelcard.isActive);  
            this.footer = fuelcard.footer;
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
      this.svcFuelCard.getLookup().subscribe(
        data => {
          this.lstClient = data.lstClient;
          this.lstSupplier = data.lstSupplier;
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

  private initForm() {
    this.frmFuelCard.reset();
    this.frmFuelCard.disable();
    this.footer = new agFooter();
  }
  //#endregion local functions
}
