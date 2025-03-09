import { TeamPlayerInfoApi } from 'src/models/api/TeamPlayerInfoApi';
import { useGlobalStore } from 'src/stores/globalStore';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import GENDER from 'src/enums/GENDER';

const global = useGlobalStore();

export default function useTeamPlayerInfoMapper(
	api: TeamPlayerInfoApi
): MatchPlayerInfo {
	return {
		id: api.id,
		name: global.name(api.firstname, api.lastname),
		teamId: 0,
		isCaptain: false,
		isMvp: api.statistics.mvp > 0,
		gamesPlayed: api.statistics.games_played,
		goals: api.statistics.goal,
		assists: api.statistics.assist,
		isGoalkeeper: api.statistics.isgoalkeeper === 1,
		saves: api.statistics.saves,
		goalsConceeded: api.statistics.goal_conceed,
		savePercent:
			api.statistics.saves /
			(api.statistics.saves + api.statistics.goal_conceed),
		photo: undefined,
		number: api.number,
		gender: api.sex as GENDER,
		nationality: api.nat1 ?? 'FR',
	} as MatchPlayerInfo;
}
