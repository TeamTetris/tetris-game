
/// <reference path="../../../definitions/phaser.d.ts"/>

import * as socketIO from 'socket.io-client';
import config from 'tetris/config';

export default class NetworkingClient {
	//region public members
	//endregion

  //region public methods
  public emit(event: string, args) {
    this._socket.emit(event, args);
  }

  public receive(event: string, callback: Function) {
    this._socket.on(event, callback);
  }

  public connect() {
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