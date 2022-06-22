import { EntityRepository, Repository } from 'typeorm';
import { Users } from './Users.entity';

@EntityRepository(Users)
export class UsersRepo extends Repository<Users> {}
