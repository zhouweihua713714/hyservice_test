import DataSource from '@/dataSource';
import { Website } from '@/entities/Website.entity';
DataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
export const websiteRepository = DataSource.getRepository(Website);
