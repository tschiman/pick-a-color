import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class ColorPickerStore {

  stateEvent: EventEmitter<any> = new EventEmitter<any>();

  private state: any = {};

  getState() {
    return this.state;
  }

  dispatch(currentState: any, action: any) { //{type: string, payload: any}
    if (!currentState) {
      currentState = {colors: [], output: 'hex', alpha: 'hex6'};
    }

    let newState: any;
    let newColors: string[];

    switch (action.type) {
      case 'ADD_COLOR':
        newColors = currentState.colors.slice(0);
        newColors.push(action.color);
        newState = Object.assign({}, currentState, {colors: newColors});
        this.state = newState;
        this.stateEvent.emit(this.state);
        break;
      case 'CHANGE_COLOR':
        newColors = [
          ...currentState.colors.slice(0, action.index),
          action.color,
          ...currentState.colors.slice(action.index + 1)
        ] //replace the new color in the array
        newState = Object.assign({}, currentState, {colors: newColors});
        this.state = newState;
        this.stateEvent.emit(this.state);
        break;
      case 'DELETE_COLOR':
        newColors = [
          ...currentState.colors.slice(0, action.index),
          ...currentState.colors.slice(action.index + 1)
        ] //remove the color from the array
        newState = Object.assign({}, currentState, {colors: newColors});
        this.state = newState;
        this.stateEvent.emit(this.state);
        break;
      case 'INIT':
        newState = Object.assign({}, currentState);
        this.state = newState;
        this.stateEvent.emit(this.state);
        break;
    }
  }
}
