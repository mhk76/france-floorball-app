import { useDataStore } from 'src/stores/dataStore';
import API from 'src/definitions/API';
import TeamInfo from 'src/models/TeamInfo';

const data = useDataStore();

export async function useTeamList(seasonId: number) {
	return (
		await data.load<TeamInfo[]>(`teams-${seasonId}`, API.GLOBAL_SEARCH, {
			idseason: seasonId,
			search_type: 'team',
			text: '',
		})
	).reduce((teams: Map<number, string[]>, team: TeamInfo) => {
		if (teams.has(team.clubid)) {
			teams.get(team.clubid)!.push(team.category.toString());
		} else {
			teams.set(team.clubid, [team.category?.toString()]);
		}

		return teams;
	}, new Map<number, string[]>());
}
