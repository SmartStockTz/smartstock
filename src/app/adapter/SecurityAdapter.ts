export interface SecurityAdapter {
  encryptData(data: any, password: string): string;

  decryptData(data: any, password: string): any;
}
