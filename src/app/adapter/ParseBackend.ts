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

export const randomString = function makeid(length) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const serverUrl = 'https://lbpharmacy-daas.bfast.fahamutech.com';
export const functionsUrl = 'https://lbpharmacy-faas.bfast.fahamutech.com';

