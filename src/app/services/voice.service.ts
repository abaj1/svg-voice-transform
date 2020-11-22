import { Injectable } from "@angular/core";
import { MapElement } from "../models/map-element.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class VoiceService {
  private mapElements: MapElement[] = [];
  private audioElements: {
    element: Element;
    audio: HTMLAudioElement;
  }[] = [];
  public playedVoiceSubject: Subject<HTMLElement> = new Subject<HTMLElement>();

  constructor() {}

  public checkGroupOnElement(element: HTMLElement, teacherMode: boolean) {
    // if (!this.getMapElementsSize()) return;
    // if (!this.checkIfElementHasGroup(element)) return;
    if (!element.getAttribute("clicked")) {
      return;
    }
    // const e = this.getMapElement(element);
    // if (e) teacherMode ? this.playVoice(e) : this.playMusic(e);
    teacherMode ? this.playVoice(element) : this.playMusic(element);
  }
  public getMapElements() {
    return [...this.mapElements];
  }
  public getMapElement(element: Element): MapElement {
    return this.mapElements.find(e => {
      return e.element.isEqualNode(element);
    });
  }

  public addElement(mapElement: MapElement) {
    this.mapElements.push(mapElement);
  }
  public addElements(mapElements: MapElement[]) {
    this.mapElements.push(...mapElements);
  }
  public updateElement(index: number, newMapElement: MapElement) {
    this.mapElements[index] = { ...newMapElement };
    let k = -1;
    this.audioElements.forEach((e, i) => {
      if (e.element.isEqualNode(newMapElement.element)) {
        k = i;

        this.audioElements[k].audio = new Audio(
          `./assets/sounds/${newMapElement.layerName}.mp3`
        );
      }
    });
  }
  public deleteElement(index: number) {
    this.mapElements.splice(index, 1);
  }
  public getElementIndex(element: Element) {
    return this.mapElements.findIndex(me => me.element.isEqualNode(element));
  }
  private playVoice(element: Element) {
    this.audioElements.forEach(e => e.audio.pause());
    this.say(element.getAttribute("_name"));
  }
  public playDescription(element: Element) {
    this.audioElements.forEach(e => e.audio.pause());
    this.say(element.getAttribute("_description"));
  }
  private playMusic(element: HTMLElement) {
    const layerName = element.parentElement.getAttribute("class").substr(6);
    if(layerName){
      if (!this.audioElements.length) {
          const audio = new Audio(`./assets/sounds/${layerName}.mp3`);
          this.audioElements.push({ element: element, audio: audio });
          audio.play().catch(e => console.log(e));
          this.playedVoiceSubject.next(element);
          return;
        }else {
          const el = this.audioElements.find(e =>
          e.element.isEqualNode(element)
          );
          if (el) {
            el.audio.play().catch(e => console.log(e));
            this.playedVoiceSubject.next(element);
            return;
          }else{
            const audio = new Audio(`./assets/sounds/${layerName}.mp3`);
            this.audioElements.push({ element: element, audio: audio });
            audio.play().catch(e => console.log(e));
            this.playedVoiceSubject.next(element);
            return;
          }
        }
    }
    return;
  }
  public say(msg) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
  }
  public stopMusic(element: Element) {
    this.audioElements.forEach(e => {
      e.audio.pause();
    });
  }
}
