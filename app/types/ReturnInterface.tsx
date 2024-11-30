interface IUser {
  id?: number;
}

export interface IUserResult extends IUser {
  success: boolean;
  data: {
    id: number;
  };
}
