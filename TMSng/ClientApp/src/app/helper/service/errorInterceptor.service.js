"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorInterceptorService = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
let ErrorInterceptorService = class ErrorInterceptorService {
    constructor(svcToaster) {
        this.svcToaster = svcToaster;
    }
    intercept(request, next) {
        return next.handle(request).pipe(operators_1.catchError((error) => {
            if (error.error instanceof Error) {
                // A client-side or network error occurred. Handle it accordingly.
                if (error.error.message != undefined)
                    this.svcToaster.showFailure('An error occurred:' + error.error.message, "Http Error");
                else
                    this.svcToaster.showFailure('An error occurred:' + error.message, "Http Error");
            }
            else if (error.error) {
                // The backend returned an unsuccessful response code.
                if (error.error.title)
                    this.svcToaster.showFailure(`${error.error.title}`, `${error.statusText}:`);
                else if (error.error.message)
                    this.svcToaster.showFailure(`${error.error.message}`, `${error.error.fieldName}:`);
                else if (error.message)
                    this.svcToaster.showFailure(`${error.message}`, `${error.statusText}:`);
                else
                    this.svcToaster.showFailure(`${error.error.substring(0, 200)}`, `${error.statusText}:`);
            }
            else {
                this.svcToaster.showFailure(`${error.error}`, `${error.statusText}:`);
            }
            return rxjs_1.EMPTY;
        }));
    }
};
ErrorInterceptorService = __decorate([
    core_1.Injectable()
], ErrorInterceptorService);
exports.ErrorInterceptorService = ErrorInterceptorService;
//# sourceMappingURL=errorInterceptor.service.js.map