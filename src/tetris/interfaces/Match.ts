import MatchPlayer from "tetris/interfaces/MatchPlayer";

export default interface Match {
	id: number;
	players: MatchPlayer[];
	startTime: Date;
    joinUntil: Date;
    roundStartTime: Date;
	nextElimination: Date;
}