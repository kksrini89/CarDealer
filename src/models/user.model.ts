export interface Roles {
  subscriber?: boolean;
  editor?: boolean;
  admin?: boolean;
}

export interface User {
  uid: String;
  name: String;
  email: String;
  roles: Roles;
  // photoURL: String;
}
