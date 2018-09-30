
/// <reference path="../../../definitions/phaser.d.ts"/>

import * as socketIO from 'socket.io-client';
import config from 'tetris/config';

export default class NetworkingClient {
  //region public members
  public get socketId(): string {
    return this._socket.id;
  }
	//endregion

  //region public methods
  public emit(event: string, args: any, acknowledgement: Function = null): void {
    this._socket.emit(event, args, acknowledgement);
  }

  public receive(event: string, callback: Function): void {
    this._socket.on(event, callback);
  }

  public connect(): void {
    this._socket.connect();
  }
	//endregion

  //region constructor
  public constructor() {
    this._socket = socketIO(config.serverAddress, { autoConnect: false });
  }
	//endregion

  //region private members
  private _socket: SocketIOClient.Socket;
	//endregion

	//region private methods
	//endregion
}
