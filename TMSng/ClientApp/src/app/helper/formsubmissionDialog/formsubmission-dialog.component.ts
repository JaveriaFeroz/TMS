import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  //changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-formsubmission-dialog',
  templateUrl: './formsubmission-dialog.component.html',
  styleUrls: ['./formsubmission.component.css']
})

export class FormSubmissionDialogComponent {
  DocumentStatus: string;
  lstRecipient: any; 
  header: any;
  SubmissionComment: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    header: string, DocumentStatus: string, Recipients: {}, recipientId: string, submissionComment: string},
    private mdDialogRef: MatDialogRef<FormSubmissionDialogComponent>) {
    this.lstRecipient = data.Recipients;
  }

  onSubmit(result) {    
    this.mdDialogRef.close(result);    
  }

  onClose() {   
    this.mdDialogRef.close(true);    
  }
}
