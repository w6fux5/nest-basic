import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: string) {
    if (!id) {
      throw new BadRequestException('no id');
    }
    return this.repo.findOneBy({ id });
  }

  findOneByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // Object.assign(user, attrs);
    const updateUser = { ...user, ...attrs };
    return this.repo.save(updateUser);
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    return this.repo.remove(user);
  }
}
