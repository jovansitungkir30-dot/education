/** #/wilayah is the index of all areas; #/wilayah?id=… is the learning page of one of them. */
import { districtById } from '../data/atlas';
import { LANDMARKS } from '../data/landmarks';
import Directory from './Directory';
import RegionView from './Region';

export default function Wilayah({ params }: { params: URLSearchParams }) {
  const id = params.get('id');
  const district = districtById(id);
  if (district && LANDMARKS[district.id]) return <RegionView district={district} />;
  return <Directory params={params} unknown={!!id} />;
}
