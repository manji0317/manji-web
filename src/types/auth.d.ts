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
  id: string;
  nickname: string;
  username: string;
  email: string;
  phone: string;
  gender: number;
  birthday: string;
  avatar: string;
  status: number;
  menus: string[];
}

declare interface SysUser extends Omit<AuthUser, 'menuIds'> {
  password: string;
  gender: number;
  birthday: string;
  status: number;
  createTime: string;
}
