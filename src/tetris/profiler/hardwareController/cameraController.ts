import HardwarePermission from "tetris/profiler/hardwareController/hardwarePermission";
import DialogResult from "tetris/ui/dialog/dialogResult";
import Dialog from "tetris/ui/dialog/dialog";
import PermissionRequestDialog from "tetris/ui/dialog/permissionRequestDialog";

export default class CameraController {

	//region public members
	public get permissionState(): HardwarePermission {
		return this._permissionState;
	}

	public get lastPhoto(): string {
		return this._lastPhotoTaken;
	}
	//endregion

	//region public methods

	public async requestWebcamPermissions(): Promise<boolean> {
		if (this.permissionState === HardwarePermission.granted) {
			return true;
		}
		if (this.permissionState === HardwarePermission.denied) {
			return false;
		}
		const permissionDialog = PermissionRequestDialog.displayCameraPermissionRequest();
		await permissionDialog.awaitResult();
		if (permissionDialog.result !== DialogResult.Accepted) {
			return false;
		}
		try {
			await CameraController.instance.startVideoStream();
			CameraController.instance.stopVideoStream();
		} catch {
			return false;
		}
		return true;
	}

	public async startVideoStream(): Promise<MediaStream> {
		if (this.permissionState === HardwarePermission.denied) {
			return Promise.reject(new Error('No Permissions granted'));
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ video: true });
			this._permissionState = HardwarePermission.granted;
			this._videoElement.classList.add('visible');
			this._videoElement.srcObject = stream;
			this._videoStream = stream;
			await this._videoElement.play();
			return stream;
		} catch(reason) {
			this._permissionState = HardwarePermission.denied;
			console.log('Can not start video stream. Message: ' + reason);
			throw reason;
		}
	}

	public stopVideoStream(): void {
		if (!this._videoStream) {
			return;
		}
		this._videoElement.pause();
		this._videoStream.getTracks()[0].stop();
		this._videoElement.src = null;
	}

	public async takeSnapshot(): Promise<string> {
		if (this._videoStream && this._videoStream.active) {
			return Promise.resolve(this._takeSnapshot());
		}
		try {
			await this.startVideoStream();
		} catch (error) {
			throw error;
		}
		return Promise.resolve(this._takeSnapshot());
	}

	//endregion

	//region constructor
	private static _instance: CameraController;

	public static get instance(): CameraController {
		if (!this._instance) {
			this._instance = new CameraController();
		}
		return this._instance;
	}

	private constructor() {
		this._canvas = document.getElementById('hidden-camera-canvas') as HTMLCanvasElement;
		this._videoElement = document.getElementById('camera-stream') as HTMLVideoElement;
		this._takePhotoButton = document.getElementById('take-photo') as HTMLLinkElement;
		this._deletePhotoButton = document.getElementById('delete-photo') as HTMLLinkElement;
		this._photoPreview = document.getElementById('snap') as HTMLImageElement;
		this._permissionState = HardwarePermission.requested;
		this._takePhotoButton.addEventListener('click', this._takePhotoButtonClicked.bind(this));
		this._deletePhotoButton.addEventListener('click', this._deletePhotoButtonClicked.bind(this));
	}
	//endregion

	//region private members
	private readonly _canvas: HTMLCanvasElement;
	private readonly _videoElement: HTMLVideoElement;
	private readonly _takePhotoButton: HTMLLinkElement;
	private readonly  _deletePhotoButton: HTMLLinkElement;
	private readonly  _photoPreview: HTMLImageElement;
	private _permissionState: HardwarePermission;
	private _videoStream: MediaStream;
	private _lastPhotoTaken: string;
	//endregion

	//region private methods
	private _takeSnapshot(): string {
		this._canvas.width = this._videoElement.videoWidth;
		this._canvas.height = this._videoElement.videoHeight;
		this._canvas.getContext('2d').drawImage(
			this._videoElement,
			0,
			0 ,
			this._videoElement.videoWidth,
			this._videoElement.videoHeight
		);

		const base64Image = this._canvas
			.toDataURL('image/png')
			.replace(/^data:image\/(png|jpg);base64,/, "");
		console.log('Snapshot taken: ' + base64Image.substr(base64Image.length - 20));
		return base64Image;
	}

	private async _takePhotoButtonClicked(event: Event): Promise<void> {
		event.preventDefault();

		this._lastPhotoTaken = await this.takeSnapshot();
		this._photoPreview.src = "data:image/png;base64, " + this._lastPhotoTaken;
		this._photoPreview.classList.add('visible');
		this._deletePhotoButton.classList.remove('disabled');
		this._videoElement.pause();
	}

	private _deletePhotoButtonClicked(event: Event): void {
		event.preventDefault();

		this._photoPreview.classList.remove('visible');
		this._photoPreview.src = '';
		this._deletePhotoButton.classList.add('disabled');
		this._videoElement.play();
	}
	//endregion
}