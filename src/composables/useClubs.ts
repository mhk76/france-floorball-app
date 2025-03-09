import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import { ClubInfo } from 'src/models/ClubInfo';
import { ClubInfoApi } from 'src/models/api/ClubInfoApi';
import { useVenueInfoMapper } from './mappers/useVenueInfoMapper';

const data = useDataStore();

export async function useClubs(): Promise<ClubInfo[]> {
	return (await data.load<ClubInfoApi[]>('clubs', API.CLUB_LIST))
		.filter((api) => api.isactive === 1)
		.map((api) => ({
			id: api.id,
			name: api.name,
			shortName: api.shortname,
			streetAddress: api.streetaddress,
			postCode: api.postcode,
			city: api.city,
			region: api.region,
			email: api.email,
			phone: api.phone,
			website: api.website,
			colorHome1: api.colorhome1,
			colorHome2: api.colorhome2,
			colorAway1: api.coloraway1,
			colorAway2: api.coloraway2,
			logo: api.logo,
			halls: api.halls?.map(useVenueInfoMapper),
		}))
		.sort((a: ClubInfo, b: ClubInfo) => a.name.localeCompare(b.name));
}
