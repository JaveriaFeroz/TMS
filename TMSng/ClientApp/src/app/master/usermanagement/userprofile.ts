import { agFooter } from "../../helper/footer";
import { UserCompany } from "./usercompany";
import { UserBranch } from './userbranch';
import { UserOption } from './useroption';
import { UserRole } from './userrole';
import { UserCity } from './usercity';

export class UserProfile {
  userId: string;
  userName: string;
  branchName: string;
  departmentName: string;
  email: string;
  isActive: boolean;
  options: UserOption[];
  roles: UserRole[];
  branches: UserBranch[];
  cities: UserCity[];
  companies: UserCompany[];
  footer: agFooter;
  constructor() { this.footer = new agFooter(); }
}
