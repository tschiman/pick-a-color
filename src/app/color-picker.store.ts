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
          selectedIndex: null,
          shadeArrays: [['#8b385d', '#8b385d', '#8b385d', '#8b385d']],
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
          newState = Object.assign({}, currentState, {primaryColor: currentState.colors[action.index]});
          newState = this.updateShadeArrays(newState, {
            harmonyType: currentState.harmonyType,
            colorHarmony: currentState.colorHarmony
          })
        } else {
          newState = Object.assign({}, currentState);
        }

        break;
      case 'COLOR_HARMONY_CHANGE':
        if (currentState.harmonyType === 'center' && action.colorHarmony === 'Tetradic') {
          newState = Object.assign({}, currentState, {colorHarmony: action.colorHarmony, harmonyType: 'left'});
        } else {
          newState = Object.assign({}, currentState, {colorHarmony: action.colorHarmony});
        }
        break;
      case 'HARMONY_TYPE_CHANGE':
        newState = Object.assign({}, currentState, {harmonyType: action.harmonyType});
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
    action.harmonyType;
    action.colorHarmony;
    let newShadeArray = [];


    return Object.assign({}, currentState, {shadeArray: newShadeArray})
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
}
