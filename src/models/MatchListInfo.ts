import LogoInfo from './LogoInfo';
import MatchInfo from './MatchInfo';
import VenueInfo from './VenueInfo';

export default interface MatchListInfo {
	matches: MatchInfo[];
	logos: LogoInfo[];
	venues: VenueInfo[];
}
