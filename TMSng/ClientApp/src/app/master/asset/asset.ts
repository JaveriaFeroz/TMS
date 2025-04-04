import { agFooter } from "../../helper/footer";
import { AssetTyre } from "./assettyre";

export class Asset {
    assetId:number;  
    assetNo: string;
    assetTypeId: number;
    capacityId: number;
    makeId: number;
    model: string;
    purchaseDate: Date;
    leaseTypeId: number;
    supplierId: number;
    startKMs: number;
    kMs: number;
    statusId: number;
    driverId1: number;
    driverId2: number;
    trailerId: number;
    faCode: string;
    cityId: number;
    clientId: number;
    baseId: number;
    isActive: boolean;
    companyid: number;
    footer: agFooter;
    details: AssetTyre[] = [];
    constructor() { this.footer = new agFooter(); }
}
