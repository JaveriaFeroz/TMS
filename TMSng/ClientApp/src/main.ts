/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import { debug } from 'console';

import { AppModule } from './app/app.module';
//import { environment } from './environments/environment.dev';
//import { environment } from './environments/environment.prod';
//import { environment } from './environments/environment.uat';
import { environment } from './environments/environment';

export function getAPIBaseUrl() {
  return "http://localhost:22434/";
  //return "http://localhost:4200/";  
  //return "https://pkapps.pk.dsv.com/tmsAPI/";
  //if (environment.production)
  //  return "/tmsAPI/";// "https://pakistanportal.agility.com/tmsAPI/";
  //else if (environment.uat)
  //  return "/tmsAPI/"; //"http://uat-agility.com.pk:1594/tmsAPI/"; /*"http://10.141.0.11:1594/tmsAPI/";*/
  //else
  //  return "http://localhost:22434/";/*https://localhost:44311/tmsAPI/*/
}

const providers = [
  { provide: 'API_BASE_URL', useFactory: getAPIBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
