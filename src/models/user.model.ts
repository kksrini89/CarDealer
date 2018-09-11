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
  dealer_info: {
    name: String;
    showroomName: String;
    address: String;
    city: String;
    state: String;
    contact_no: Number;
    profile_image: String;
  };
  photoURL: String;
}
