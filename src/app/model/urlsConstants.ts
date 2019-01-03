export class UrlsConstants {
  static SEARCH_PRODUCT = 'http://lvh.me:8080/stock/search/findAllByProductContains?productNameControlInput=';
  LOGIN_URL: string;

  constructor(private severUrl) {
    this.setUrls(severUrl);
  }

  private setUrls(serverUrl: string) {
    this.LOGIN_URL = serverUrl.concat('/user/search/findAllByName');
  }
}
