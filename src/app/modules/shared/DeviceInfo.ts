import {MatSidenav} from '@angular/material/sidenav';

export abstract class DeviceInfo {
  getWidth(): number {
    return window.innerWidth;
  }

  enoughWidth(): boolean {
    const width = this.getWidth();
    return width > 1000;
  }

  openDrawer(sidenav: MatSidenav) {
    sidenav.open().catch();
  }
}
