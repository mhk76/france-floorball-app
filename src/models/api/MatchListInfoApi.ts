import LogoInfoApi from './LogoInfoApi';
import MatchInfoApi from './MatchInfoApi';
import VenueInfoApi from './VenueInfoApi';

export default interface MatchListInfoApi {
	info: string;
	list_match: MatchInfoApi[];
	list_logo: LogoInfoApi[];
	list_sporthall: VenueInfoApi[];
}
