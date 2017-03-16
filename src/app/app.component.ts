import {Component, OnInit} from "@angular/core";
import {ColorPickerStore} from "./color-picker.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // colors: string[] = [];
  // // outputs: string[] = ['hex', 'rgba']
  // // alphas: string[] = ['hex6', 'hex8', 'disabled']
  state: any;

  constructor(private cpStore: ColorPickerStore){}

  addColor(): void {
    this.cpStore.dispatch(this.state, {type: 'ADD_COLOR', color: '#ffffff'});
  }

  ngOnInit() {
    this.cpStore.stateEvent.subscribe((state) => {
      this.state = state;
    })
    this.cpStore.dispatch(null, {type: 'INIT'})
  }

  // onOutputChange(output: string) {
  //   let newColors: string[] = [];
  //   switch (output){
  //     case this.outputs[0]:
  //       newColors = this.colors.map((color): any => {
  //         return this.extractRgb(color);
  //       }).map((rgb) => {
  //         return this.rgbToHex(rgb[0], rgb[1], rgb[2]);
  //       });
  //       break;
  //     case this.outputs[1]:
  //       newColors = this.colors.map((color): any => {
  //         return this.hexToRgb(color);
  //       }).map((rgb) => {
  //         return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')';
  //       });
  //       break;
  //   }
  //
  //   // this.colors = [];
  //   // this.output = output;
  //   // this.colors = newColors;
  // }

  // onAlphaChange(alpha: string) {
  //   this.alpha = alpha;
  // }

  // changeColor(event) {
  //   if (event.color) {
  //     if (event.index || event.index === 0) {
  //       this.colors[event.index] = event.color;
  //     }
  //   }
  // }
  //
  // private hexToRgb(hex) {
  //   // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  //   var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  //   hex = hex.replace(shorthandRegex, function(m, r, g, b) {
  //     return r + r + g + g + b + b;
  //   });
  //
  //   var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  //   return result ? {
  //       r: parseInt(result[1], 16),
  //       g: parseInt(result[2], 16),
  //       b: parseInt(result[3], 16)
  //     } : null;
  // }
  //
  // private componentToHex(c) {
  //   var hex = c.toString(16);
  //   return hex.length == 1 ? "0" + hex : hex;
  // }
  //
  // private rgbToHex(r, g, b) {
  //   return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
  // }
  //
  // private extractRgb(rgb: string) {
  //   return rgb.substring(4, rgb.length-1)
  //     .replace(/ /g, '')
  //     .split(',');
  // }
}
