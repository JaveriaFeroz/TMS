import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../helper/service/auth.service';
import { TabService } from "./tab.service";
import { Tab } from "./tab.model";
import { HoseType } from '../../master/hosetype/hosetype';
import { HoseTypeComponent } from '../../master/hosetype/hose-type.component';

@Component({
  selector: 'app-main-content',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})

export class MainComponent {
  tabs = new Array<Tab>();
  selectedTab: number;

  constructor(private router: Router, private auth: AuthService, private tabService: TabService) { }

  ngOnInit() {
    this.tabService.tabSub.subscribe(tabs => {
      this.tabs = tabs;
      this.selectedTab = tabs.findIndex(tab => tab.active);
    });
  }

  tabChanged(event) {
    console.log("tab changed");
  }

  addNewTab() {
    this.tabService.addTab(
      new Tab(HoseTypeComponent, "Sadiq", { parent: "MainComponent" })
      //new Tab(Comp1Component, "Comp1 View", { parent: "MainComponent" })
    );
  }

  removeTab(index: number): void {
    this.tabService.removeTab(index);
  }
}
