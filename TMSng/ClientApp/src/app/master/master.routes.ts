import { Routes } from '@angular/router';
import { AuthGuard } from '../helper/guard/auth.guard';
import { AccessorialChargeComponent } from './accessorialcharge/accessorialcharge.component';
import { ActivityComponent } from './activity/activity.component';
import { AssetComponent } from './asset/asset.component';
import { AssetDocumentComponent } from './assetdocument/assetdocument.component';
import { CityComponent } from './city/city.component';
import { ClientComponent } from './client/client.component';
import { CompanyComponent } from './company/company.component';
import { ComplainantComponent } from './complainant/complainant.component';
import { ComplaintTypeComponent } from './complainttype/complainttype.component';
import { ConsigneeComponent } from './consignee/consignee.component';
import { ControlJobComponent } from './controljob/controljob.component';
import { DetentionComponent } from './detention/detention.component';
import { DriverComponent } from './driver/driver.component';
import { ExpenseHeadComponent } from './expensehead/expensehead.component';
//import { FMSupplierComponent } from './fmsupplier/fmsupplier.component';
import { FuelCardComponent } from './fuelcard/fuelcard.component';
import { GeoFenceComponent } from './geofence/geofence.component';
import { HoseTypeComponent } from './hosetype/hose-type.component';
import { MaintenaceSubCategoryComponent } from './maintenacesubcategory/maintenacesubcategory.component';
import { MaintenanceChargeComponent } from './maintenancecharge/maintenancecharge.component';
/*import { NonInventoryProductComponent } from './noninventoryproduct/noninventoryproduct.component';*/
import { ProductComponent } from './product/product.component';
import { ProductTypeComponent } from './producttype/producttype.component';
import { RegionComponent } from './region/region.component';
import { RouteComponent } from './Route/Route.component';
import { RouteGroupComponent } from './RouteGroup/RouteGroup.component';
import { ShipperComponent } from './shipper/shipper.component';
import { SKUComponent } from './sku/sku.component';
import { SKUCategoryComponent } from './skucategory/skucategory.component';
//import { SubContractorComponent } from './subcontractor/subcontractor.component';
//import { SubContractorTypeComponent } from './subcontractortype/subcontractortype.component';
import { SupplierComponent } from './supplier/supplier.component';
import { SupplierRateComponent } from './supplierrate/supplierrate.component';
/*import { TechnicianComponent } from './technician/technician.component';*/
//import { TechnicianTypeComponent } from './techniciantype/techniciantype.component';
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { VehicleGroupComponent } from './VehicleGroup/VehicleGroup.component';
import { WarningTypeComponent } from './WarningType/WarningType.component';
import { WHTaxExemptionComponent } from './whtaxexemption/whtaxexemption.component';


