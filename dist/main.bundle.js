webpackJsonp([1,4],{

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorPickerStore; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ColorPickerStore = (function () {
    function ColorPickerStore() {
        this.stateEvent = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* EventEmitter */]();
        this.state = {};
    }
    ColorPickerStore.prototype.getState = function () {
        return this.state;
    };
    ColorPickerStore.prototype.dispatch = function (currentState, action) {
        if (!currentState) {
            try {
                currentState = JSON.parse(localStorage.getItem('state'));
            }
            catch (err) {
                console.log(localStorage.getItem('state'));
                currentState = null;
            }
            if (!currentState) {
                currentState = { colors: [], output: 'hex', alpha: 'hex6', selectedIndex: null };
            }
        }
        var newState;
        var newColors;
        switch (action.type) {
            case 'ADD_COLOR':
                newColors = currentState.colors.slice(0);
                newColors.push(action.color);
                newState = Object.assign({}, currentState, { colors: newColors, selectedIndex: (newColors.length - 1) });
                break;
            case 'DELETE_COLOR':
                newColors = currentState.colors.slice(0, action.index).concat(currentState.colors.slice(action.index + 1)); //remove the color from the array
                //determine new selected index
                var newSelectedIndex = newColors.length - 1; //set the new index to the max it could be
                if (action.index <= newSelectedIndex)
                    newSelectedIndex = action.index; //if we are inbetween then select the same position as what we deleted
                newState = Object.assign({}, currentState, { colors: newColors, selectedIndex: newSelectedIndex });
                break;
            case 'SELECT_COLOR':
                newState = Object.assign({}, currentState, { selectedIndex: action.index });
                break;
            case 'CHANGE_COLOR':
                newState = Object.assign({}, currentState);
                break;
            case 'INIT':
                newState = Object.assign({}, currentState);
                break;
        }
        this.state = newState;
        this.stateEvent.emit(this.state);
        localStorage.setItem('state', JSON.stringify(this.state));
    };
    ColorPickerStore = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(), 
        __metadata('design:paramtypes', [])
    ], ColorPickerStore);
    return ColorPickerStore;
}());
//# sourceMappingURL=C:/src/pick-a-color/src/color-picker.store.js.map

/***/ }),

/***/ 346:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 346;


/***/ }),

/***/ 347:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(435);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(459);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(458);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=C:/src/pick-a-color/src/main.js.map

/***/ }),

/***/ 457:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__color_picker_store__ = __webpack_require__(303);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = (function () {
    function AppComponent(cpStore) {
        this.cpStore = cpStore;
    }
    AppComponent.prototype.addColor = function () {
        this.cpStore.dispatch(this.state, { type: 'ADD_COLOR', color: '#ffffff' });
    };
    AppComponent.prototype.onChangeColor = function () {
        this.cpStore.dispatch(this.state, { type: 'CHANGE_COLOR' });
    };
    AppComponent.prototype.selectColor = function (index) {
        this.cpStore.dispatch(this.state, { type: 'SELECT_COLOR', index: index });
    };
    AppComponent.prototype.delete = function (index) {
        this.cpStore.dispatch(this.state, { type: 'DELETE_COLOR', index: index });
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.cpStore.stateEvent.subscribe(function (state) {
            _this.state = state;
        });
        this.cpStore.dispatch(null, { type: 'INIT' });
    };
    AppComponent.prototype.ngOnDestroy = function () {
        this.cpStore.stateEvent.unsubscribe();
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(615),
            styles: [__webpack_require__(614)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__color_picker_store__["a" /* ColorPickerStore */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__color_picker_store__["a" /* ColorPickerStore */]) === 'function' && _a) || Object])
    ], AppComponent);
    return AppComponent;
    var _a;
}());
//# sourceMappingURL=C:/src/pick-a-color/src/app.component.js.map

/***/ }),

/***/ 458:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(136);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(425);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(457);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_color_picker__ = __webpack_require__(460);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_angular2_color_picker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_angular2_color_picker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__color_picker_store__ = __webpack_require__(303);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_5_angular2_color_picker__["ColorPickerModule"]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_6__color_picker_store__["a" /* ColorPickerStore */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=C:/src/pick-a-color/src/app.module.js.map

/***/ }),

/***/ 459:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=C:/src/pick-a-color/src/environment.js.map

/***/ }),

/***/ 614:
/***/ (function(module, exports) {

module.exports = ".color-wrapper{\r\n  display: inline-block;\r\n}\r\n\r\n.add-color {\r\n  margin-bottom: 20px;\r\n}\r\n\r\n.color-container {\r\n  border: 1px solid #000000;\r\n}\r\n\r\ndiv.color-container.selected {\r\n  border: 1px solid #5bc0de;\r\n}\r\n\r\n.color-container:hover {\r\n  border: 1px solid #8c8c8c;\r\n}\r\n\r\nform {\r\n  margin-bottom:15px;\r\n}\r\n"

/***/ }),

/***/ 615:
/***/ (function(module, exports) {

module.exports = "<section>\r\n  <div class=\"container\">\r\n    <div class=\"row add-color\">\r\n      <div class=\"col-md-1\">\r\n        <button class=\"btn btn-primary\" type=\"button\" (click)=\"addColor()\">Add Color</button>\r\n      </div>\r\n    </div>\r\n    <div class=\"row\">\r\n      <div class=\"col-md-3\" *ngIf=\"state && state.colors && state.colors.length > 0 && (state.selectedIndex || state.selectedIndex === 0)\">\r\n        <span [(colorPicker)]=\"state.colors[state.selectedIndex]\"\r\n              [cpDialogDisplay]=\"'inline'\"\r\n              [style.background]=\"state.colors[state.selectedIndex]\"\r\n              [cpToggle]=\"true\"\r\n              (colorPickerChange)=\"onChangeColor()\"></span>\r\n      </div>\r\n\r\n      <div class=\"col-md-9\">\r\n        <div class=\"row color-row\" *ngIf=\"state && state.colors\">\r\n          <div class=\"col-md-2 color-wrapper\" *ngFor=\"let color of state.colors; let i = index;\">\r\n            <button type=\"button\" class=\"close\" (click)=\"delete(i)\" aria-label=\"Close\">\r\n              <span aria-hidden=\"true\">&times;</span>\r\n            </button>\r\n            <div>{{state.colors[i]}}</div>\r\n            <div class=\"color-container\"\r\n                 [class.selected]=\"(state.selectedIndex || state.selectedIndex === 0) && state.selectedIndex === i\"\r\n                 [style.background]=\"state.colors[i]\"\r\n                 (click)=\"selectColor(i)\">&nbsp;</div>\r\n            <!--<color-comparison-color-selector [index]=\"i\"></color-comparison-color-selector>-->\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n\r\n  </div>\r\n\r\n</section>\r\n"

/***/ }),

/***/ 628:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(347);


/***/ })

},[628]);
//# sourceMappingURL=main.bundle.map