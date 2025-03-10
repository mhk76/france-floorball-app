import GENDER from 'src/enums/GENDER';
import PlayerInfoApi from 'src/models/api/PlayerInfoApi';
import PlayerInfo from 'src/models/PlayerInfo';
import { useGlobalStore } from 'src/stores/globalStore';

const global = useGlobalStore();

const noPhotoM = 'assets/default/playerM.jpg';
const noPhotoF = 'assets/default/playerW.jpg';

export default function usePlayerInfoMapper(api: PlayerInfoApi): PlayerInfo {
	return {
		id: api.id,
		name: global.name(api.firstname, api.lastname),
		birthDate: new Date(api.birthdate),
		gender: api.sex as GENDER,
		photo:
			api.photo === noPhotoM || api.photo === noPhotoF
				? undefined
				: api.photo,
		nationality: api.nat1 ?? 'FR',
		clubId: api.clubid,
		clubName: api.clubname,
		clubLogo: api.clublogo,
	};
}
