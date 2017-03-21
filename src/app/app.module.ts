import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {ColorPickerModule} from "angular2-color-picker";
import {ColorPickerStore} from "./color-picker.store";
import {ClipboardModule} from "ngx-clipboard";
import {ToastModule, ToastOptions} from "ng2-toastr";
import {CustomToastOptions} from "./custom-toast-options";
import {ColorCubeComponent} from "./color-cube/color-cube.component";

@NgModule({
  declarations: [
    AppComponent,
    ColorCubeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ColorPickerModule,
    ClipboardModule,
    ToastModule.forRoot()
  ],
  providers: [
    ColorPickerStore,
    {provide: ToastOptions, useClass: CustomToastOptions}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
