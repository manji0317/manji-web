/**
 * 登录
 */
declare interface Login {
  username: string;
  password: string;
}

/**
 * Token
 */
declare interface Token {
  accessToken: string;
  refreshToken: string;
}

/**
 * 角色
 */
declare interface Role {
  id: string;
  roleName: string;
  description: string;
  permissions?: { [key: string]: string[] };
}

/**
 * 用户
 */
declare interface AuthUser {
  id: string;
  nickname: string;
  username: string;
  email: string;
  phone: string;
  gender: number;
  birthday: string;
  avatar: string;
  backgroundImg: string;
  status: number;
  roles: string[];
  permissions: { [key: string]: string[] };
}

declare interface SysUser extends AuthUser {
  password: string;
  createTime: string;
}

/**
 * 用户图片
 */
declare interface UserImg {
  userId: string;
  uploadType: UploadPath;
  file: File | File[];
}
