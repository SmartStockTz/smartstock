import {Injectable} from '@angular/core';
import {BFast} from 'bfastjs';
import {StorageService} from './storage.service';

@Injectable({
  providedIn: 'any'
})
export class FileLibraryService {
  constructor(private readonly storageService: StorageService) {
  }

  async saveFile(file: any, progress: (percentage: number) => void): Promise<string> {
    if (file && file instanceof File) {
      const activeShop = await this.storageService.getActiveShop();
      return BFast.storage(activeShop?.projectId).save(file, (data) => {
        progress((Number(data.loaded) / Number(data.total) * 100));
      });
    } else if (file && typeof file === 'string' && file.startsWith('http')) {
      return file;
    } else {
      return null;
    }
  }
}
