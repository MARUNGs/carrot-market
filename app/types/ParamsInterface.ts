export interface IParams {
  params: { id: string };
}

export interface IUser {
  name: string;
  email: string;
  password: string;
}

export interface IResultProps {
  id: number;
  password?: string;
}

export interface IProduct {
  id: number;
  title: string;
  price: number;
  description?: string;
  photo: string;
  created_at: Date;
}

// password
export interface IPasswordProps {
  password: string;
  passwordConfirm: string;
}

// 폼 에러 타입 정의
interface FormErrors {
  fieldErrors: {
    username?: string[];
    email?: string[];
    password?: string[];
    passwordConfirm?: string[];
  };
  formErrors?: string[];
}

// 이전 상태 타입 정의
export interface PrevState extends FormErrors {
  success?: boolean;
}

// 상품
export interface IProduct {
  id: number;
  title: string;
  price: number;
  created_at: Date;
  photo: string;
}
