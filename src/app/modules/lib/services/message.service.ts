import {Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private readonly _snack: MatSnackBar) {
  }

  showMobileInfoMessage(message: string, duration: number = 3000, position: 'bottom' | 'top' = 'top') {
    this._snack.open(message, 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: position,
      duration: duration
    });
  }
}
