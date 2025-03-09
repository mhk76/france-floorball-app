import { useDataStore } from 'src/stores/dataStore';
import { TeamPlayerInfoApi } from 'src/models/api/TeamPlayerInfoApi';
import API from 'src/enums/API';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import useTeamPlayerInfoMapper from './mappers/useTeamPlayerInfoMapper';

const data = useDataStore();

export async function useClubPlayers(
	seasonId: number,
	clubId: number
): Promise<MatchPlayerInfo[]> {
	return (
		await data.load<TeamPlayerInfoApi[]>(
			`team-players-${seasonId}-${clubId}`,
			API.PLAYER_INFO,
			{
				command: 'club',
				season: seasonId,
				id: clubId,
			}
		)
	).map(useTeamPlayerInfoMapper);
}
