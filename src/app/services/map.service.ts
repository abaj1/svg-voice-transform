import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { DataManagerService } from "./data-manager.service";

export interface FileContent {
  fileName: string;
  content: string;
}
export interface Map {
  id: string;
  name: string;
  content: string;
}

@Injectable({
  providedIn: "root"
})
export class MapService {
  mapContent: Subject<FileContent> = new Subject<FileContent>();
  mapChoosen: Subject<Map> = new Subject<Map>();
  addMap: Subject<Map[]> = new Subject<Map[]>();
  mapLoaded: Subject<boolean> = new Subject<boolean>();
  mapContents: string[] = [];
  // maps: Map[] = [];

  constructor(private dataManager: DataManagerService) {}

  getFileDetails(file: HTMLInputElement, extPattern: RegExp): FileContent {
    if (file.files[0] && extPattern.test(file.files[0].name)) {
      const newFile = file.files[0];
      const reader = new FileReader();
      reader.onload = ({ target }: any) => {
        const { result } = target;
        this.mapContent.next({
          fileName: newFile.name,
          content: result.toString()
        });
        this.mapLoaded.next(true);
      };
      reader.readAsText(newFile);
    } else {
      return null;
    }
  }
  AddMap(fileContent: FileContent, mapElements: string[]) {
    const map = {
      id: null,
      name: fileContent.fileName,
      content: fileContent.content,
      mapElements: mapElements
      // mapElements: this.voiceService.getMapElements().map(me => {
      //   return {
      //     name: me.name,
      //     layerName: me.layerName,
      //     description: me.description,
      //     element: me.element.outerHTML.toString()
      //   };
      // })
    };
    // console.log(map);
    return this.dataManager.addMap(map);
  }
  updateMap(id: number, newMap: Map) {
    const map = {
      id: null,
      name: newMap.name,
      content: newMap.content
      // mapElements: this.voiceService.getMapElements().map(me => ({
      //   name: me.name,
      //   layerName: me.layerName,
      //   description: me.description,
      //   element: me.element.outerHTML.toString()
      // }))
    };
    return this.dataManager.updateMap(newMap.id, map);
  }
  deleteMap(id: string, index: number) {
    // this.addMap.next(this.maps.splice(index, 1));
    return this.dataManager.deleteMap(id);
  }
  getMaps() {
    // return [...this.maps];
  }
  getMapsFromDb() {
    return this.dataManager.getMaps();
  }
  getMapsFromDbForUser(userId) {
    return this.dataManager.getMapsForUser(userId);
  }
  // getMap(index: number) {
  //   return { ...this.maps[index] };
  // }
  getMap(id: string) {
    // return this.maps.find(m => m.id === id);
    return this.dataManager.getMap(id);
  }

  exportMapToFile(map: string, fileName: string) {
    // console.log(fileName);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    const blob = new Blob([map], { type: "image/svg+xml" });
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  // getMaps() {
  //   return [...this.mapContents];
  // }
  // getMap(index: number) {
  //   return { ...this.mapContents[index] };
  // }
}
