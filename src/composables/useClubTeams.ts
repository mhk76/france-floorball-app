import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import useTeamInfoMapper from './mappers/useTeamInfoMapper';
import TeamInfo from 'src/models/TeamInfo';
import TeamInfoApi from 'src/models/api/TeamInfoApi';

const data = useDataStore();

export async function useClubTeams(
	seasonId: number,
	clubId: number
): Promise<TeamInfo[]> {
	return (
		await data.load<TeamInfoApi[]>(
			`club-teams-${seasonId}-${clubId}`,
			API.CLUB_TEAMS_LIST,
			{
				seasonid: seasonId,
				clubid: clubId,
			}
		)
	).map(useTeamInfoMapper);
}
