import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> { // account setup
    const user: User = new User();
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    user.firstname = createUserDto.firstname;
    user.middlename = createUserDto.middlename;
    user.lastname = createUserDto.lastname;
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    user.password = hashedPassword;
    user.imgurl = createUserDto.imgurl;
    user.status = createUserDto.status;
    user.verified = 1;
    user.access_level = createUserDto.access_level;
    return this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.firstname = updateUserDto.firstname;
    user.id = id;
    return this.userRepository.save(user);
  }

  remove(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }

  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where : { username }})
  }
}
