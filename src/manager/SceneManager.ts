import { Scene, Vector2, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
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
import { BadTVShader } from "../scene/shaders/BadTVShader";
import CameraManager from "./CameraManager";
import EventManager from "./EventManager";
import { Composer } from "../scene/postprocessing/Composer";

class SceneManager {
  private static USE_COMPOSER = true;

  readonly scene: Scene;

  private readonly renderer: WebGLRenderer;
  private readonly cssRenderer: CSS3DRenderer;
  private readonly composer: Composer;

  constructor() {
    this.scene = new Scene();
    this.scene.add(CameraManager.camera);
    this.renderer = new WebGLRenderer({ antialias: true });
    this.cssRenderer = new CSS3DRenderer();

    this.composer = new Composer(
      this.scene,
      CameraManager.camera,
      this.renderer
    );

    addFrameListener(this.update);
    addWindowResizeListener(this.handleResize);
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
  };

  private update = ({ delta }: FrameEvent) => {
    try {
      this.cssRenderer.render(this.scene, CameraManager.cssCamera);
      if (!SceneManager.USE_COMPOSER) {
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
