import { agFooter } from "../../helper/footer";
import { InsTypeDoc } from './instypedoc';

export class InsType {
    typeId:number;  
    typeName: string;
    docs: InsTypeDoc[] = [];
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }   
}
