import {Injectable, EventEmitter} from "@angular/core";
import {ColorPickerService, Hsva} from "angular2-color-picker";

@Injectable()
export class ColorPickerStore {

  stateEvent: EventEmitter<any> = new EventEmitter<any>();

  private state: any = {};

  constructor(private cpService: ColorPickerService) {
  }

  getState() {
    return this.state;
  }

  dispatch(currentState: any, action: any): any { //{type: string, any}
    if (!currentState) {
      try {
        currentState = JSON.parse(localStorage.getItem('state'));
      } catch(err) {
        console.log(localStorage.getItem('state'))
        currentState = null
      }
      if (!currentState) {
        currentState = {
          output: 'hex',
          alpha: 'hex6',
          colorHarmony: 'Monochrome',
          primaryColor: '#fff',
          spreadColor: null,
          complimentaryColor: null,
          tertiaryColor: null,
          quaternaryColor: null,
          selectedIndex: null,
          shadeArrays: [],
          harmonyType: 'left',
          swatchCount: 10
        };
      }
    }

    let newState: any;

    switch (action.type) {
      case 'SELECT_COLOR':
        newState = Object.assign({}, currentState, {selectedIndex: action.index});
        break;
      case 'CHANGE_OUTPUT':
        newState = this.changeOutputReducer(currentState, action);
        break;
      case 'CHANGE_ALPHA':
        newState = this.changeAlphaReducer(currentState, action);
        break;
      case 'SELECT_PRIMARY_COLOR':
        newState = this.selectPrimaryColorReducer(currentState, action);
        break;
      case 'COLOR_HARMONY_CHANGE':
        newState = this.colorHarmonyChangeReducer(currentState, action);
        break;
      case 'HARMONY_TYPE_CHANGE':
        newState = this.harmonyTypeChangeReducer(currentState, action);
        break;
      case 'SELECT_SWATCH_COUNT':
        newState = this.selectSwatchCountReducer(currentState, action);
        break;
      case 'SELECT_COLOR_SPREAD':
        newState = this.selectColorSpread(currentState, action);
        break;
      case 'INIT':
        newState = Object.assign({}, currentState);
        break;
    }
    this.state = newState;
    this.stateEvent.emit(this.state);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  private harmonyTypeChangeReducer(currentState: any, action: any) {
    //update the shade arrays for the new color harmony
    let newState = this.updateShadeArrays(currentState, {
      type: 'UPDATE_SHADE_ARRAY',
      harmonyType: action.harmonyType,
      colorHarmony: currentState.colorHarmony,
      primaryColor: currentState.primaryColor,
      swatchCount: currentState.swatchCount
    }, false);
    return Object.assign({}, newState, {harmonyType: action.harmonyType});
  }

  private colorHarmonyChangeReducer(currentState: any, action: any) {
    //update the shade arrays for the new color harmony
    let newState = this.updateShadeArrays(currentState, {
      type: 'UPDATE_SHADE_ARRAY',
      harmonyType: currentState.harmonyType,
      colorHarmony: action.colorHarmony,
      primaryColor: currentState.primaryColor,
      swatchCount: currentState.swatchCount
    }, false);
    if (currentState.harmonyType === 'center' && action.colorHarmony === 'Tetradic') {
      return Object.assign({}, newState, {colorHarmony: action.colorHarmony, harmonyType: 'left'});
    } else {
      return Object.assign({}, newState, {colorHarmony: action.colorHarmony});
    }
  }

  private selectPrimaryColorReducer(currentState: any, action: any) {
    //if index is not null and the selected color is not the exact same as the current primary color update the primary color. If not do nothing
    if (action.primaryColor != null && action.primaryColor !== currentState.primaryColor) {
      //generate the appropriate colors
      return this.updateShadeArrays(currentState, {
        type: 'UPDATE_SHADE_ARRAY',
        harmonyType: currentState.harmonyType,
        colorHarmony: currentState.colorHarmony,
        primaryColor: action.primaryColor,
        swatchCount: currentState.swatchCount
      }, false);
    } else {
      return Object.assign({}, currentState);
    }
  }

  private changeOutputReducer(currentState: any, action: any) {
    let newState: any = this.changeOutput(currentState, action, false);
    return this.createSpread(newState, {type: 'CREATE_SPREAD', spreadColor: currentState.spreadColor});
  }

  private createSpread(currentState: any, action: any): any {
    if (action.spreadColor) {
      let spreadColor: Hsva;
      spreadColor = this.cpService.stringToHsva(action.spreadColor, true); //if hex8 formatting returns null then we likely have a hex6 string.
      if (!spreadColor) {
        spreadColor = this.cpService.stringToHsva(action.spreadColor, false);
      }

      let spreadColors: string[][] = [];
      for (let i = 0; i < 12; i++) { //every ith row will have a unique saturation
        let saturation: number = ((i * (100 / 12))) / 100;
        let spreadColorRow: string[] = [];
        for (let j = 0; j < 12; j++) { //every jth column will have a unique lightness
          let value: number = ((j * (100 / 12))) / 100;
          spreadColorRow[j] = this.cpService.outputFormat(
            new Hsva(spreadColor.h, saturation, value, spreadColor.a), currentState.output, currentState.alpha === 'hex8'
          )
        }
        spreadColors[i] = spreadColorRow;
      }

      return Object.assign({}, currentState, {
        spreadColors: spreadColors,
        spreadColor: this.cpService.outputFormat(spreadColor, currentState.output, currentState.alpha === 'hex8')
      });
    } else {
      return Object.assign({}, currentState)
    }
  }

  private updateShadeArrays(currentState: any, action: any, forceUpdate: boolean): any {
    let primaryColor: Hsva;
    let complimentaryColor: Hsva;
    let splitCompliment2: Hsva;
    let splitCompliment3: Hsva;
    let triadicColor2: Hsva;
    let triadicColor3: Hsva;
    let analogous2: Hsva;
    let analogous3: Hsva;
    let tetradic2: Hsva;
    let tetradic3: Hsva;
    let tetradic4: Hsva;
    let swatchCount = currentState.swatchCount === action.swatchCount ? currentState.swatchCount : action.swatchCount;

    let noChanges: boolean = action.primaryColor === currentState.primaryColor && action.colorHarmony === currentState.colorHarmony && action.harmonyType === currentState.harmonyType;
    if (noChanges && !forceUpdate) return Object.assign({}, currentState);

    if (action.primaryColor) {
      primaryColor = this.cpService.stringToHsva(action.primaryColor, true); //if hex8 formatting returns null then we likely have a hex6 string.
      if (!primaryColor) {
        primaryColor = this.cpService.stringToHsva(action.primaryColor, false);
      }
      //get other colors
      //get compliment
      complimentaryColor = new Hsva(this.convertHue(primaryColor.h, 180), primaryColor.s, primaryColor.v, primaryColor.a);
      //get triadic
      triadicColor2 = new Hsva(this.convertHue(primaryColor.h, 120), primaryColor.s, primaryColor.v, primaryColor.a);
      triadicColor3 = new Hsva(this.convertHue(primaryColor.h, 240), primaryColor.s, primaryColor.v, primaryColor.a);
      //get split compliment
      splitCompliment2 = new Hsva(this.convertHue(primaryColor.h, 150), primaryColor.s, primaryColor.v, primaryColor.a);
      splitCompliment3 = new Hsva(this.convertHue(primaryColor.h, 210), primaryColor.s, primaryColor.v, primaryColor.a);
      if (action.harmonyType === 'left') { //primary color defines the color most to the left
        //get analogous
        analogous2 = new Hsva(this.convertHue(primaryColor.h, 30), primaryColor.s, primaryColor.v, primaryColor.a);
        analogous3 = new Hsva(this.convertHue(primaryColor.h, 60), primaryColor.s, primaryColor.v, primaryColor.a);
        //get tetradic
        tetradic2 = new Hsva(this.convertHue(primaryColor.h, 60), primaryColor.s, primaryColor.v, primaryColor.a);
        tetradic3 = new Hsva(this.convertHue(primaryColor.h, 180), primaryColor.s, primaryColor.v, primaryColor.a);
        tetradic4 = new Hsva(this.convertHue(primaryColor.h, 240), primaryColor.s, primaryColor.v, primaryColor.a);
      } else if (action.harmonyType === 'center') { //primary color is in the center
        //get analogous
        analogous2 = new Hsva(this.convertHue(primaryColor.h, 30), primaryColor.s, primaryColor.v, primaryColor.a);
        analogous3 = new Hsva(this.convertHue(primaryColor.h, 330), primaryColor.s, primaryColor.v, primaryColor.a); //30 degrees left of where I start
        //get tetradic (since tetradic only has left and right, choose left for this one)
        tetradic2 = new Hsva(this.convertHue(primaryColor.h, 60), primaryColor.s, primaryColor.v, primaryColor.a);
        tetradic3 = new Hsva(this.convertHue(primaryColor.h, 180), primaryColor.s, primaryColor.v, primaryColor.a);
        tetradic4 = new Hsva(this.convertHue(primaryColor.h, 240), primaryColor.s, primaryColor.v, primaryColor.a);
      } else if (action.harmonyType === 'right') { //primary color is most to the right
        //get analogous
        analogous2 = new Hsva(this.convertHue(primaryColor.h, 330), primaryColor.s, primaryColor.v, primaryColor.a);
        analogous3 = new Hsva(this.convertHue(primaryColor.h, 300), primaryColor.s, primaryColor.v, primaryColor.a);
        //get tetradic
        tetradic2 = new Hsva(this.convertHue(primaryColor.h, 150), primaryColor.s, primaryColor.v, primaryColor.a);
        tetradic3 = new Hsva(this.convertHue(primaryColor.h, 180), primaryColor.s, primaryColor.v, primaryColor.a);
        tetradic4 = new Hsva(this.convertHue(primaryColor.h, 300), primaryColor.s, primaryColor.v, primaryColor.a);
      }

      let newShadeArray = [];
      if (action.colorHarmony === 'Monochrome') {
        for (let i = 0; i < swatchCount; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * (100 / swatchCount))) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            )
          ];
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: action.primaryColor,
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Complimentary') {
        for (let i = 0; i < swatchCount; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * (100 / swatchCount))) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(complimentaryColor.h, ((i * (100 / swatchCount))) / 100, complimentaryColor.v, complimentaryColor.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: this.cpService.outputFormat(primaryColor, currentState.output, currentState.alpha === 'hex8'),
          secondaryColor: this.cpService.outputFormat(complimentaryColor, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Split Complimentary') {
        for (let i = 0; i < swatchCount; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * (100 / swatchCount))) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(splitCompliment2.h, ((i * (100 / swatchCount))) / 100, splitCompliment2.v, splitCompliment2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(splitCompliment3.h, ((i * (100 / swatchCount))) / 100, splitCompliment3.v, splitCompliment3.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: this.cpService.outputFormat(primaryColor, currentState.output, currentState.alpha === 'hex8'),
          secondaryColor: this.cpService.outputFormat(splitCompliment2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(splitCompliment3, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Triadic') {
        for (let i = 0; i < swatchCount; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * (100 / swatchCount))) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(triadicColor2.h, ((i * (100 / swatchCount))) / 100, triadicColor2.v, triadicColor2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(triadicColor3.h, ((i * (100 / swatchCount))) / 100, triadicColor3.v, triadicColor3.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: this.cpService.outputFormat(primaryColor, currentState.output, currentState.alpha === 'hex8'),
          secondaryColor: this.cpService.outputFormat(triadicColor2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(triadicColor3, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Analogous') {
        for (let i = 0; i < swatchCount; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * (100 / swatchCount))) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(analogous2.h, ((i * (100 / swatchCount))) / 100, triadicColor2.v, triadicColor2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(analogous3.h, ((i * (100 / swatchCount))) / 100, triadicColor3.v, triadicColor3.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: this.cpService.outputFormat(primaryColor, currentState.output, currentState.alpha === 'hex8'),
          secondaryColor: this.cpService.outputFormat(analogous2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(analogous3, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Tetradic') {
        for (let i = 0; i < swatchCount; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * (100 / swatchCount))) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(tetradic2.h, ((i * (100 / swatchCount))) / 100, tetradic2.v, tetradic2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(tetradic3.h, ((i * (100 / swatchCount))) / 100, tetradic3.v, tetradic3.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(tetradic4.h, ((i * (100 / swatchCount))) / 100, tetradic4.v, tetradic4.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: this.cpService.outputFormat(primaryColor, currentState.output, currentState.alpha === 'hex8'),
          secondaryColor: this.cpService.outputFormat(tetradic2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(tetradic3, currentState.output, currentState.alpha === 'hex8'),
          quaternaryColor: this.cpService.outputFormat(tetradic4, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      }
    }
    return Object.assign({}, currentState)
  }

  private changeOutput(currentState: any, action: any, forceChange: boolean): any {
    let newState: any;

    if ((currentState.output !== action.output) || forceChange) {
      newState = Object.assign({}, currentState, {output: action.output});
    } else {
      newState = Object.assign({}, currentState);
    }

    //generate the appropriate colors
    return this.updateShadeArrays(newState, {
      type: 'UPDATE_SHADE_ARRAY',
      harmonyType: currentState.harmonyType,
      colorHarmony: currentState.colorHarmony,
      primaryColor: currentState.primaryColor,
      swatchCount: currentState.swatchCount
    }, true);
  }

  private convertHue(input: number, degreesToRotate: number) {
    return (((input * 360) + degreesToRotate) % 360) / 360
  }

  private changeAlphaReducer(currentState: any, action: any) {
    let newState: any;

    if (currentState.alpha !== action.alpha) {
      newState = Object.assign({}, currentState, {alpha: action.alpha});
      newState = this.createSpread(newState, {type: 'CREATE_SPREAD', spreadColor: currentState.spreadColor});
      return this.changeOutput(newState, {output: newState.output}, true)
    } else {
      return this.updateShadeArrays(currentState, {
        type: 'UPDATE_SHADE_ARRAY',
        harmonyType: currentState.harmonyType,
        colorHarmony: currentState.colorHarmony,
        primaryColor: currentState.primaryColor,
        swatchCount: currentState.swatchCount
      }, true);
    }
  }

  private selectSwatchCountReducer(currentState: any, action: any) {
    let newState = this.updateShadeArrays(currentState, {
      type: 'UPDATE_SHADE_ARRAY',
      harmonyType: currentState.harmonyType,
      colorHarmony: currentState.colorHarmony,
      primaryColor: currentState.primaryColor,
      swatchCount: action.swatchCount
    }, true);
    return Object.assign({}, newState, {swatchCount: action.swatchCount, shadeArrays: newState.shadeArrays});
  }

  private selectColorSpread(currentState: any, action: any) {
    let spreadColor: string = currentState.spreadColor === action.spreadColor ? null : action.spreadColor; //If I select the spread color twice deselect the spread
    if (spreadColor) {
      //create the spread
      let newState = this.createSpread(currentState, {type: 'CREATE_SPREAD', spreadColor: spreadColor});
      return Object.assign({}, newState, {spreadColor: spreadColor});
    } else {
      return Object.assign({}, currentState, {spreadColor: spreadColor});
    }
  }
}
