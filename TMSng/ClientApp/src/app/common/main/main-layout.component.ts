import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../helper/service/auth.service';
import { TabService } from "./tab.service";
import { TabContentComponent } from "./tab-content.component"
import { Tab } from "./tab.model";
import { HoseTypeComponent } from '../../master/hosetype/hose-type.component';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})

// implements OnInit
export class MainLayoutComponent {
  tabs = new Array<Tab>();
  selectedTab: number; private svcTab: TabService
  constructor(private router: Router, private auth: AuthService ) { }

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
    this.svcTab.addTab(
      new Tab(HoseTypeComponent, "Sadiq", { parent: MainLayoutComponent })
      //new Tab(Comp1Component, "Comp1 View", { parent: "MainComponent" })
    );
  }

  removeTab(index: number): void {
    this.svcTab.removeTab(index);
  }

   redirectTo(uri:string){
     ///alert(uri);
     this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate([uri]));
   }
}
