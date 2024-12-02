import { useDataStore } from 'src/stores/dataStore';
import API from 'src/definitions/API';
import MatchListInfo from 'src/models/MatchListInfo';
import MatchListInfoApi from 'src/models/api/MatchListInfoApi';
import useMatchListInfoMapper from './mappers/useMatchListInfoMapper';

const data = useDataStore();

export async function useLiveMatches(): Promise<MatchListInfo> {
	const result = await data.load<MatchListInfoApi>(
		'live-matches',
		API.MATCH_LIST,
		{ command: 'live' },
		true
	);

	return useMatchListInfoMapper(result);
}

export async function useComingMatches(): Promise<MatchListInfo> {
	const result = await data.load<MatchListInfoApi>(
		'coming-matches',
		API.MATCH_LIST,
		{ command: 'next' },
		true
	);

	return useMatchListInfoMapper(result);
}

export async function useRecentMatches(): Promise<MatchListInfo> {
	const result = await data.load<MatchListInfoApi>(
		'recent-matches',
		API.MATCH_LIST,
		{ command: 'played' },
		true
	);

	return useMatchListInfoMapper(result);
}

export async function useDivisionMatches(
	divisionId: number
): Promise<MatchListInfo> {
	const result = await data.load<MatchListInfoApi>(
		`division-matches-${divisionId}`,
		API.MATCH_LIST,
		{ id: divisionId, command: 'round' }
	);

	return useMatchListInfoMapper(result);
}
