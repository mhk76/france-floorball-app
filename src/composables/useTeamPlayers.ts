import { useDataStore } from 'src/stores/dataStore';
import { TeamPlayerInfoApi } from 'src/models/api/TeamPlayerInfoApi';
import API from 'src/enums/API';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import useTeamPlayerInfoMapper from './mappers/useTeamPlayerInfoMapper';

const data = useDataStore();

export async function useTeamPlayers(
	teamId: number
): Promise<MatchPlayerInfo[]> {
	return (
		await data.load<TeamPlayerInfoApi[]>(
			`team-players-${teamId}`,
			API.PLAYER_INFO,
			{
				command: 'team',
				id: teamId,
			}
		)
	).map(useTeamPlayerInfoMapper);
}
