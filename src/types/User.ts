export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    zipcode: string;
  };
}
