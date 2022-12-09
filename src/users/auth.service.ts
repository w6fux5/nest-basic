import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

type AuthProp = {
  email: string;
  password: string;
};

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register({ email, password }: AuthProp) {
    // See if email is in use
    const existsUser = await this.usersService.find(email);
    if (existsUser.length) {
      throw new BadRequestException('email in use');
    }

    // Hash the user password
    // Burrer 裡面 8 個字節，轉 16 進位，每個數據位兩個字元，所以會得到 16 個字節的字串
    const salt = randomBytes(8).toString('hex');

    // 產生 32 個字節的字串
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashStr = hash.toString('hex');

    // 將 salt 和 hash 連接一起
    const result = `${salt}.${hashStr}`;

    // Create new user and save it
    const user = await this.usersService.create(email, result);
    // Return the user
    return user;
  }

  async login({ email, password }: AuthProp) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [storedSalt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, storedSalt, 32)) as Buffer;
    const hashStr = hash.toString('hex');

    if (storedHash === hashStr) {
      return user;
    } else {
      throw new BadRequestException('帳號密碼錯誤');
    }
  }
}
