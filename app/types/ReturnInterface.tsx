interface IUser {
  id?: number;
  name?: string;
  avatar?: string;
}

export interface IUserResult extends IUser {
  success: boolean;
  data: {
    id: number;
    password?: string;
  };
}

interface IProduct {
  id: number;
  title: string;
  price: number;
  description?: string;
  photo: string;
  created_at: Date;
  user?: IUser;
}

export interface IProductListResult {
  success: boolean;
  data: IProduct[];
}

export interface IProductResult {
  success: boolean;
  data: IProduct;
}
