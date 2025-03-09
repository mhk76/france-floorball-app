import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import TeamInfo from 'src/models/TeamInfo';
import TeamInfoApi from 'src/models/api/TeamInfoApi';
import useTeamInfoMapper from './mappers/useTeamInfoMapper';

const data = useDataStore();

export async function useTeams(
	seasonId: number
): Promise<Map<number, string[]>> {
	return (
		await data.load<TeamInfoApi[]>(`teams-${seasonId}`, API.GLOBAL_SEARCH, {
			idseason: seasonId,
			search_type: 'team',
			text: '',
		})
	)
		.map(useTeamInfoMapper)
		.reduce((teams: Map<number, string[]>, team: TeamInfo) => {
			if (teams.has(team.clubId)) {
				teams.get(team.clubId)!.push(team.category.toString());
			} else {
				teams.set(team.clubId, [team.category?.toString()]);
			}

			return teams;
		}, new Map<number, string[]>());
}
