import {Component, OnInit, Input, ViewContainerRef, OnChanges, SimpleChanges} from "@angular/core";
import {ColorPickerService, Hsva} from "angular2-color-picker";
import {ToastsManager} from "ng2-toastr";

@Component({
  selector: 'color-comparison-color-cube',
  templateUrl: './color-cube.component.html',
  styleUrls: ['./color-cube.component.css']
})
export class ColorCubeComponent implements OnInit, OnChanges {


  @Input() color: string = null;
  @Input() output: string;
  @Input() alpha: string;
  @Input() lightSwatchCount: number;
  @Input() saturationSwatchCount: number;
  spreadColors: string[][] = [];

  constructor(private cpService: ColorPickerService, public toastr: ToastsManager, vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.createSpread();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createSpread();
  }

  showSuccess(color: string) {
    this.toastr.success(color, 'Copied to clipboard!');
  }

  private createSpread(): any {
    if (this.color) {
      let spreadColor: Hsva;
      spreadColor = this.cpService.stringToHsva(this.color, true); //if hex8 formatting returns null then we likely have a hex6 string.
      if (!spreadColor) {
        spreadColor = this.cpService.stringToHsva(this.color, false);
      }

      let spreadColors: string[][] = [];
      for (let i = 0; i < this.saturationSwatchCount; i++) { //every ith row will have a unique saturation
        let saturation: number = ((i * (100 / this.saturationSwatchCount))) / 100;
        let spreadColorRow: string[] = [];
        for (let j = 0; j < this.lightSwatchCount; j++) { //every jth column will have a unique lightness
          let value: number = ((j * (100 / this.lightSwatchCount))) / 100;
          spreadColorRow[j] = this.cpService.outputFormat(
            new Hsva(spreadColor.h, saturation, value, spreadColor.a), this.output, this.alpha === 'hex8'
          )
        }
        spreadColors[i] = spreadColorRow;
      }

      this.spreadColors = spreadColors;
    }
  }

}
