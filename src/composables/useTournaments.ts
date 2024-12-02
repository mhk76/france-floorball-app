import { useDataStore } from 'src/stores/dataStore';
import API from 'src/definitions/API';
import TournamentInfo from 'src/models/TournamentInfo';
import DivisionInfo from 'src/models/DivisionInfo';
import RankingInfo from 'src/models/RankingInfo';

const data = useDataStore();

export async function useTournaments(seasonId: number) {
	const tournaments = (
		await data.load<TournamentInfo[]>(
			`season-tournaments-${seasonId}`,
			API.TOURNAMENT_INFO,
			{ seasonid: seasonId, command: 'getall' }
		)
	).sort((a, b) => a.id - b.id);

	tournaments.forEach((t) => data.set(`tournament-info-${t.id}`, t));

	return tournaments;
}

export async function useTournament(tournamentId: number) {
	return await data.load<TournamentInfo>(
		`tournament-info-${tournamentId}`,
		API.TOURNAMENT_INFO,
		{ id: tournamentId, command: 'get' }
	);
}

export async function useTournamentDivisions(tournamentId: number) {
	return (
		await data.load<DivisionInfo[]>(
			`tournament-divisions-${tournamentId}`,
			API.DIVISION_INFO,
			{ tournament_id: tournamentId, command: 'getall' }
		)
	)
		.filter((d) => d.reasonofcancel != null)
		.sort((a, b) => a.comp_order - b.comp_order);
}

export async function useDivisionRankings(divisionId: number) {
	return await data.load<RankingInfo[]>(
		`division-rankings-${divisionId}`,
		API.DIVISION_INFO,
		{ id: divisionId, command: 'get_ranking' }
	);
}
