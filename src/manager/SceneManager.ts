import { Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer";

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
  private static USE_COMPOSER = true;

  readonly scene: Scene;

  private readonly renderer: WebGLRenderer;
  private readonly cssRenderer: CSS3DRenderer;
  private readonly composer: EffectComposer;

  constructor() {
    this.scene = new Scene();
    this.scene.add(CameraManager.camera);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.cssRenderer = new CSS3DRenderer();

    // Configure bloom pass for future work
    this.composer = new EffectComposer(this.renderer);
    this.addComposerPasses();

    addFrameListener(this.update);
    addWindowResizeListener(this.handleResize);
  }

  private addComposerPasses() {
    const renderScene = new RenderPass(this.scene, CameraManager.camera);
    this.composer.addPass(renderScene);

    const bloomPass = new UnrealBloomPass(
      new Vector2(window.innerWidth, window.innerHeight),
      0.5,
      0,
      0
    );
    // this.composer.addPass(bloomPass)

    const ssaoPass = new SSAOPass(this.scene, CameraManager.camera);
    ssaoPass.output = SSAOPass.OUTPUT.SSAO;
    // this.composer.addPass(ssaoPass);

    const filmPass = new FilmPass(0.35, 0.025, 648, 0);
    // this.composer.addPass(filmPass);
  }

  attach(element: HTMLElement) {
    element.appendChild(this.renderer.domElement);
    this.cssRenderer.domElement.id = "css-renderer";
    element.appendChild(this.cssRenderer.domElement);
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
    this.cssRenderer.setSize(width, height);
    this.composer.setSize(width, height);
  };

  private update = ({ delta }: FrameEvent) => {
    try {
      this.cssRenderer.render(this.scene, CameraManager.cssCamera);
      if (SceneManager.USE_COMPOSER) {
        this.composer.render(delta);
      } else {
        this.renderer.render(this.scene, CameraManager.camera);
      }
    } catch (error) {
      console.warn(error);
      removeFrameListener(this.update);
    }
  };
}

// Export single class instance
export default new SceneManager();
