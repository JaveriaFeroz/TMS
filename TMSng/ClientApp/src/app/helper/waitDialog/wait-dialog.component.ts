import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-wait-dialog',
  templateUrl: './wait-dialog.component.html',
})

export class WaitDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data:{
    cancelText: string, confirmText: string, message: string, title: string
    },
    private mdDialogRef: MatDialogRef<WaitDialogComponent>) { }

  //public cancel() {
  //  this.close(false);
  //}

  //public close(value) {
  //  this.mdDialogRef.close(value);
  //}

  //public confirm() {
  //  this.close(true);
  //}

  //@HostListener("keydown.esc")
  //public onEsc() {
  //  this.close(false);
  //}

  //openDialog() {
  //  const dialogConfig = new MatDialogConfig();
  //  dialogConfig.disableClose = true;
  //  dialogConfig.autoFocus = true;
  //  this.dialogRef = this.dialog.open(WaitDialogComponent, dialogConfig);
  //}

  //closeDialog() {
  //  this.dialogRef.close();
  //}
}
