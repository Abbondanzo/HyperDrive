import { BoxGeometry, Group, Mesh, MeshPhongMaterial, Object3D } from "three";

import { addFrameListener, FrameEvent } from "../../events/frame";
import { SceneSubject } from "../SceneSubject";
import { MovingObject } from "./MovingObject";
import { Pavement } from "./Pavement";

export class Guardrail extends MovingObject implements SceneSubject {
  name = "Guardrail";

  private static GAP_DISTANCE = 10;
  private static TOTAL_DISTANCE = 200;

  private static EDGE_X = Pavement.SQUARE_SIZE / 2 - 0.1;
  private static POST_WIDTH = 0.12;
  private static POST_HEIGHT = 0.7;
  private static RAIL_HEIGHT = 0.18;
  private static RAIL_DEPTH = 0.06;

  private railsGroup: Group;

  constructor() {
    super();
    this.offsetMultiplier =
      (Pavement.SQUARE_SIZE / Guardrail.GAP_DISTANCE) *
      Pavement.OFFSET_MULTIPLIER;
    addFrameListener(this.handleFrame);
  }

  async load() {}

  attach(parent: Object3D) {
    const leftSide = this.buildSide(true);
    const rightSide = this.buildSide(false);
    this.railsGroup = new Group();
    this.railsGroup.add(leftSide, rightSide);
    parent.add(this.railsGroup);
  }

  private buildSide(left: boolean): Group {
    const sideGroup = new Group();
    const material = new MeshPhongMaterial({
      color: 0x9aa0aa,
      emissive: 0x15161c,
      shininess: 40,
    });

    for (
      let zOffset = -Guardrail.TOTAL_DISTANCE;
      zOffset <= Guardrail.GAP_DISTANCE;
      zOffset += Guardrail.GAP_DISTANCE
    ) {
      const post = new Mesh(
        new BoxGeometry(
          Guardrail.POST_WIDTH,
          Guardrail.POST_HEIGHT,
          Guardrail.POST_WIDTH,
        ),
        material,
      );
      post.position.set(0, Guardrail.POST_HEIGHT / 2, zOffset);
      sideGroup.add(post);
    }

    const railLength = Guardrail.TOTAL_DISTANCE + Guardrail.GAP_DISTANCE;
    const rail = new Mesh(
      new BoxGeometry(Guardrail.RAIL_DEPTH, Guardrail.RAIL_HEIGHT, railLength),
      material,
    );
    rail.position.set(
      0,
      Guardrail.POST_HEIGHT - Guardrail.RAIL_HEIGHT / 2,
      (Guardrail.GAP_DISTANCE - Guardrail.TOTAL_DISTANCE) / 2,
    );
    sideGroup.add(rail);

    sideGroup.position.x = left ? -Guardrail.EDGE_X : Guardrail.EDGE_X;
    return sideGroup;
  }

  private readonly handleFrame = ({ delta }: FrameEvent) => {
    const distance = Guardrail.GAP_DISTANCE * this.offsetPerMS;
    const newOffset =
      (this.railsGroup.position.z + delta * distance) % Guardrail.GAP_DISTANCE;
    this.railsGroup.position.z = newOffset;
  };
}
