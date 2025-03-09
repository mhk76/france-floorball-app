import { useDataStore } from 'src/stores/dataStore';
import API from 'src/enums/API';
import PlayerInfoApi from 'src/models/api/PlayerInfoApi';
import PlayerInfo from 'src/models/PlayerInfo';
import usePlayerInfoMapper from './mappers/usePlayerInfoMapper';

const data = useDataStore();

export async function usePlayer(playerId: number): Promise<PlayerInfo> {
	const api = await data.load<PlayerInfoApi>(
		`player-info-${playerId}`,
		API.PLAYER_INFO,
		{ id: playerId, command: 'get' }
	);

	return usePlayerInfoMapper(api);
}
