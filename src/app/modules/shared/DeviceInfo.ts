export abstract class DeviceInfo {
  getWidth(): number {
    return window.innerWidth;
  }

  enoughWidth(): boolean {
    const width = this.getWidth();
    return width > 1000;
  }
}
