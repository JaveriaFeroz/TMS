import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AgGridModule } from "ag-grid-angular";
import { AppComponent } from './app.component';
import { MaterialModule } from './app.material.module';
import { mainRoutes } from './app.routes';
import { LoginLayoutComponent } from './common/login/login-layout.component';
import { LoginComponent } from './common/login/login.component';
import { LoginService } from './common/login/login.service';
import { MainLayoutComponent } from './common/main/main-layout.component';
import { MainComponent } from './common/main/main.component';
import { MenuComponent } from './common/menu/Menu.component';
import { MyFormComponent } from './common/myform/myform.component';
import { numFilterPipe, stringFilterPipe } from './filter.pipe';
//import { NumberDirective } from './helper/numbers-only.directive';
/*import { agDatePickerComponent } from './helper/ag-datepicker.component';*/
import { agGridDateEditor } from "./helper/agGrid-date.component";
import { agGridTimeEditor } from "./helper/agGrid-time.component";
import { agGridHelper } from './helper/agGridHelper';
import { PageNotFoundComponent } from './helper/error/page-not-found.component';
import { AuthGuard } from './helper/guard/auth.guard';
import { AuthGLGuard } from './helper/guard/auth.gl.guard';
import { AuthNonGLGuard } from './helper/guard/auth.nongl.guard';
import { AuthService } from './helper/service/auth.service';
import { SharedModule } from './shared.module';
import { PageNotAuthorizedComponent } from './helper/error/page-not-authorized.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { PrimeCellEditorComponent } from './helper/ag-editor.component';
//import { CustomDateComponent } from './helper/ag-date.component';
//import { CalendarModule } from '../../node_modules/primeng/calendar';
//import { TabContentComponent } from "./common/main/tab-content.component";
//import { ContentContainerDirective } from "./common/main/content-container.directive";
//import { TabService } from "./common/main/tab.service";
//TabContentComponent, ContentContainerDirective, TabService

@NgModule({
  declarations: [
    AppComponent, LoginComponent, LoginLayoutComponent, MainLayoutComponent, MainComponent, MenuComponent,
    PageNotFoundComponent, PageNotAuthorizedComponent, MyFormComponent, numFilterPipe, stringFilterPipe, agGridDateEditor, agGridTimeEditor],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    SharedModule.forRoot(),
    RouterModule.forRoot(mainRoutes),
    //CalendarModule,
    AgGridModule.withComponents([agGridDateEditor]),
    NgbModule
  ],
  entryComponents: [],
  providers: [LoginService, AuthService, AuthGuard, AuthGLGuard, AuthNonGLGuard, agGridHelper,
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
