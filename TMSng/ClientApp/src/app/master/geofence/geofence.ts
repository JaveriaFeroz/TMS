import { agFooter } from "../../helper/footer";
import { GeoFenceEmail } from "./geofenceemail";

export class GeoFence {
    fenceId:number;  
    fenceName: string;
    cityId: number;
    longitude: number;
    latitude: number;
    radius: number; 
    isActive:boolean; 
    footer: agFooter;
    details: GeoFenceEmail[] = [];
    constructor() { this.footer = new agFooter(); }
   
}
