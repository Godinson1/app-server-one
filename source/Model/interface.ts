export interface IUser {
  name: string;
  id: number;
  email: string;
  password: string;
  photoUrl: string;
  handle: string;
  phone: string;
  googleId: string;
}

export interface IPost {
  name: string;
  id: number;
  content: string;
  likes: number;
  photoUrl: string;
  handle: string;
}
