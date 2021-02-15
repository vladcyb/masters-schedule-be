import { getConnection } from 'typeorm';
import LocationType from './index';

export const initializeLocationTypes = async () => {
  const connection = getConnection();
  const locationTypes = connection.getRepository(LocationType);
  const l1 = new LocationType();
  const l2 = new LocationType();
  const l3 = new LocationType();
  l1.title = 'Область';
  l2.title = 'Город';
  l3.title = 'Улица';
  try {
    await locationTypes.save(l1);
    await locationTypes.save(l2);
    await locationTypes.save(l3);
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
