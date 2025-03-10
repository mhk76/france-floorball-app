import GENDER from 'src/enums/GENDER';

export default interface PlayerInfo {
	id: number;
	name: string;
	birthDate: Date;
	gender: GENDER;
	photo: string | undefined;
	nationality: string;
	clubId: number;
	clubName: string;
	clubLogo: string;
}
