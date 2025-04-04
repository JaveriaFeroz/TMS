"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterModule = void 0;
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const app_material_module_1 = require("../app.material.module");
const agGridHelper_1 = require("../helper/agGridHelper");
//import { NumberDirective } from '../helper/numbers-only.directive';
const shared_module_1 = require("../shared.module");
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
const master_routes_1 = require("./master.routes");
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
/*import { TechnicianTypeComponent } from './techniciantype/techniciantype.component';*/
const usermanagement_component_1 = require("./usermanagement/usermanagement.component");
const VehicleGroup_component_1 = require("./VehicleGroup/VehicleGroup.component");
const WarningType_component_1 = require("./WarningType/WarningType.component");
const whtaxexemption_component_1 = require("./whtaxexemption/whtaxexemption.component");
const maintenancecharge_component_1 = require("./maintenancecharge/maintenancecharge.component");
let MasterModule = class MasterModule {
};
MasterModule = __decorate([
    core_1.NgModule({
        declarations: [hose_type_component_1.HoseTypeComponent, usermanagement_component_1.UserManagementComponent,
            producttype_component_1.ProductTypeComponent, activity_component_1.ActivityComponent, complainant_component_1.ComplainantComponent, detention_component_1.DetentionComponent,
            //TechnicianTypeComponent, SubContractorTypeComponent, 
            complainttype_component_1.ComplaintTypeComponent, financialperiod_component_1.FinancialPeriodComponent,
            supplier_component_1.SupplierComponent, product_component_1.ProductComponent, shipper_component_1.ShipperComponent,
            //NonInventoryProductComponent, TechnicianComponent, SubContractorComponent,
            maintenacesubcategory_component_1.MaintenaceSubCategoryComponent, maintenancecharge_component_1.MaintenanceChargeComponent,
            asset_component_1.AssetComponent, assetdocument_component_1.AssetDocumentComponent, accessorialcharge_component_1.AccessorialChargeComponent, skucategory_component_1.SKUCategoryComponent, client_component_1.ClientComponent,
            company_component_1.CompanyComponent, consignee_component_1.ConsigneeComponent, driver_component_1.DriverComponent, expensehead_component_1.ExpenseHeadComponent, city_component_1.CityComponent,
            sku_component_1.SKUComponent, fuelcard_component_1.FuelCardComponent, geofence_component_1.GeoFenceComponent, region_component_1.RegionComponent, Route_component_1.RouteComponent, RouteGroup_component_1.RouteGroupComponent,
            supplierrate_component_1.SupplierRateComponent, VehicleGroup_component_1.VehicleGroupComponent, WarningType_component_1.WarningTypeComponent, whtaxexemption_component_1.WHTaxExemptionComponent, controljob_component_1.ControlJobComponent],
        imports: [
            router_1.RouterModule.forChild(master_routes_1.masterRoutes),
            forms_1.ReactiveFormsModule,
            forms_1.FormsModule,
            app_material_module_1.MaterialModule,
            shared_module_1.SharedModule
            //AgGridModule.withComponents([MyDateEditor])
        ],
        providers: [agGridHelper_1.agGridHelper],
    })
], MasterModule);
exports.MasterModule = MasterModule;
//# sourceMappingURL=master.module.js.map