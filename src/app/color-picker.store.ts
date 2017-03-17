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
          colors: [],
          output: 'hex',
          alpha: 'hex6',
          colorHarmony: 'Monochrome',
          primaryColor: null,
          complimentaryColor: null,
          tertiaryColor: null,
          quaternaryColor: null,
          selectedIndex: null,
          shadeArrays: [],
          harmonyType: 'left'
        };
      }
    }

    let newState: any;
    let newColors: string[];

    switch (action.type) {
      case 'ADD_COLOR':
        newColors = currentState.colors.slice(0);

        let hex8Format: Hsva = this.cpService.stringToHsva(action.color, true); //if hex8 formatting returns null then we likely have a hex6 string.
        if (hex8Format) {
          newColors.push(this.cpService.outputFormat(hex8Format, currentState.output, true));
        } else {
          newColors.push(this.cpService.outputFormat(this.cpService.stringToHsva(action.color, false), currentState.output, false));
        }
        newState = Object.assign({}, currentState, {colors: newColors, selectedIndex: (newColors.length - 1)});
        break;
      case 'DELETE_COLOR':
        newColors = [
          ...currentState.colors.slice(0, action.index),
          ...currentState.colors.slice(action.index + 1)
        ] //remove the color from the array

        //determine new selected index
        let newSelectedIndex = newColors.length - 1; //set the new index to the max it could be
        if (action.index <= newSelectedIndex) newSelectedIndex = action.index; //if we are inbetween then select the same position as what we deleted

        newState = Object.assign({}, currentState, {colors: newColors, selectedIndex: newSelectedIndex});
        break;
      case 'SELECT_COLOR':
        newState = Object.assign({}, currentState, {selectedIndex: action.index});
        break;
      case 'CHANGE_COLOR':
        newState = Object.assign({}, currentState);
        break;
      case 'CHANGE_OUTPUT':
        newState = this.changeOutput(currentState, action, false);
        break;
      case 'CHANGE_ALPHA':
        if (currentState.alpha !== action.alpha) {
          newColors = currentState.colors.map((color: string) => {
            let hex8Format = this.cpService.stringToHsva(color, true); //if hex8 formatting returns null then we likely have a hex6 string.
            if (hex8Format) {
              return hex8Format;
            } else {
              return this.cpService.stringToHsva(color, false); //rerun in hex6 mode
            }
          }).map((hsva: Hsva) => {
            return this.cpService.outputFormat(hsva, action.output, action.alpha === 'hex8')
          });

          newState = Object.assign({}, currentState, {colors: newColors, alpha: action.alpha});
          newState = this.changeOutput(newState, {output: newState.output}, true)
        } else {
          newState = Object.assign({}, currentState);
        }
        break;
      case 'CLEAR_COLORS':
        newState = Object.assign({}, currentState, {colors: []});
        break;
      case 'DELETE_PRIMARY_COLOR':
        newState = Object.assign({}, currentState, {primaryColor: null});
        break;
      case 'SELECT_PRIMARY_COLOR':
        //if index is not null and the selected color is not the exact same as the current primary color update the primary color. If not do nothing
        if (action.index != null && currentState.colors[action.index] !== currentState.primaryColor) {
          //generate the appropriate colors
          newState = this.updateShadeArrays(currentState, {
            type: 'UPDATE_SHADE_ARRAY',
            harmonyType: currentState.harmonyType,
            colorHarmony: currentState.colorHarmony,
            primaryColor: currentState.colors[action.index]
          });
          //update the primary color selection
          newState = Object.assign({}, newState, {primaryColor: currentState.colors[action.index]});
        } else {
          newState = Object.assign({}, currentState);
        }

        break;
      case 'COLOR_HARMONY_CHANGE':
        //update the shade arrays for the new color harmony
        newState = this.updateShadeArrays(currentState, {
          type: 'UPDATE_SHADE_ARRAY',
          harmonyType: currentState.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: currentState.primaryColor
        });
        if (currentState.harmonyType === 'center' && action.colorHarmony === 'Tetradic') {
          newState = Object.assign({}, newState, {colorHarmony: action.colorHarmony, harmonyType: 'left'});
        } else {
          newState = Object.assign({}, newState, {colorHarmony: action.colorHarmony});
        }
        break;
      case 'HARMONY_TYPE_CHANGE':
        //update the shade arrays for the new color harmony
        newState = this.updateShadeArrays(currentState, {
          type: 'UPDATE_SHADE_ARRAY',
          harmonyType: action.harmonyType,
          colorHarmony: currentState.colorHarmony,
          primaryColor: currentState.primaryColor
        });
        newState = Object.assign({}, newState, {harmonyType: action.harmonyType});
        break;
      case 'INIT':
        newState = Object.assign({}, currentState);
        break;
    }
    this.state = newState;
    this.stateEvent.emit(this.state);
    localStorage.setItem('state', JSON.stringify(this.state));
  }

  private updateShadeArrays(currentState: any, action: any): any {
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

    let noChanges: boolean = action.primaryColor === currentState.primaryColor && action.colorHarmony === currentState.colorHarmony && action.harmonyType === currentState.harmonyType;
    if (noChanges) return Object.assign({}, currentState);

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
        for (let i = 0; i < 10; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * 10) + 5) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
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
        for (let i = 0; i < 10; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * 10) + 5) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(complimentaryColor.h, ((i * 10) + 5) / 100, complimentaryColor.v, complimentaryColor.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: action.primaryColor,
          secondaryColor: this.cpService.outputFormat(complimentaryColor, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Split Complimentary') {
        for (let i = 0; i < 10; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * 10) + 5) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(splitCompliment2.h, ((i * 10) + 5) / 100, splitCompliment2.v, splitCompliment2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(splitCompliment3.h, ((i * 10) + 5) / 100, splitCompliment3.v, splitCompliment3.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: action.primaryColor,
          secondaryColor: this.cpService.outputFormat(splitCompliment2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(splitCompliment3, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Triadic') {
        for (let i = 0; i < 10; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * 10) + 5) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(triadicColor2.h, ((i * 10) + 5) / 100, triadicColor2.v, triadicColor2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(triadicColor3.h, ((i * 10) + 5) / 100, triadicColor3.v, triadicColor3.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: action.primaryColor,
          secondaryColor: this.cpService.outputFormat(triadicColor2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(triadicColor3, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Analogous') {
        for (let i = 0; i < 10; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * 10) + 5) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(analogous2.h, ((i * 10) + 5) / 100, triadicColor2.v, triadicColor2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(analogous3.h, ((i * 10) + 5) / 100, triadicColor3.v, triadicColor3.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: action.primaryColor,
          secondaryColor: this.cpService.outputFormat(analogous2, currentState.output, currentState.alpha === 'hex8'),
          tertiaryColor: this.cpService.outputFormat(analogous3, currentState.output, currentState.alpha === 'hex8'),
          shadeArrays: newShadeArray
        });
      } else if (action.colorHarmony === 'Tetradic') {
        for (let i = 0; i < 10; i++) {
          newShadeArray[i] = [
            this.cpService.outputFormat(
              new Hsva(primaryColor.h, ((i * 10) + 5) / 100, primaryColor.v, primaryColor.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(tetradic2.h, ((i * 10) + 5) / 100, tetradic2.v, tetradic2.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(tetradic3.h, ((i * 10) + 5) / 100, tetradic3.v, tetradic3.a), currentState.output, currentState.alpha === 'hex8'
            ),
            this.cpService.outputFormat(
              new Hsva(tetradic4.h, ((i * 10) + 5) / 100, tetradic4.v, tetradic4.a), currentState.output, currentState.alpha === 'hex8'
            )
          ]
        }
        return Object.assign({}, currentState, {
          harmonyType: action.harmonyType,
          colorHarmony: action.colorHarmony,
          primaryColor: action.primaryColor,
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
    let newColors: string[];
    if ((currentState.output !== action.output) || forceChange) {
      newColors = currentState.colors.map((color: string) => {
        return this.cpService.stringToHsva(color, currentState.alpha === 'hex8');
      }).map((hsva: Hsva) => {
        return this.cpService.outputFormat(hsva, action.output, currentState.alpha === 'hex8')
      });
      return Object.assign({}, currentState, {colors: newColors, output: action.output});
    } else {
      return Object.assign({}, currentState);
    }
  }

  private convertHue(input: number, degreesToRotate: number) {
    return (((input * 360) + degreesToRotate) % 360) / 360
  }
}
