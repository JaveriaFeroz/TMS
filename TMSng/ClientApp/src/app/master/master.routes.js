"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterRoutes = void 0;
const auth_guard_1 = require("../helper/guard/auth.guard");
const accessorialcharge_component_1 = require("./accessorialcharge/accessorialcharge.component");
const activity_component_1 = require("./activity/activity.component");
const asset_component_1 = require("./asset/asset.component");
const assetdocument_component_1 = require("./assetdocument/assetdocument.component");
const city_component_1 = require("./city/city.component");
const client_component_1 = require("./client/client.component");
const company_component_1 = require("./company/company.component");
const complainant_component_1 = require("./complainant/complainant.component");
const complainttype_component_1 = require("./complainttype/complainttype.component");
const consignee_component_1 = require("./consignee/consignee.component");
const controljob_component_1 = require("./controljob/controljob.component");
const detention_component_1 = require("./detention/detention.component");
const driver_component_1 = require("./driver/driver.component");
const expensehead_component_1 = require("./expensehead/expensehead.component");
const financialperiod_component_1 = require("./financialperiod/financialperiod.component");
//import { FMSupplierComponent } from './fmsupplier/fmsupplier.component';
const fuelcard_component_1 = require("./fuelcard/fuelcard.component");
const geofence_component_1 = require("./geofence/geofence.component");
const hose_type_component_1 = require("./hosetype/hose-type.component");
const maintenacesubcategory_component_1 = require("./maintenacesubcategory/maintenacesubcategory.component");
/*import { NonInventoryProductComponent } from './noninventoryproduct/noninventoryproduct.component';*/
const product_component_1 = require("./product/product.component");
const producttype_component_1 = require("./producttype/producttype.component");
const region_component_1 = require("./region/region.component");
const Route_component_1 = require("./Route/Route.component");
const RouteGroup_component_1 = require("./RouteGroup/RouteGroup.component");
const shipper_component_1 = require("./shipper/shipper.component");
const sku_component_1 = require("./sku/sku.component");
const skucategory_component_1 = require("./skucategory/skucategory.component");
//import { SubContractorComponent } from './subcontractor/subcontractor.component';
//import { SubContractorTypeComponent } from './subcontractortype/subcontractortype.component';
const supplier_component_1 = require("./supplier/supplier.component");
const supplierrate_component_1 = require("./supplierrate/supplierrate.component");
/*import { TechnicianComponent } from './technician/technician.component';*/
//import { TechnicianTypeComponent } from './techniciantype/techniciantype.component';
const usermanagement_component_1 = require("./usermanagement/usermanagement.component");
const VehicleGroup_component_1 = require("./VehicleGroup/VehicleGroup.component");
const WarningType_component_1 = require("./WarningType/WarningType.component");
const whtaxexemption_component_1 = require("./whtaxexemption/whtaxexemption.component");
const maintenancecharge_component_1 = require("./maintenancecharge/maintenancecharge.component");
exports.masterRoutes = [
    {
        path: 'HoseType', component: hose_type_component_1.HoseTypeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Hose Type Setup' }
    },
    {
        path: 'ComplaintType', component: complainttype_component_1.ComplaintTypeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Complaint Type Setup' }
    },
    {
        path: 'Complainant', component: complainant_component_1.ComplainantComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Complainant' }
    },
    {
        path: 'Company', component: company_component_1.CompanyComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Company Setup' }
    },
    {
        path: 'Activity', component: activity_component_1.ActivityComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Activity' }
    },
    {
        path: 'MaintenanceSubCategory', component: maintenacesubcategory_component_1.MaintenaceSubCategoryComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Maintenance Sub Category Setup' }
    },
    {
        path: 'Product', component: product_component_1.ProductComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Product Setup' }
    },
    {
        path: 'ProductType', component: producttype_component_1.ProductTypeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Product Type Setup' }
    },
    {
        path: 'Supplier', component: supplier_component_1.SupplierComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Supplier Setup' }
    },
    {
        path: 'PeriodClosure', component: financialperiod_component_1.FinancialPeriodComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Period Closure' }
    },
    {
        path: 'AccessorialCharge', component: accessorialcharge_component_1.AccessorialChargeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Accessorial Charge Setup' }
    },
    {
        path: 'Asset', component: asset_component_1.AssetComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Asset Setup' }
    },
    {
        path: 'SKUCategory', component: skucategory_component_1.SKUCategoryComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'SKU Category Setup' }
    },
    {
        path: 'Client', component: client_component_1.ClientComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Client Setup' }
    },
    {
        path: 'Consignee', component: consignee_component_1.ConsigneeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Consignee Setup' }
    },
    {
        path: 'Driver', component: driver_component_1.DriverComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Driver Setup' }
    },
    {
        path: 'Detention', component: detention_component_1.DetentionComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Detention Setup' }
    },
    {
        path: 'MaintenanceSubCategory', component: driver_component_1.DriverComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Maintenance Sub Category Setup' }
    },
    {
        path: 'ExpenseHead', component: expensehead_component_1.ExpenseHeadComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Expense Head Setup' }
    },
    {
        path: 'City', component: city_component_1.CityComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'City Setup' }
    },
    {
        path: 'ClientSKU', component: sku_component_1.SKUComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Client SKU Setup' }
    },
    {
        path: 'FuelCard', component: fuelcard_component_1.FuelCardComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Fuel Card Setup' }
    },
    {
        path: 'GeoFence', component: geofence_component_1.GeoFenceComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Geo Fence Setup' }
    },
    {
        path: 'Region', component: region_component_1.RegionComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Region Setup' }
    },
    {
        path: 'Route', component: Route_component_1.RouteComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Route Setup' }
    },
    {
        path: 'RouteGroup', component: RouteGroup_component_1.RouteGroupComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Route Group Setup' }
    },
    {
        path: 'SupplierRate', component: supplierrate_component_1.SupplierRateComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Supplier Rate Setup' }
    },
    {
        path: 'Shipper', component: shipper_component_1.ShipperComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Shipper' }
    },
    {
        path: 'AssetDocument', component: assetdocument_component_1.AssetDocumentComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Asset Document' }
    },
    {
        path: 'VehicleGroup', component: VehicleGroup_component_1.VehicleGroupComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Vehicle Group Setup' }
    },
    {
        path: 'WarningType', component: WarningType_component_1.WarningTypeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Warning Type Setup' }
    },
    {
        path: 'WHTaxExemption', component: whtaxexemption_component_1.WHTaxExemptionComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'WH Tax Exemption' }
    },
    {
        path: 'ControlJob', component: controljob_component_1.ControlJobComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Control Job Setup' }
    },
    {
        path: 'UserManagement', component: usermanagement_component_1.UserManagementComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'User Management' }
    },
    {
        path: 'MaintenanceCharge', component: maintenancecharge_component_1.MaintenanceChargeComponent, canActivate: [auth_guard_1.AuthGuard],
        data: { title: 'Maintenance Charge' }
    },
];
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
//# sourceMappingURL=master.routes.js.map