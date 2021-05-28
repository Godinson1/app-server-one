declare global {
  namespace Express {
    export interface IUser {
      name: string;
      id: number;
      email: string;
      password: string;
      photoUrl: string;
      handle: string;
      phone: string;
    }
  }
}

export {};
