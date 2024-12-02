import GENDER from 'src/definitions/Gender';

export default interface MatchPlayerInfo {
	id: number;
	name: string;
	teamId: number;
	number: number;
	isCaptain: boolean;
	isMvp: boolean;
	goals: number;
	assists: number;
	isGoalkeeper: boolean;
	saves?: number;
	goalsConceeded?: number;
	savePercent?: number;
	photo?: string;
	gender: GENDER;
}
