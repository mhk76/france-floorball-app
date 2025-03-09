import { useDataStore } from 'src/stores/dataStore';
import { useMatchInfoMapper } from './mappers/useMatchInfoMapper';
import { useMatchEventInfoMapper } from './mappers/useMatchEventInfoMapper';
import { useMatchRefereeInfoMapper } from './mappers/useMatchRefereeInfoMapper';
import { useMatchOfficialInfoMapper } from './mappers/useMatchOfficialInfoMapper';
import { useMatchPlayerInfoMapper } from './mappers/useMatchPlayerInfoMapper';
import API from 'src/enums/API';
import MatchInfo from 'src/models/MatchInfo';
import MatchEventInfo from 'src/models/MatchEventInfo';
import MatchRefereeInfo from 'src/models/MatchRefereeInfo';
import MatchOfficialInfo from 'src/models/MatchOfficialInfo';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import MatchInfoApi from 'src/models/api/MatchInfoApi';
import MatchEventInfoApi from 'src/models/api/MatchEventInfoApi';
import RefereeInfoApi from 'src/models/api/MatchRefereeInfoApi';
import MatchOfficialInfoApi from 'src/models/api/MatchOficialInfoApi';
import MatchPlayerInfoApi from 'src/models/api/MatchPlayerInfoApi';
import { EVENT_TYPE } from 'src/enums/EVENT_TYPE';

const data = useDataStore();

export async function useMatch(
	matchId: number,
	noCache?: boolean
): Promise<MatchInfo> {
	const result = await data.load<MatchInfoApi>(
		`match-info-${matchId}`,
		API.MATCH_INFO,
		{ id: matchId, command: 'match', old: true },
		noCache
	);

	return useMatchInfoMapper(result);
}

export async function useMatchEvents(
	match: MatchInfo,
	noCache?: boolean
): Promise<MatchEventInfo[]> {
	return (
		await data.load<MatchEventInfoApi[]>(
			`match-events-${match.id}`,
			API.MATCH_INFO,
			{ id: match.id, command: 'event', old: true },
			noCache
		)
	)
		.map((event) => useMatchEventInfoMapper(event, match))
		.map((event, index, eventList) => {
			const previousEvent = eventList[index - 1];
			const score = [
				previousEvent?.runningScoreHome ?? 0,
				previousEvent?.runningScoreAway ?? 0,
			];

			if (
				event.type === EVENT_TYPE.GOAL ||
				event.type === EVENT_TYPE.GOAL_POWERPLAY ||
				event.type === EVENT_TYPE.GOAL_SHORTHANDED ||
				event.type === EVENT_TYPE.GOAL_EQUAL_SHORTHANDED ||
				event.type === EVENT_TYPE.GOAL_PENALTY_SHOT
			) {
				score[event.teamId === match.homeTeamId ? 0 : 1]++;
			}

			// Update running score
			event.runningScoreHome = score[0];
			event.runningScoreAway = score[1];

			return event;
		});
}

export async function useMatchReferees(
	matchId: number,
	noCache?: boolean
): Promise<MatchRefereeInfo[]> {
	return (
		await data.load<RefereeInfoApi[]>(
			`match-referees-${matchId}`,
			API.MATCH_INFO,
			{ id: matchId, command: 'referee', old: true },
			noCache
		)
	)
		.filter((referee) => referee.id > 0)
		.map(useMatchRefereeInfoMapper);
}

export async function useMatchOfficials(
	matchId: number,
	noCache?: boolean
): Promise<MatchOfficialInfo[]> {
	return (
		await data.load<MatchOfficialInfoApi[]>(
			`match-officials-${matchId}`,
			API.MATCH_INFO,
			{ id: matchId, command: 'official', old: true },
			noCache
		)
	)
		.filter((official: MatchOfficialInfoApi) => official.id > 0)
		.map(useMatchOfficialInfoMapper);
}

export async function useMatchPlayers(
	matchId: number,
	noCache?: boolean
): Promise<MatchPlayerInfo[]> {
	return (
		await data.load<MatchPlayerInfoApi[]>(
			`match-players-${matchId}`,
			API.MATCH_INFO,
			{ id: matchId, command: 'player', old: true },
			noCache
		)
	)
		.filter((r) => r.id > 0)
		.map(useMatchPlayerInfoMapper);
}
