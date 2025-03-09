import { useGlobalStore } from 'src/stores/globalStore';
import { EVENT_TYPE } from 'src/enums/EVENT_TYPE';
import MatchEventInfoApi from 'src/models/api/MatchEventInfoApi';
import MatchEventInfo from 'src/models/MatchEventInfo';
import MatchInfo from 'src/models/MatchInfo';

const global = useGlobalStore();

function mapType(type: string, code: string, period: string): EVENT_TYPE {
	if ((period === 'PEN' && code === 'PSAET') || type === 'Own Goal') {
		return EVENT_TYPE.GOAL;
	} else if (type === 'Goal') {
		if (code === 'PS' || code === 'PSAET') {
			return EVENT_TYPE.GOAL_PENALTY_SHOT;
		} else if (code === 'PP') {
			return EVENT_TYPE.GOAL_POWERPLAY;
		} else if (code === 'SH') {
			return EVENT_TYPE.GOAL_SHORTHANDED;
		} else if (code === 'ESH') {
			return EVENT_TYPE.GOAL_EQUAL_SHORTHANDED;
		} else {
			return EVENT_TYPE.GOAL;
		}
	} else if (code === 'MPS' || code === 'MPSAET') {
		return EVENT_TYPE.MISSED_PENALTY_SHOT;
	} else if (type === 'Timeout') {
		return EVENT_TYPE.TIMEOUT;
	} else {
		return EVENT_TYPE.PENALTY;
	}
}

export function useMatchEventInfoMapper(
	api: MatchEventInfoApi,
	match: MatchInfo
): MatchEventInfo {
	return {
		id: api.id,
		player1Id: api.playerid1,
		player1Name: global.name(api.player1firstname, api.player1lastname),
		player2Id: api.playerid2,
		player2Name:
			api.playerid2 > 0
				? global.name(api.player2firstname, api.player2lastname)
				: undefined,
		officialId: (api.officialid1 ?? 0) > 0 ? api.officialid1 : undefined,
		officialName: global.name(api.officialfirstname, api.officiallastname),
		period: api.period,
		time: api.time.substring(3),
		type: mapType(api.type, api.code, api.period),
		code: api.code,
		teamId:
			api.code === 'OG' // Invert teams for own goal
				? api.teamid === match.homeTeamId
					? match.awayTeamId
					: match.homeTeamId
				: api.teamid,
		penalty: api.penality,
		runningScoreHome: 0,
		runningScoreAway: 0,
	};
}
