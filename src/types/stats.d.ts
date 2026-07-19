declare module "stats.js" {
  export default class Stats {
    domElement: HTMLDivElement;
    setMode(mode: number): void;
    update(): void;
  }
}
