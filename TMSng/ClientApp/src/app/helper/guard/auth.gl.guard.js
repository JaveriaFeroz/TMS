"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGLGuard = void 0;
const core_1 = require("@angular/core");
const agFormHelper_1 = require("../agFormHelper");
let AuthGLGuard = class AuthGLGuard {
    constructor(auth, myRoute) {
        this.auth = auth;
        this.myRoute = myRoute;
    }
    canActivate(next, state) {
        if (this.auth.isLoggedIn() && agFormHelper_1.agFormHelper.enableGL()) {
            return true;
        }
        else {
            this.myRoute.navigate(["notauthorized"]);
            return false;
        }
    }
};
AuthGLGuard = __decorate([
    core_1.Injectable()
], AuthGLGuard);
exports.AuthGLGuard = AuthGLGuard;
//# sourceMappingURL=auth.gl.guard.js.map