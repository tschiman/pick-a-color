import {Component, OnInit, Input} from "@angular/core";

@Component({
  selector: 'color-comparison-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.css']
})
export class ColorSelectorComponent implements OnInit {

  @Input() color;
  @Input() index;

  constructor() { }

  ngOnInit() {
  }

  changeColor(color: string) {
    let separator = color.includes(",") ? "," : " ";
    let rgb: string[] = color.split(separator, 3)
    if (rgb.length = 3) this.color = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
  }

}
