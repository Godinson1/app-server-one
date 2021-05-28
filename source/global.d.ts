declare global {
  namespace Express {
    export interface User {
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
