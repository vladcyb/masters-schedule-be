import { getConnection } from 'typeorm';
import LocationType from './index';

export const initializeLocationTypes = async () => {
  const connection = getConnection();
  const locationTypes = connection.getRepository(LocationType);
  const l1 = new LocationType();
  const l2 = new LocationType();
  const l3 = new LocationType();
  l1.title = 'Region';
  l2.title = 'City';
  l3.title = 'District';
  locationTypes.save(l1);
  locationTypes.save(l2);
  locationTypes.save(l3);
};
