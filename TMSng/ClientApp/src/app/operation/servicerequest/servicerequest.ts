import { agFooter } from "../../helper/footer";

export class ServiceRequest {
  requestId: number;
  requestDate: Date;
  requestTypeId: number;
  priorityId: number;
  vehicleId: number;
  complainantId: number;
  kMsReading: number;
  requestDetail: string;
  requestorName: number;
  remarks: string;
  stateId: number;
  resolution: string;
  owner: string;
  woRaised: boolean;
  completed: boolean;
  footer: agFooter = new agFooter();
  //only used in WO reference
  branchId: number;
  stateName: string;

  constructor() {
    //this.footer = new agFooter();
    this.footer.createdBy = sessionStorage.getItem("UserId");
  }
}
