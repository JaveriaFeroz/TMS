import { agFooter } from "../../helper/footer";
import { SKUCategoryClient } from "./skucategoryclient";

export class SKUCategory {
    categoryId:number;  
    categoryName: string;    
    isActive:boolean; 
    footer: agFooter;
    details: SKUCategoryClient[] = [];
    constructor() { this.footer = new agFooter(); }
}
