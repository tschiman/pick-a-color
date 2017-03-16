import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {ColorSelectorComponent} from "./color-selector/color-selector.component";
import {ColorPickerModule} from "angular2-color-picker";
import {ColorPickerStore} from "./color-picker.store";
import {ClickStopPropagationDirective} from "./click-stop-propagation.directive";

@NgModule({
  declarations: [
    AppComponent,
    ClickStopPropagationDirective,
    ColorSelectorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ColorPickerModule
  ],
  providers: [ColorPickerStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
