export interface Menu {
  menuId: number;
  menuName: string;
  parentId?: number;
  route?: string;
  subGroup?: string;
  sortOrder?: number;
}
