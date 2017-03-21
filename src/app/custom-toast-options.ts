import {ToastOptions} from "ng2-toastr";

export class CustomToastOptions extends ToastOptions {
  positionClass: string = 'toast-bottom-right';
  maxShown: number = 3;
  // newestOnTop: boolean;
  animate: string = 'flyRight';
  toastLife: number = 2000;
  enableHTML: boolean;
  // dismiss: string;
  // messageClass: string;
  // titleClass: string;
  // showCloseButton: boolean;
}
