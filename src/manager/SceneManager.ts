import { Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

import {
  addFrameListener,
  FrameEvent,
  removeFrameListener,
} from "../events/frame";
import {
  addWindowResizeListener,
  dispatchWindowResizeEvent,
  WindowResizeEvent,
} from "../events/windowResize";
import CameraManager from "./CameraManager";
import EventManager from "./EventManager";

class SceneManager {
  readonly scene: Scene;

  private readonly renderer: WebGLRenderer;
  private readonly composer: EffectComposer;

  constructor() {
    this.scene = new Scene();
    this.scene.add(CameraManager.camera);
    this.renderer = new WebGLRenderer({ antialias: true });

    // Configure bloom pass for future work
    const renderScene = new RenderPass(this.scene, CameraManager.camera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0,
      0
    );

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);

    addFrameListener(this.update);
    addWindowResizeListener(this.handleResize);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.renderer.domElement);
    EventManager.addListeners();
    CameraManager.initializeControls(element);
    // Dispatch a global event to check the height since we've now attached our canvas
    dispatchWindowResizeEvent({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  private readonly handleResize = ({ width, height }: WindowResizeEvent) => {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  };

  private update = ({}: FrameEvent) => {
    try {
      this.renderer.render(this.scene, CameraManager.camera);
      // this.composer.render(delta);
    } catch (error) {
      console.warn(error);
      removeFrameListener(this.update);
    }
  };
}

// Export single class instance
export default new SceneManager();
