"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var MainLayoutComponent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainLayoutComponent = void 0;
const core_1 = require("@angular/core");
const tab_model_1 = require("./tab.model");
const hose_type_component_1 = require("../../master/hosetype/hose-type.component");
let MainLayoutComponent = MainLayoutComponent_1 = 
// implements OnInit
class MainLayoutComponent {
    constructor(router, auth) {
        this.router = router;
        this.auth = auth;
        this.tabs = new Array();
    }
    ngOnInit() {
        //this.tabService.tabSub.subscribe(tabs => {
        //  this.tabs = tabs;
        //  this.selectedTab = tabs.findIndex(tab => tab.active);
        //});
    }
    //LogOut() {
    //  this.auth.logout();
    //  sessionStorage.clear();
    //  this.router.navigate(['/login']);    
    //}
    tabChanged(event) {
        console.log("tab changed");
    }
    addNewTab() {
        this.svcTab.addTab(new tab_model_1.Tab(hose_type_component_1.HoseTypeComponent, "Sadiq", { parent: MainLayoutComponent_1 })
        //new Tab(Comp1Component, "Comp1 View", { parent: "MainComponent" })
        );
    }
    removeTab(index) {
        this.svcTab.removeTab(index);
    }
    redirectTo(uri) {
        ///alert(uri);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([uri]));
    }
};
MainLayoutComponent = MainLayoutComponent_1 = __decorate([
    core_1.Component({
        selector: 'app-main-layout',
        templateUrl: './main-layout.component.html',
        styleUrls: ['./main-layout.component.css']
    })
    // implements OnInit
], MainLayoutComponent);
exports.MainLayoutComponent = MainLayoutComponent;
//# sourceMappingURL=main-layout.component.js.map