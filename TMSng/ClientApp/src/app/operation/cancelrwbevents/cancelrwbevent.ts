import { agFooter } from "../../helper/footer";
import { RWBEvents } from "./rwbevents";

export class CancelRwbEvent {
    rwbId: string;
    details: RWBEvents[] = []; 
    constructor() {  }
}
