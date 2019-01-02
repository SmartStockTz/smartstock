export interface UserI {
  username: string;
  password: string;
  role?: string;
  id?: string;
  meta?: {
    fullname: string;
    number: string;
    address: string;
    email: string
  };
}
