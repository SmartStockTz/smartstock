export interface PlatformApiAdapter {
  isWeb(): Promise<boolean>;

  isMobile(): Promise<boolean>;

  isDesktop(): Promise<boolean>;
}
