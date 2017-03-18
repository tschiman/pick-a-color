import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {ColorPickerModule} from "angular2-color-picker";
import {ColorPickerStore} from "./color-picker.store";
import {ClipboardModule} from "ngx-clipboard";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ColorPickerModule,
    ClipboardModule
  ],
  providers: [ColorPickerStore],
  bootstrap: [AppComponent]
})
export class AppModule { }
