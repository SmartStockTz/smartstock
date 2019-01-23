export class ParseBackend {
  serverUrl = 'http://localhost:8000/parse';
  getHeader = {
    'X-Parse-Application-Id': 'ssm',
  };
  getHeaderUser = {
    'X-Parse-Application-Id': 'ssm',
    'X-Parse-Revocable-Session': '1',
  };
  postHeader = {
    'X-Parse-Application-Id': 'ssm',
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

export const serverUrl = 'http://localhost:8000/parse';

