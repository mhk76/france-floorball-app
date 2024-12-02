import MatchListInfoApi from 'src/models/api/MatchListInfoApi';
import MatchListInfo from 'src/models/MatchListInfo';
import { useMatchInfoMapper } from './useMatchInfoMapper';
import LogoInfoApi from 'src/models/api/LogoInfoApi';
import LogoInfo from 'src/models/LogoInfo';
import VenueInfoApi from 'src/models/api/VenueInfoApi';
import VenueInfo from 'src/models/VenueInfo';

function logoMapper(api: LogoInfoApi): LogoInfo {
	return {
		id: api.id,
		logo: api.logo,
	};
}

function venueMapper(api: VenueInfoApi): VenueInfo {
	return {
		id: api.id,
		name: api.name,
		address: api.streetaddress,
		postCode: api.postcode,
		city: api.city,
		email: api.email,
		phoneNumber: api.phone,
	};
}

export default function useMatchListInfoMapper(
	api: MatchListInfoApi
): MatchListInfo {
	return {
		matches: api.list_match.map(useMatchInfoMapper),
		logos: api.list_logo?.map(logoMapper),
		venues: api.list_sporthall?.map(venueMapper),
	};
}
