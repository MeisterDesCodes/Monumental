import {Injectable} from "@angular/core";

@Injectable()
export class MusicHandler {

  currentMusic: HTMLAudioElement | null = null;

  constructor() {
  }

  playAudio(path: string): void {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic = null;
    }
    else {
      this.currentMusic = new Audio();
      this.currentMusic.src = path;
      this.currentMusic.autoplay = true;
      this.currentMusic.loop = true;
      this.currentMusic.load();
      this.currentMusic.play();
    }
  }
}
