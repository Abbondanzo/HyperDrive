import { Camera, Euler, EventDispatcher, Vector3 } from "three";

export class BetterPointerLockControls extends EventDispatcher {
  private static PI_2 = Math.PI / 2;
  private static CHANGE_EVENT = { type: "change" };
  private static LOCK_EVENT = { type: "lock" };
  private static UNLOCK_EVENT = { type: "unlock" };

  domElement: HTMLElement;
  isLocked: boolean;

  minPolarAngle: number;
  maxPolarAngle: number;
  maxLeftAngle: number | null;
  maxRightAngle: number | null;
  verticalSensitivity: number;
  horizontalSensitivity: number;

  private camera: Camera;
  private euler: Euler;
  private vec: Vector3;

  constructor(camera: Camera, domElement: HTMLElement) {
    super();
    this.domElement = domElement;
    this.isLocked = false;

    this.minPolarAngle = 0;
    this.maxPolarAngle = Math.PI; // 180 degrees
    this.maxLeftAngle = Math.PI / 2; // 90 degrees
    this.maxRightAngle = -Math.PI / 2; // -90 degrees
    this.verticalSensitivity = 0.0015;
    this.horizontalSensitivity = 0.002;

    this.camera = camera;
    this.euler = new Euler(0, 0, 0, "YXZ");
    this.vec = new Vector3();

    this.connect();
  }

  private readonly onMouseMove = (event: any) => {
    if (this.isLocked === false) return;

    const movementX =
      event.movementX || event.mozMovementX || event.webkitMovementX || 0;
    const movementY =
      event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    const euler = this.euler;

    euler.setFromQuaternion(this.camera.quaternion);

    euler.y -= movementX * this.horizontalSensitivity;
    euler.x -= movementY * this.verticalSensitivity;

    // up/down
    euler.x = Math.min(
      BetterPointerLockControls.PI_2 - this.minPolarAngle,
      euler.x
    );
    euler.x = Math.max(
      BetterPointerLockControls.PI_2 - this.maxPolarAngle,
      euler.x
    );
    // left/right
    if (this.maxRightAngle !== null) {
      euler.y = Math.max(euler.y, this.maxRightAngle);
    }
    if (this.maxLeftAngle !== null) {
      euler.y = Math.min(euler.y, this.maxLeftAngle);
    }

    this.camera.quaternion.setFromEuler(euler);

    this.dispatchEvent(BetterPointerLockControls.CHANGE_EVENT);
  };

  private readonly onPointerlockChange = () => {
    if (this.domElement.ownerDocument.pointerLockElement === this.domElement) {
      this.dispatchEvent(BetterPointerLockControls.LOCK_EVENT);
      this.isLocked = true;
    } else {
      this.dispatchEvent(BetterPointerLockControls.UNLOCK_EVENT);
      this.isLocked = false;
    }
  };

  private readonly onPointerlockError = () => {
    console.error("THREE.PointerLockControls: Unable to use Pointer Lock API");
  };

  connect() {
    this.domElement.ownerDocument.addEventListener(
      "mousemove",
      this.onMouseMove,
      false
    );
    this.domElement.ownerDocument.addEventListener(
      "pointerlockchange",
      this.onPointerlockChange,
      false
    );
    this.domElement.ownerDocument.addEventListener(
      "pointerlockerror",
      this.onPointerlockError,
      false
    );
  }

  disconnect() {
    this.domElement.ownerDocument.removeEventListener(
      "mousemove",
      this.onMouseMove,
      false
    );
    this.domElement.ownerDocument.removeEventListener(
      "pointerlockchange",
      this.onPointerlockChange,
      false
    );
    this.domElement.ownerDocument.removeEventListener(
      "pointerlockerror",
      this.onPointerlockError,
      false
    );
  }

  dispose() {
    this.disconnect();
  }

  getDirection() {
    return new Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
  }

  /**
   * Move forward parallel to the xz-plane. Assumes camera.up is y-up.
   *
   * @param distance
   */
  moveForward(distance: number) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.vec.crossVectors(this.camera.up, this.vec);
    this.camera.position.addScaledVector(this.vec, distance);
  }

  moveRight(distance: number) {
    this.vec.setFromMatrixColumn(this.camera.matrix, 0);
    this.camera.position.addScaledVector(this.vec, distance);
  }

  lock() {
    this.domElement.requestPointerLock();
  }

  unlock() {
    this.domElement.ownerDocument.exitPointerLock();
  }
}
