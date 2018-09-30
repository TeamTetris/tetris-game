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
	Eliminated,
	Won
}

export interface BlockState {
	spriteFrameName: string;
}

export default interface MatchPlayer {
	placement: number;
	displayName: string;
	socketId: string;
    points: number;
	connectionStatus: ConnectionStatus;
	scoreboardStatus: ScoreboardStatus;
	playStatus: PlayStatus;
	field: Array<Array<BlockState>>;
}