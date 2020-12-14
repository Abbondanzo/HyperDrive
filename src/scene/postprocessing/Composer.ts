import { Camera, Scene, WebGLRenderer } from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass";
import { FilmShader } from "three/examples/jsm/shaders/FilmShader";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { addSongFrequencyListener } from "../../events/songFrequency";
import {
  addWindowResizeListener,
  WindowResizeEvent,
} from "../../events/windowResize";
import { BadTVShader } from "../shaders/BadTVShader";
import { StaticShader } from "../shaders/StaticShader";
import { SongFrequencyEvent } from "./../../events/songFrequency";
import { CRTShader } from "./../shaders/CRTShader";

export class Composer {
  private readonly composer: EffectComposer;

  private readonly ssaoPass: SSAOPass;
  private readonly filmPass: ShaderPass;
  private readonly badTVPass: ShaderPass;
  private readonly staticPass: ShaderPass;
  private readonly crtPass: ShaderPass;

  constructor(scene: Scene, camera: Camera, renderer: WebGLRenderer) {
    this.composer = new EffectComposer(renderer);

    const renderScene = new RenderPass(scene, camera);
    this.composer.addPass(renderScene);

    this.ssaoPass = new SSAOPass(scene, camera);
    this.ssaoPass.output = SSAOPass.OUTPUT.SSAO;
    // this.composer.addPass(ssaoPass);

    this.filmPass = new ShaderPass(FilmShader);
    // this.composer.addPass(this.filmPass);

    this.staticPass = new ShaderPass(StaticShader);
    this.staticPass.uniforms["amount"].value = 0.04;
    this.composer.addPass(this.staticPass);

    this.badTVPass = new ShaderPass(BadTVShader);
    this.badTVPass.renderToScreen = true;
    this.badTVPass.uniforms["rollSpeed"].value = 0;
    this.badTVPass.uniforms["distortion"].value = 0.5;
    this.badTVPass.uniforms["distortion2"].value = 0.25;
    this.composer.addPass(this.badTVPass);

    this.crtPass = new ShaderPass(CRTShader);
    this.composer.addPass(this.crtPass);

    // Subscribers
    addWindowResizeListener(this.handleResize);
    addFrameListener(this.update);
    addSongFrequencyListener(this.handleSongFrequency);
  }

  private readonly handleResize = ({ width, height }: WindowResizeEvent) => {
    this.composer.setSize(width, height);
  };

  private readonly update = ({ delta, elapsedTime }: FrameEvent) => {
    this.composer.render(delta / 1000);
    this.badTVPass.uniforms["time"].value = elapsedTime / 1000;
    this.filmPass.uniforms["time"].value = elapsedTime;
    this.staticPass.uniforms["time"].value = elapsedTime / 1000;
  };

  private readonly handleSongFrequency = ({
    averageFrequency,
  }: SongFrequencyEvent) => {
    const increase = (0.3 * averageFrequency) / 255;
    this.crtPass.uniforms["opacity"].value = 0.1 + increase;
  };
}
