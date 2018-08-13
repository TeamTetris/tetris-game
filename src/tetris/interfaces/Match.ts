import MatchPlayer from "tetris/interfaces/MatchPlayer";

export default interface Match {
	id: number;
	players: MatchPlayer[];
	startTime: string; // need to call Date.parse first, then it's a Date
    joinUntil: string;
	nextElimination: string;
}