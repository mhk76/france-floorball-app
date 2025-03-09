import MatchListInfoApi from 'src/models/api/MatchListInfoApi';
import MatchListInfo from 'src/models/MatchListInfo';
import { useMatchInfoMapper } from './useMatchInfoMapper';
import LogoInfoApi from 'src/models/api/LogoInfoApi';
import LogoInfo from 'src/models/LogoInfo';
import { useVenueInfoMapper } from './useVenueInfoMapper';

function logoMapper(api: LogoInfoApi): LogoInfo {
	return {
		id: api.id,
		logo: api.logo,
	};
}

export default function useMatchListInfoMapper(
	api: MatchListInfoApi
): MatchListInfo {
	return {
		matches: api.list_match.map(useMatchInfoMapper),
		logos: api.list_logo?.map(logoMapper),
		venues: api.list_sporthall?.map(useVenueInfoMapper),
	};
}
