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
      try {
        currentState = JSON.parse(localStorage.getItem('state'));
      } catch(err) {
        console.log(localStorage.getItem('state'))
        currentState = null
      }
      if (!currentState) {
        currentState = {colors: [], output: 'hex', alpha: 'hex6', selectedIndex: null};
      }
    }

    let newState: any;
    let newColors: string[];

    switch (action.type) {
      case 'ADD_COLOR':
        newColors = currentState.colors.slice(0);
        newColors.push(action.color);
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
      case 'INIT':
        newState = Object.assign({}, currentState);
        break;
    }
    this.state = newState;
    this.stateEvent.emit(this.state);
    localStorage.setItem('state', JSON.stringify(this.state));
  }
}
