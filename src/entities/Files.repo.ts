import { EntityRepository, Repository } from 'typeorm';
import { Files } from './Files.entity';

@EntityRepository(Files)
export class FilesRepo extends Repository<Files> {

}
