import { Time } from "@angular/common";
import { agFooter } from "../../helper/footer";
import { RWBEvents } from "./rwbevents";

export class RWBEvent {
  rwbNo: string;
  rwbId: number;
  eventId: number;
  //fromCityId: number;
  toCityId: number;
  vehicleId: number;
  trailerId: number;
  eventDate: Date;
  eventTime: Date;
  stateId: number;
  stateName: string;
  currentKMs: number;
  driverId1: number;
  driverId2: number;
  supplierId: number;
  outsourced: boolean;
  emptryTrip: boolean;
  rentedVehicleId: string;
  receiverName: string;
  receiverCNIC: string;
  invoiceNo: string;
  deliveryNo: string;
  shpimentNo: string;
  tonnage: number;
  applyDet: boolean;
  detGraceHRs: number;
  consigneeId: number;
  arrivalDate: Date;
  arrivalTime: Date;
  nextDepartureDate: Date;
  nextDepartureTime: Date;
  shortQty: number;
  shortRate: number;
  shortageDesc: string;

  
  //sAmount: number;
  details: RWBEvents[] = [];
  constructor() { }
}