export const masterRoutes: Routes = [
  {
    path: 'HoseType', component: HoseTypeComponent, canActivate: [AuthGuard],
    data: { title: 'Hose Type Setup' }
  },
  {
    path: 'ComplaintType', component: ComplaintTypeComponent, canActivate: [AuthGuard],
    data: { title: 'Complaint Type Setup' }
  },
  {
    path: 'Complainant', component: ComplainantComponent, canActivate: [AuthGuard],
    data: { title: 'Complainant' }
  },
  {
    path: 'Company', component: CompanyComponent, canActivate: [AuthGuard],
    data: { title: 'Company Setup' }
  },
  {
    path: 'Activity', component: ActivityComponent, canActivate: [AuthGuard],
    data: { title: 'Activity' }
  },
  {
    path: 'MaintenanceSubCategory', component: MaintenaceSubCategoryComponent, canActivate: [AuthGuard],
    data: { title: 'Maintenance Sub Category Setup' }
  },
  {
    path: 'Product', component: ProductComponent, canActivate: [AuthGuard],
    data: { title: 'Product Setup' }
  },
  {
    path: 'ProductType', component: ProductTypeComponent, canActivate: [AuthGuard],
    data: { title: 'Product Type Setup' }
  },
  {
    path: 'Supplier', component: SupplierComponent, canActivate: [AuthGuard],
    data: { title: 'Supplier Setup' }
  },
  {
    path: 'AccessorialCharge', component: AccessorialChargeComponent, canActivate: [AuthGuard],
    data: { title: 'Accessorial Charge Setup' }
  },
  {
    path: 'Asset', component: AssetComponent, canActivate: [AuthGuard],
    data: { title: 'Asset Setup' }
  },
  {
    path: 'SKUCategory', component: SKUCategoryComponent, canActivate: [AuthGuard],
    data: { title: 'SKU Category Setup' }
  },
  {
    path: 'Client', component: ClientComponent, canActivate: [AuthGuard],
    data: { title: 'Client Setup' }
  },
  {
    path: 'Consignee', component: ConsigneeComponent, canActivate: [AuthGuard],
    data: { title: 'Consignee Setup' }
  },
  {
    path: 'Driver', component: DriverComponent, canActivate: [AuthGuard],
    data: { title: 'Driver Setup' }
  },
  {
    path: 'Detention', component: DetentionComponent, canActivate: [AuthGuard],
    data: { title: 'Detention Setup' }
  },
  {
    path: 'MaintenanceSubCategory', component: DriverComponent, canActivate: [AuthGuard],
    data: { title: 'Maintenance Sub Category Setup' }
  },
  {
    path: 'ExpenseHead', component: ExpenseHeadComponent, canActivate: [AuthGuard],
    data: { title: 'Expense Head Setup' }
  },
  {
    path: 'City', component: CityComponent, canActivate: [AuthGuard],
    data: { title: 'City Setup' }
  },
  {
    path: 'ClientSKU', component: SKUComponent, canActivate: [AuthGuard],
    data: { title: 'Client SKU Setup' }
  },
  {
    path: 'FuelCard', component: FuelCardComponent, canActivate: [AuthGuard],
    data: { title: 'Fuel Card Setup' }
  },
  {
    path: 'GeoFence', component: GeoFenceComponent, canActivate: [AuthGuard],
    data: { title: 'Geo Fence Setup' }
  },
  {
    path: 'Region', component: RegionComponent, canActivate: [AuthGuard],
    data: { title: 'Region Setup' }
  },
  {
    path: 'Route', component: RouteComponent, canActivate: [AuthGuard],
    data: { title: 'Route Setup' }
  },
  {
    path: 'RouteGroup', component: RouteGroupComponent, canActivate: [AuthGuard],
    data: { title: 'Route Group Setup' }
  },
  {
    path: 'SupplierRate', component: SupplierRateComponent, canActivate: [AuthGuard],
    data: { title: 'Supplier Rate Setup' }
  },
  {
    path: 'Shipper', component: ShipperComponent, canActivate: [AuthGuard],
    data: { title: 'Shipper' }
  },
  {
    path: 'AssetDocument', component: AssetDocumentComponent, canActivate: [AuthGuard],
    data: { title: 'Asset Document' }
  },
  {
    path: 'VehicleGroup', component: VehicleGroupComponent, canActivate: [AuthGuard],
    data: { title: 'Vehicle Group Setup' }
  },
  {
    path: 'WarningType', component: WarningTypeComponent, canActivate: [AuthGuard],
    data: { title: 'Warning Type Setup' }
  },
  {
    path: 'WHTaxExemption', component: WHTaxExemptionComponent, canActivate: [AuthGuard],
    data: { title: 'WH Tax Exemption' }
  },
  {
    path: 'ControlJob', component: ControlJobComponent, canActivate: [AuthGuard],
    data: { title: 'Control Job Setup' }
  },
  {
    path: 'UserManagement', component: UserManagementComponent, canActivate: [AuthGuard],
    data: { title: 'User Management' }
  },
  {
    path: 'MaintenanceCharge', component: MaintenanceChargeComponent, canActivate: [AuthGuard],
    data: { title: 'Maintenance Charge' }
  },
]

  //{
  //  path: 'NonInventoryProduct',
  //  component: NonInventoryProductComponent,
  //  canActivate: [AuthGuard],
  //  data: {
  //    title: 'Non Inventory Product Setup'
  //  }
  //},
  //{
  //  path: 'FMSupplier',
  //  component: FMSupplierComponent,
  //  canActivate: [AuthGuard],
  //  data: {
  //    title: 'FM Supplier Setup'
  //  }
  //},
  //{
  //  path: 'Technician',
  //  component: TechnicianComponent,
  //  canActivate: [AuthGuard],
  //  data: {
  //    title: 'Technician Setup'
  //  }
  //},
  //{
  //  path: 'SubContractor',
  //  component: SubContractorComponent,
  //  canActivate: [AuthGuard],
  //  data: {
  //    title: 'Sub Contractor Setup'
  //  }
  //},

  //{
  //  path: 'SubContractorType',
  //  component: SubContractorTypeComponent,
  //  canActivate: [AuthGuard],
  //  data: {
  //    title: 'Sub Contractor Type Setup'
  //  }
  //},
  //{
  //  path: 'TechnicianType', component: TechnicianTypeComponent, canActivate: [AuthGuard],
  //  data: { title: 'Technician Type Setup' }
  //},
