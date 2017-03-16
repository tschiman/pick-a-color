import {Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter} from "@angular/core";
import {ColorPickerStore} from "../color-picker.store";

@Component({
  selector: 'color-comparison-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.css']
})
export class ColorSelectorComponent implements OnInit {

  @Input() index: number;
  private state: any;

  constructor(private cpStore: ColorPickerStore) { }

  ngOnInit() {
    this.cpStore.stateEvent.subscribe((state) => {
      this.state = state;
    });
    this.state = this.cpStore.getState();
  }

  close() {
    this.cpStore.dispatch(this.state, {type: 'DELETE_COLOR', index: this.index});
  }

  onChangeColor(color: string) {
    console.log(event + " index: " + this.index);
    this.cpStore.dispatch(this.state, {type: 'CHANGE_COLOR', color: color, index: this.index})
  }
}
