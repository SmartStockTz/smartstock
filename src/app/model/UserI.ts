export interface UserI {
  applicationId: string;
  projectUrlId: string;
  projectId: string;
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  category?: string; // default shop category
  role: 'admin' | 'manager' | 'user';
  businessName: string;
  country: string;
  region: string;
  street: string;
  objectId?: string;
  createdAt?: string;
  updatedAt?: string;
  sessionToken?: string;
  settings: {
    saleWithoutPrinter: boolean,
    printerFooter: string,
    printerHeader: string
  };
  shops: {
    projectId: string,
    applicationId: string;
    projectUrlId: string;
    businessName: string;
  }[];
}
