import { useGlobalStore } from 'src/stores/globalStore';
import MatchPlayerInfoApi from 'src/models/api/MatchPlayerInfoApi';
import MatchPlayerInfo from 'src/models/MatchPlayerInfo';
import GENDER from 'src/definitions/Gender';

const global = useGlobalStore();

const DefaultMalePhoto = 'assets/default/playerM.jpg';
const DefaultFemalePhoto = 'assets/default/playerW.jpg';

function getPhoto(photo: string | null) {
	if (
		photo == null ||
		photo === DefaultMalePhoto ||
		photo === DefaultFemalePhoto
	) {
		return undefined;
	} else {
		return photo;
	}
}

function getGender(gender: string) {
	if (gender === 'Male') {
		return GENDER.MALE;
	}
	if (gender === 'Female') {
		return GENDER.FEMALE;
	} else {
		return GENDER.UNKNOWN;
	}
}

export function useMatchPlayerInfoMapper(
	api: MatchPlayerInfoApi
): MatchPlayerInfo {
	return {
		id: api.id,
		name: global.name(api.firstname, api.lastname),
		teamId: api.teamid,
		number: api.number,
		isCaptain: api.iscaptain,
		isGoalkeeper: api.isgoalkeeper === 1,
		isMvp: api.mvp,
		goals: api.goal,
		assists: api.assist,
		saves: api.saves ? parseInt(api.saves, 10) : undefined,
		goalsConceeded: api.goal_conceed ?? undefined,
		savePercent: api.pc_saves ?? undefined,
		photo: getPhoto(api.photo),
		gender: getGender(api.sex),
	};
}
