import GENDER from 'src/enums/GENDER';

export default interface MatchPlayerInfo {
	id: number;
	name: string;
	teamId: number;
	number: number;
	isCaptain: boolean;
	isMvp: boolean;
	gamesPlayed?: number;
	goals: number;
	assists: number;
	isGoalkeeper: boolean;
	saves?: number;
	goalsConceeded?: number;
	savePercent?: number;
	photo?: string;
	gender: GENDER;
	nationality?: string;
}
