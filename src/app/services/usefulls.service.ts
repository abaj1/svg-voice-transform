import { Injectable } from "@angular/core";
import { Map } from "./map.service";
import { Layer } from "../models/layer.model";

@Injectable({
  providedIn: "root",
})
export class UsefullsService {
  constructor() {}
  // private getFileChildren(content: string): string[] {
  //   if (typeof content === "string")
  //     return content.match(/<(rect|path|ellipse|circle|polygon).+?><\/\1>/gim);
  // }

  public removeMongoPropertiesFromObject(obj: any) {
    let _id, __v;
    ({ _id, __v, ...obj } = obj);
    obj.id = _id;
    // console.log(obj);
    return obj;
  }

  public mapMaps(map: Map) {
    map = this.removeMongoPropertiesFromObject(map);
    // map.mapElements = map.mapElements.map(me => {
    //   const e = document.implementation.createHTMLDocument();
    //   e.body.innerHTML = String(me.element);
    //   return {
    //     ...me,
    //     element: e.body.children[0]
    //   };
    // });
    return map;
  }

  // public getChildElementName(element: any): string {
  //   if (typeof element === "string")
  //     return element.match(/^(<\w+)/)[0].substr(1);
  // }
  // private getChildElementAttributePairs(element: string) {
  //   if (typeof element === "string")
  //     return element.match(/([\w-_]+)="([\w#_-][^<>\s]+)"/g);
  // }

  // private getTagAttributes(element: string): ChildAttributes[] {
  //   return this.getChildElementAttributePairs(element).map(e => {
  //     const [attrName, attrValue] = e.split("=");
  //     return {
  //       attrName: attrName,
  //       attrValue: attrValue.substr(1, attrValue.length - 2)
  //     };
  //   });
  // }

  public substringElement(elem: string, name: string) {
    const size = name.length;
    const howMuch = elem.length - (name.length + 2 + name.length + 3);
    return elem.substr(size + 2, howMuch);
  }

  public getFile(file: HTMLInputElement) {
    if (file.files[0]) {
      const newFile = file.files[0];
      const reader = new FileReader();
      reader.onload = ({ target }: any) => {
        const { result } = target;
        const blob = new Blob([result], { type: "audio/mpeg" });
        window.URL.createObjectURL(blob);
        console.log(blob);
      };
      reader.readAsText(newFile);
    } else {
      return null;
    }
  }
  public returnLayerFormData(layer: Layer, file: File) {
    const layerData = new FormData();
    layerData.append("name", layer.name);
    layerData.append("isActive", String(layer.isActive));
    layerData.append("status", String(layer.status));
    // layerData.append("fileName", String(layer.fileName));
    layerData.append("fileName", String(layer.name));
    layerData.append("voice", file, file.name);
    return layerData;
  }
}
