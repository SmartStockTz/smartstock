export class ParseBackend {
  serverUrl = 'https://lbpharmacy-daas.bfast.fahamutech.com';
  functionsUrl = 'https://lbpharmacy-faas.bfast.fahamutech.com';
  getHeader = {
    'X-Parse-Application-Id': 'lbpharmacy',
  };
  getHeaderUser = {
    'X-Parse-Application-Id': 'lbpharmacy',
    'X-Parse-Revocable-Session': '1',
  };
  postHeader = {
    'X-Parse-Application-Id': 'lbpharmacy',
    'Content-Type': 'application/json'
  };
  postHeaderUser = {
    'X-Parse-Application-Id': 'ssm',
    'Content-Type': 'application/json',
    'X-Parse-Revocable-Session': '1',
  };

  constructor() {
  }

}

export const serverUrl = 'https://lbpharmacy-daas.bfast.fahamutech.com';
export const functionsUrl = 'https://lbpharmacy-faas.bfast.fahamutech.com';

