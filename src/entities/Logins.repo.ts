import { EntityRepository, Repository } from 'typeorm';
import { Logins } from './Logins.entity';

@EntityRepository(Logins)
export class LoginsRepo extends Repository<Logins> {}
