export class SmartstockUtil {
  static faasToDaasUrl(url, projectId): string {
    return `https://${projectId}-daas.bfast.fahamutech.com${url}`;
  }
}
