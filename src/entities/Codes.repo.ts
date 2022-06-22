import { EntityRepository, Repository } from 'typeorm';
import { Codes } from './Codes.entity';

@EntityRepository(Codes)
export class CodesRepo extends Repository<Codes> {}
