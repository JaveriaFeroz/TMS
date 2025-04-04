import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../app.material.module';
import { agGridHelper } from '../helper/agGridHelper';
//import { NumberDirective } from '../helper/numbers-only.directive';
import { SharedModule } from '../shared.module';
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
import { masterRoutes } from './master.routes';
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
/*import { TechnicianTypeComponent } from './techniciantype/techniciantype.component';*/
import { UserManagementComponent } from './usermanagement/usermanagement.component';
import { VehicleGroupComponent } from './VehicleGroup/VehicleGroup.component';
import { WarningTypeComponent } from './WarningType/WarningType.component';
import { WHTaxExemptionComponent } from './whtaxexemption/whtaxexemption.component';

@NgModule({
  declarations: [HoseTypeComponent, UserManagementComponent,
    ProductTypeComponent, ActivityComponent, ComplainantComponent, DetentionComponent,
    //TechnicianTypeComponent, SubContractorTypeComponent, 
    ComplaintTypeComponent, 
    SupplierComponent, ProductComponent, ShipperComponent,
    //NonInventoryProductComponent, TechnicianComponent, SubContractorComponent,
    MaintenaceSubCategoryComponent, MaintenanceChargeComponent,
    AssetComponent, AssetDocumentComponent, AccessorialChargeComponent, SKUCategoryComponent, ClientComponent,
    CompanyComponent, ConsigneeComponent, DriverComponent, ExpenseHeadComponent, CityComponent,
    SKUComponent, FuelCardComponent, GeoFenceComponent, RegionComponent, RouteComponent, RouteGroupComponent,
    SupplierRateComponent, VehicleGroupComponent, WarningTypeComponent, WHTaxExemptionComponent, ControlJobComponent],
  imports: [
    RouterModule.forChild(masterRoutes),
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    SharedModule
    //AgGridModule.withComponents([MyDateEditor])
  ],
  providers: [agGridHelper], 
})
export class MasterModule { }
