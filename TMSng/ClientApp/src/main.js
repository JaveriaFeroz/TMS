"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAPIBaseUrl = void 0;
/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
require("@angular/localize/init");
const core_1 = require("@angular/core");
const platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
//import { debug } from 'console';
const app_module_1 = require("./app/app.module");
//import { environment } from './environments/environment.dev';
//import { environment } from './environments/environment.prod';
//import { environment } from './environments/environment.uat';
const environment_1 = require("./environments/environment");
function getAPIBaseUrl() {
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
exports.getAPIBaseUrl = getAPIBaseUrl;
const providers = [
    { provide: 'API_BASE_URL', useFactory: getAPIBaseUrl, deps: [] }
];
if (environment_1.environment.production) {
    (0, core_1.enableProdMode)();
}
(0, platform_browser_dynamic_1.platformBrowserDynamic)(providers).bootstrapModule(app_module_1.AppModule)
    .catch(err => console.log(err));
//# sourceMappingURL=main.js.map