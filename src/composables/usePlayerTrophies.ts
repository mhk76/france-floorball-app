import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import { Trophy } from 'src/models/Trophy';
import { TrophyApi } from 'src/models/api/TrophyApi';
import useTrophyMapper from './mappers/useTrophyMapper';

const data = useDataStore();

export async function usePlayerTrophies(playerId: number): Promise<Trophy[]> {
	return useTrophyMapper(
		await data.load<TrophyApi[]>(
			`player-trophies-${playerId}`,
			API.CLUB_TROPHIES,
			{
				command: 'getall_player',
				player: playerId,
			}
		)
	);
}
