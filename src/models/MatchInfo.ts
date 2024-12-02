//import VenueInfo from './api/VenueInfo';

export default interface MatchInfo {
	id: number;
	isLive: boolean;
	isStarted: boolean;
	isFinished: boolean;
	tournamentName: string;
	venueId: number;
	date: Date;
	description: string;
	homeTeamId: number;
	homeTeamName: string;
	homeTeamLogo: string | undefined;
	homeTeamScore: number;
	homeTeamClubId: number;
	awayTeamId: number;
	awayTeamName: string;
	awayTeamLogo: string | undefined;
	awayTeamScore: number;
	awayTeamClubId: number;
	venueName: string;
}
