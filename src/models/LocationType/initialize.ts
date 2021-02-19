import { getConnection } from 'typeorm';
import LocationType from './index';

export const initializeLocationTypes = async () => {
  const connection = getConnection();
  const locationTypes = connection.getRepository(LocationType);
  const locationType1 = new LocationType();
  const locationType2 = new LocationType();
  const locationType3 = new LocationType();
  locationType1.title = 'region';
  locationType2.title = 'city';
  locationType3.title = 'district';
  try {
    await locationTypes.save(locationType1);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    await locationTypes.save(locationType2);
    // eslint-disable-next-line no-empty
  } catch (e) {}
  try {
    await locationTypes.save(locationType3);
    // eslint-disable-next-line no-empty
  } catch (e) {}
};
