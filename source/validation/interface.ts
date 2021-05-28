export interface userData {
  name: string;
  email: string;
  password: string;
  handle: string;
  phone?: string;
}

export interface loginData {
  data: string;
  password: string;
}

export interface passwordData {
  code: string;
  password: string;
}
