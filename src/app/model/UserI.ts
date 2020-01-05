export interface UserI {
  username: string;
  password?: string;
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  role: string;
  businessName: string;
  country: string;
  region: string;
  street: string;
  objectId?: string;
  createdAt?: string;
  updatedAt?: string;
  sessionToken?: string;
}
