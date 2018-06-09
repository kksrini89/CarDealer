export interface Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export interface User {
  uid: String;
  email: String;
  roles: Roles;
  photoURL: String;
}
