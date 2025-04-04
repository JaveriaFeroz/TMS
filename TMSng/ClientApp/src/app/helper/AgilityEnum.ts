import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AgilityEnum {
  constructor() { }
  public readonly WOMinorMaintenance: number = 5;
  public readonly WOMajorMaintenance: number = 6;

  static getServiceRequestState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted to Workshop";
      case 3:
        return "Returned by Workshop";
      case 4:
        return "Resolved";
      case 5:
        return "Cancelled";
    }
  }

  static getWorkOrderState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted For Approval";
      case 3:
        return "Submitted To WorkShop";
      case 4:
        return "Rejected";
      case 5:
        return "Retrun";
      case 6:
        return "Resolved By Work Shop";
      case 7:
        return "Acknowledged By Operation";
      case 8:
        return "Return By Operation";
      case 11:
        return "Forward To Management";
    }
  }

  static getClientRateState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted for Approval";
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 5:
        return "Return";
      case 99:
        return "Cancelled";
    }
  }

  static getWorkFlowState(stateId: number) {
    switch (stateId) {
      case 0:
        return "New";
      case 1:
        return "Saved";
      case 2:
        return "Submitted For Approval";
      case 3:
        return "Approved";
      case 4:
        return "Rejected";
      case 5:
        return "Return";
      case 6:
        return "Resolved By Work Shop";
      case 7:
        return "Acknowledged By Operation";
      case 8:
        return "Rejected By Operation";
      case 9:
        return "Transferred (InTransit)";
      case 10:
        return "Received";
      case 99:
        return "Cancelled";
    }
  }

  //AccountTypeId(accountTypeName: string) {
  //  switch (accountTypeName) {
  //    case 'Control':
  //      return 1;
  //    case 'Subsidiary':
  //      return 2;
  //    case 'Reporting':
  //      return 3;
  //    case 'SubReporting':
  //      return 4;
  //  }
  //}

  //WorkFlowId(workflowName: string) {
  //  switch (workflowName) {
  //    case 'ALL':
  //      return 0;
  //    case 'PurchaseRequisition':
  //      return 1;
  //    case 'PurchaseOrder':
  //      return 2;
  //    case 'WorkOrder':
  //      return 3;
  //    case 'MaterialRequest':
  //      return 4;
  //    case 'GRN':
  //      return 5;
  //    case 'MaterialIssuance':
  //      return 6;
  //    case 'InventoryAdjustment':
  //      return 7;
  //    case 'InventoryTransfer':
  //      return 8;
  //    case 'ServiceRequest':
  //      return 9;
  //    case 'RateSetup':
  //      return 13;
  //  }
  //}
  //format(strText: string) {
  //  strText = this.padLeft(strText, "0", 10);
  //  return strText;
  //}

  //padLeft(text: string, padChar: string, size: number): string {
  //  return (String(padChar).repeat(size) + text).substr(size * -1, size).toString();
  //}
}

export namespace AgilityEnum {
  export enum WorkFlow {
    ALL = 0, PurchaseRequisition = 1, PurchaseOrder = 2, WorkOrder = 3, MaterialRequest = 4,
    GRN = 5, MaterialIssuance = 6, InventoryAdjustment = 7, InventoryTransfer = 8,
    ServiceRequest = 9, RateSetup = 13
  }

  export enum AccountType {
    'Control' = 1, 'Subsidiary' = 2, 'Reporting' = 3, 'SubReporting' = 4
  }
}
