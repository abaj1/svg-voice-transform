import { Injectable } from "@angular/core";
import { Layer } from "../models/layer.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Map } from "./map.service";
import { UsefullsService } from "./usefulls.service";

@Injectable({
  providedIn: "root",
})
export class DataManagerService {
  constructor(
    private http: HttpClient,
    private usefullService: UsefullsService
  ) {}
  private address: string = "http://localhost:3000/api";

  getMaps() {
    return this.http
      .get<{ message: string; maps: Map[] }>(`${this.address}/maps`)
      .pipe(
        map((response) => ({
          message: response.message,
          maps: response.maps.map((map) => {
            // map = this.removeMongoPropertiesFromObject(map);
            // console.log(this.usefullService.mapMaps(map));
            return (map = this.usefullService.mapMaps(map));
            // map.mapElements.map(me => ({...me,element:document.createElement(me.elemen)}))
          }),
        }))
      );
  }

  getMapsForUser(id: string) {
    return this.http
      .get<{ message: string; maps: Map[] }>(`${this.address}/maps/user/${id}`)
      .pipe(
        map((response) => ({
          message: response.message,
          maps: response.maps.map((map) => {
            // map = this.removeMongoPropertiesFromObject(map);
            // console.log(this.usefullService.mapMaps(map));
            return (map = this.usefullService.mapMaps(map));
            // map.mapElements.map(me => ({...me,element:document.createElement(me.elemen)}))
          }),
        }))
      );
  }

  getMap(id: string) {
    return this.http
      .get<{ message: string; map: Map }>(`${this.address}/maps/${id}`)
      .pipe(
        map((response) => ({
          message: response.message,
          map: this.usefullService.mapMaps(response.map),
          // map.mapElements.map(me => ({...me,element:document.createElement(me.elemen)}))
        }))
      );
  }
  getUserMaps() {
    //getUserIdFromLocalStorage
    const id = "qeqteyhn";
    return this.http
      .get<{ message: string; maps: Map[] }>(`${this.address}/maps/user/${id}`)
      .pipe(
        map((response) => ({
          message: response.message,
          maps: response.maps.map((map) => {
            // map = this.removeMongoPropertiesFromObject(map);
            console.log(this.usefullService.mapMaps(map));
            return (map = this.usefullService.mapMaps(map));
            // map.mapElements.map(me => ({...me,element:document.createElement(me.elemen)}))
          }),
        }))
      );
  }
  addMap(newMap: any) {
    // console.log(newMap);
    return this.http
      .post<{ message: string; map: Map }>(`${this.address}/maps`, {
        name: newMap.name,
        content: newMap.content,
        mapElements: newMap.mapElements,
      })
      .pipe(
        map((map) => ({
          message: map.message,
          map: this.usefullService.removeMongoPropertiesFromObject(map.map),
        }))
      );
  }
  updateMap(id: string, newMap: any) {
    return this.http
      .put<{ message: string; map: any }>(`${this.address}/maps/${id}`, {
        name: newMap.name,
        content: newMap.content,
        mapElements: newMap.mapElements,
      })
      .pipe(
        map((map) => ({
          message: map.message,
          map: this.usefullService.removeMongoPropertiesFromObject(map.map),
        }))
      );
  }

  deleteMap(id: string) {
    return this.http
      .delete<{ message: string; map: any }>(`${this.address}/maps/${id}`)
      .pipe(
        map((map) => ({
          message: map.message,
          map: this.usefullService.removeMongoPropertiesFromObject(map.map),
        }))
      );
  }
  //------------LAYERS--------------------------
  getLayers() {
    return this.http
      .get<{ message: string; layers: Layer[] }>(`${this.address}/layers`)
      .pipe(
        map((response) => ({
          message: response.message,
          layers: response.layers.map((layer) =>
            this.usefullService.removeMongoPropertiesFromObject(layer)
          ),
        }))
      );
  }
  getLayer(id: string) {
    return this.http
      .get<{ message: string; layer: Layer }>(`${this.address}/layers/${id}`)
      .pipe(
        map((response) => ({
          message: response.message,
          layer: this.usefullService.removeMongoPropertiesFromObject(
            response.layer
          ),
        }))
      );
  }
  getActiveLayers() {
    return this.http
      .get<{ message: string; layers: Layer[] }>(
        `${this.address}/layers/active`
      )
      .pipe(
        map((response) => ({
          message: response.message,
          layers: response.layers.map((layer) =>
            this.usefullService.removeMongoPropertiesFromObject(layer)
          ),
        }))
      );
  }
  addLayer(layer: Layer, file: File) {
    const layerData = this.usefullService.returnLayerFormData(layer, file);
    return this.http
      .post<{ message: string; layer: Layer }>(
        `${this.address}/layers`,
        // {
        //   name: layer.name,
        //   isActive: layer.isActive,
        //   status: layer.status,
        //   voiceFile: file,
        // }
        layerData
        // HttpUploadOptions
      )
      .pipe(
        map((layer) => ({
          message: layer.message,
          layer: this.usefullService.removeMongoPropertiesFromObject(
            layer.layer
          ),
        }))
      );
  }
  updateLayer(id: string, newLayer: any, file: File) {
    // let layerData;
    // // if (file)
    // //   layerData = this.usefullService.returnLayerFormData(newLayer, file);
    // // else
    // layerData = {
    //   name: newLayer.name,
    //   status: newLayer.status,
    //   isActive: newLayer.isActive,
    //   fileName: newLayer.name,
    // };
    const layerData = this.usefullService.returnLayerFormData(newLayer, file);
    return this.http
      .post<{ message: string; layer: any }>(
        `${this.address}/layers/${id}`,
        // {
        //   name: newLayer.name,
        //   status: newLayer.status,
        //   isActive: newLayer.isActive,
        //   fileName: newLayer.name
        // }
        layerData
      )
      .pipe(
        map((layer) => ({
          message: layer.message,
          layer: this.usefullService.removeMongoPropertiesFromObject(
            layer.layer
          ),
        }))
      );
  }

  deleteLayer(id: string) {
    return this.http
      .delete<{ message: string; layer: any }>(`${this.address}/layers/${id}`)
      .pipe(
        map((layer) => ({
          message: layer.message,
          layer: this.usefullService.removeMongoPropertiesFromObject(
            layer.layer
          ),
        }))
      );
  }
}
