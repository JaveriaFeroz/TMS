import { agFooter } from "../../helper/footer";

export class ExpenseHead {
    expenseId:number;
    expenseName: string;
    chargeCode: string;
    accountId: number;
    advAccountId: number;
    isActive:boolean; 
    footer: agFooter;
    constructor() { this.footer = new agFooter(); }   
}
