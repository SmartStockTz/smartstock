export interface UserI {
  username: string;
  password?: string;
  role: string;
  idOld?: string;
  objectId?: string;
  meta?: {
    fullname: string;
    number: string;
    address: string;
    email: string
  };
  createdAt?: string;
  updatedAt?: string;
  sessionToken?: string;
}
