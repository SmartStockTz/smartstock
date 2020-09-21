import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'any'
})
export class FileLibraryService {
  saveFile(file: any, progress: (percentage: number) => void): Promise<string>{

  }
}
