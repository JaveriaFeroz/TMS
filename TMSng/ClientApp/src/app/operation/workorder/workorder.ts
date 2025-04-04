import { agFooter } from '../../helper/footer';
import { WOActivity } from './woactivity';
import { WOEstInventory } from './woestinventory';
import { WOEstOtherCharges } from './woestothercharges';
import { WOInventory } from './woinventory';
import { WOOtherCharges } from './woothercharges';

export class WorkOrder {
  woId: number;
  woNo: string;
  woDate: Date;
  branchId: number;
  //departmentCode:string; 
  vehicleId: number;
  subCategoryId: number;
  supplierId: number;
  kMsReading: number;
  estDuration: number;
  priorityId: number;
  requestId: number;
  activityDetail: string;
  owner: string;
  completed: boolean;
  stateId: number;
  stateName: string;
  //documentStatus:string;
  companyid: number;
  woTypeId: number;
  remarks: string;
  activities: WOActivity[] = [];
  estInventories: WOEstInventory[] = [];
  estOtherChgs: WOEstOtherCharges[] = [];
  inventories: WOInventory[] = [];
  otherCharges: WOOtherCharges[] = [];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
 
}
      
       

