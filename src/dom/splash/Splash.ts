import { LoadingManager } from "three";

type Callback = (loadingManager: LoadingManager, withSound: boolean) => void;

export class Splash {
  readonly container: HTMLDivElement;

  private readonly onClickCallback: Callback;
  private readonly loadingManager: LoadingManager;

  constructor(callback: Callback) {
    this.loadingManager = new LoadingManager();
    this.container = document.createElement("div");
    this.container.id = "splash";
    this.container.classList.add("hidden");
    this.onClickCallback = callback;
    this.buildSplash();
  }

  private buildSplash() {
    const title = document.createElement("img");
    title.src = "images/logo_b.png";
    title.alt = "Logo";
    title.title = "HyperDrive";
    title.onload = () => {
      this.container.classList.remove("hidden");
      this.container.classList.add("fade-in");
    };
    this.container.appendChild(title);
    //
    const body = document.createElement("p");
    const isMobile = this.isMobile();
    body.textContent = isMobile
      ? "For the full experience, please open this page on a desktop"
      : "For the best possible experience, please use headphones";
    this.container.appendChild(body);
    //
    const button = document.createElement("button");
    button.innerHTML = "Launch";
    button.addEventListener("click", () => {
      this.showLoadingManager();
      this.onClickCallback(this.loadingManager, true);
    });
    this.container.appendChild(button);
    //
    const noAudioLink = document.createElement("a");
    noAudioLink.innerHTML = "Launch Without Sound";
    noAudioLink.addEventListener("click", () => {
      this.showLoadingManager();
      this.onClickCallback(this.loadingManager, false);
    });
    const spanContainer = document.createElement("span");
    spanContainer.appendChild(noAudioLink);
    this.container.appendChild(spanContainer);
  }

  private showLoadingManager() {
    this.container.innerHTML = "";
    //
    const title = document.createElement("h3");
    title.innerHTML = "Loading Scene Assets:";
    this.container.appendChild(title);
    //
    const body = document.createElement("p");
    body.innerHTML = "0%";
    this.container.appendChild(body);
    //
    const percentHandler = (url: string, loaded: number, total: number) => {
      body.innerHTML = `${Math.round((loaded / total) * 100)}% <br /> ${url}`;
    };
    this.loadingManager.onStart = percentHandler;
    this.loadingManager.onProgress = percentHandler;
    this.loadingManager.onLoad = () => {
      body.innerHTML = "Building scene... <br />";
    };
    this.loadingManager.onError = () => {
      body.innerHTML =
        "There was an error loading. Please refresh and try again";
    };
  }

  private isMobile(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      window.navigator.userAgent
    );
  }
}
