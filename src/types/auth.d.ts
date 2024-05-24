declare interface Login {
  username: string;
  password: string;
}

declare interface Token {
  accessToken: string;
  refreshToken: string;
}

declare interface Role {
  id: string;
  roleName: string;
  description: string;
  menus?: string[];
}

declare interface AuthUser {
  id: number;
  nickname: string;
  username: string;
  email: string;
  phone: string;
  avatar: string;
  menuIds: string[];
}

declare interface SysUser extends Omit<AuthUser, 'menuIds'> {
  gender: number;
  birthday: string;
  status: number;
  createTime: string;
}
