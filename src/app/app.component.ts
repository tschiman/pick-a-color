import {Component, OnInit, OnDestroy, ChangeDetectorRef} from "@angular/core";
import {ColorPickerStore} from "./color-picker.store";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{

  state: any;
  outputs: string[] = ['hex', 'rgba', 'hsla'];
  alphas: string[] = ['hex6', 'hex8', 'disabled'];
  colorHarmonies: string[] = ['Monochrome', 'Complimentary', 'Analogous', 'Split Complimentary', 'Triadic', 'Tetradic'];
  lightSwatchCount: number;

  constructor(private cpStore: ColorPickerStore, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.cpStore.stateEvent.subscribe((state) => {
      this.state = state;
      this.changeDetector.detectChanges();
    });
    this.cpStore.dispatch(null, {type: 'INIT'})
  }

  ngOnDestroy() {
    this.cpStore.stateEvent.unsubscribe();
  }

  onColorHarmonyChange(colorHarmony: string): void {
    this.cpStore.dispatch(this.state, {type: 'COLOR_HARMONY_CHANGE', colorHarmony: colorHarmony})
  }

  onHarmonyTypeChange(harmonyType: string): void {
    this.cpStore.dispatch(this.state, {type: 'HARMONY_TYPE_CHANGE', harmonyType: harmonyType})
  }

  selectPrimaryColor(color: string): void {
    this.cpStore.dispatch(this.state, {type: 'SELECT_PRIMARY_COLOR', primaryColor: color})
  }

  onLightSwatchCount(lightSwatchCount: number) {
    this.cpStore.dispatch(this.state, {type: 'CHANGE_LIGHT_SWATCH_COUNT', lightSwatchCount: lightSwatchCount})
  }

  onSaturationSwatchCount(saturationSwatchCount: number) {
    this.cpStore.dispatch(this.state, {
      type: 'CHANGE_SATURATION_SWATCH_COUNT',
      saturationSwatchCount: saturationSwatchCount
    })
  }

  onOutputChange(output: string): void {
    this.cpStore.dispatch(this.state, {type: 'CHANGE_OUTPUT', output: output});
  }

  onAlphaChange(alpha: string): void {
    this.cpStore.dispatch(this.state, {type: 'CHANGE_ALPHA', alpha: alpha});
  }
}
