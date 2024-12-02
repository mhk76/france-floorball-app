import { useGlobalStore } from 'src/stores/globalStore';
import MatchInfoApi from 'src/models/api/MatchInfoApi';
import MatchInfo from 'src/models/MatchInfo';

const global = useGlobalStore();

export function useMatchInfoMapper(api: MatchInfoApi): MatchInfo {
	return {
		id: api.id,
		isLive: api.is_live,
		isStarted: api.is_started,
		isFinished: api.is_played,
		tournamentName: api.round_name,
		venueId: api.sporthall_id,
		date: global.date(api.date, api.time),
		description: api.description,
		homeTeamId: api.team_home_id,
		homeTeamName: api.team_home_name,
		homeTeamLogo: api.team_home_logo ?? undefined,
		homeTeamScore: api.score_home,
		homeTeamClubId: api.club_home_id,
		awayTeamId: api.team_away_id,
		awayTeamName: api.team_away_name,
		awayTeamLogo: api.team_away_logo ?? undefined,
		awayTeamScore: api.score_away,
		awayTeamClubId: api.club_away_id,
		venueName: api.sporthall?.name ?? '',
	};
}
