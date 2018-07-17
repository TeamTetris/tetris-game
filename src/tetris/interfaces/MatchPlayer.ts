export enum ConnectionStatus {
	Connecting,
	Connected,
	Disconnected
}

export enum ScoreboardStatus {
	Regular,
	Endangered,
	Spotlighted
}

export enum PlayStatus {
	Playing,
	Finished
}

export default interface MatchPlayer {
	rank: string;
    name: string;
    score: string;
	connectionStatus: ConnectionStatus;
	scoreboardStatus: ScoreboardStatus;
	playStatus: PlayStatus;
	field: Object;
}