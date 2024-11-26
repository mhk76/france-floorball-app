import LogoInfo from './LogoInfo';
import MatchInfo from './MatchInfo';
import VenueInfo from './VenueInfo';

export default interface MatchListInfo {
	info: string;
	list_match: MatchInfo[];
	list_logo: LogoInfo[];
	list_sporthall: VenueInfo[];
}
