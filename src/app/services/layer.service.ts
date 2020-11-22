import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Layer } from "../models/layer.model";
import { MapElement } from "../models/map-element.model";
import { VoiceService } from "./voice.service";
import { DataManagerService } from "./data-manager.service";

@Injectable({
  providedIn: "root"
})
export class LayerService {
  constructor(
    private voiceService: VoiceService,
    private dataManager: DataManagerService
  ) {
    // this.dataManager.getLayers().subscribe(response => {
    //   this.layers = response.layers;
    // });
  }
  mapIsLoaded: Subject<Layer> = new Subject<Layer>();
  toggleLayerSubject: Subject<Layer> = new Subject<Layer>();
  layersSubject: Subject<Layer[]> = new Subject<Layer[]>();
  elementDetails: Subject<MapElement> = new Subject<MapElement>();
  editLayer = new Subject<boolean>();
  delLayer = new Subject<number>();
  layerEdited: Subject<{
    index: number;
    layer: Layer;
    message: string;
  }> = new Subject<{
    index: number;
    layer: Layer;
    message: string;
  }>();
  changeLayerName: Subject<{
    newLayerName: string;
    oldLayerName: string;
  }> = new Subject<{
    newLayerName: string;
    oldLayerName: string;
  }>(); //fire when layerName in edit mode was changed. (db->maps->changeName in content)
  // layers: Layer[] = [];
  // activelayers: Layer[] = [];
  getLayers() {
    return this.dataManager.getLayers();
  }
  getActiveLayers(): Observable<{ message: string; layers: Layer[] }> {
    return this.dataManager.getActiveLayers();
    // .subscribe(response => {
    //   this.activelayers = response.layers;
    //   return response.layers;
    // });
    // return this.layers.filter(layer => layer.status);
  }

  getLayer(id: string) {
    return this.dataManager.getLayer(id);
  }
  // getLayerIndexByName(name: string) {
  //   return this.layers.findIndex(l => l.name === name);
  // }
  // getLayerByName(name: string): Layer {
  //   return this.layers.find(l => l.name === name);
  // }

  addLayer(layer: Layer, file: File) {
    return this.dataManager.addLayer(layer, file);
  }
  updateLayer(newLayer: Layer, file: File) {
    return this.dataManager.updateLayer(newLayer.id, newLayer, file);
  }

  deleteLayer(id: string) {
    return this.dataManager.deleteLayer(id);
  }

  toggleLayer(index: number): void {
    // let temp: Layer;
    // this.layers.forEach((layer, i) => {
    //   if (i === index) {
    //     layer.isActive = !layer.isActive;
    //     temp = layer;
    //     layer.isActive
    //           ? this.voiceService.say(
    //               `Warstwa ${layer.name} została włączona`
    //             )
    //           : this.voiceService.say(
    //               `Warstwa ${layer.name} została wyłączona`
    //             );
    //         this.toggleLayerSubject.next({
    //           ...this.layers[index]
    //         });
    //         this.layersSubject.next(this.layers.filter(l => l.status));
    //       });
    //     // this.dataManager
    //     //   .updateLayer(temp.id, temp, null)
    //     //   .subscribe(response => {
    //     //     !response.layer.isActive
    //     //       ? this.voiceService.say(
    //     //           `Warstwa ${response.layer.name} została włączona`
    //     //         )
    //     //       : this.voiceService.say(
    //     //           `Warstwa ${response.layer.name} została wyłączona`
    //     //         );
    //     //     this.toggleLayerSubject.next({
    //     //       ...this.layers[index]
    //     //     });
    //     //     this.layersSubject.next(this.layers.filter(l => l.status));
    //     //   });
    //   }
    // });
    // const layer = this.getAllLayers()[index];
  }
}
