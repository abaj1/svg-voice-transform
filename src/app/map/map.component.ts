import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MapService, FileContent, Map } from "../services/map.service";
import { LayerService } from "../services/layer.service";
import { VoiceService } from "../services/voice.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { MapElement } from "../models/map-element.model";
import { Layer } from "../models/layer.model";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.css"],
})
export class MapComponent implements OnInit {
  constructor(
    private renderer: Renderer2,
    private mapService: MapService,
    private layerService: LayerService,
    private voiceService: VoiceService,
    private route: ActivatedRoute
  ) {}

  @ViewChild("svgMap", { static: true }) svgMap: ElementRef;
  errorMsg: string = null;
  fileContent: FileContent = null;
  element: HTMLElement;
  selectMode = false;
  changeMode: boolean = true;
  teacherMode: boolean = true;
  subscription: Subscription;
  // id: number = null;
  id: string = null;
  currentMap: Map = null;
  mapLoaded: boolean = false;
  isUserHasAdmin: boolean = false;
  playedElement: HTMLElement;

  ngOnInit(): void {
    //wczytanie i aktualizacja danych w mapie
    const user: {
      email: string;
      id: string;
      _tokenExpirationDate: string;
      isAdmin: boolean;
    } = JSON.parse(localStorage.getItem("svgUser"));
    if (user) {
      this.isUserHasAdmin = user.isAdmin;
      if (!this.isUserHasAdmin) {
        this.teacherMode = false;
        this.changeMode = false;
      }
    }

    //przypisywanie elementów do warstw
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = params["id"];
      this.mapService.getMap(this.id).subscribe(
        (response) => {
          this.currentMap = response.map;
          // if (this.currentMap && Object.keys(this.currentMap).length) {
          this.mapLoaded = true;
          this.voiceService.say(`Mapa została załadowana`);
          // this.map.mapElements.map(me => ({layerName:me.layerName, name:me.name, description:me.description,element:me.element.}))
          // this.voiceService.addElements(this.map.mapElements);
          // this.layerService.getAllLayers();
          this.updateMapContent(this.currentMap.content);
          // } else {
          // }
        },
        (error) => {
          if (error || error.error) this.errorMsg = error.error.message;
        }
      );
    });

    this.subscription.add(
      this.layerService.elementDetails.subscribe(
        (mapElementDetails: MapElement) => {
          const temp = this.voiceService.getElementIndex(
            mapElementDetails.element
          );
          if (mapElementDetails.layerName != null) {
            this.fireLayerListener(mapElementDetails);
            if (!mapElementDetails.element.getAttribute("clicked")) {
              this.renderer.setAttribute(
                mapElementDetails.element,
                "clicked",
                "true"
              );
            }

            this.renderer.setAttribute(
              mapElementDetails.element,
              "_name",
              mapElementDetails.name
            );
            this.renderer.setAttribute(
              mapElementDetails.element,
              "_description",
              mapElementDetails.description
            );

            mapElementDetails.element.addEventListener("mouseover", () => {
              console.log("dupa");
            });
            // this.updateMapContent(this.svgMap.nativeElement.innerHTML);

            //testowanie zdarzeń dla studenta i teachera
            // this.changeMode = !this.changeMode;
            temp > -1
              ? this.voiceService.updateElement(temp, mapElementDetails)
              : this.voiceService.addElement(mapElementDetails);
          } else {
            this.renderer.removeAttribute(mapElementDetails.element, "clicked");
            this.renderer.removeAttribute(mapElementDetails.element, "_name");
            this.renderer.removeAttribute(
              mapElementDetails.element,
              "_description"
            );
            this.removeElementFromLayer(mapElementDetails.element);
            this.voiceService.deleteElement(temp);
          }
          this.updateMapContent(this.svgMap.nativeElement.innerHTML);
        }
      )
    );

    this.subscription.add(
      this.layerService.toggleLayerSubject.subscribe((layer) => {
        this.toggleLayerGroup(layer);
        this.updateMapContent(this.svgMap.nativeElement.innerHTML);
      })
    );

    this.subscription.add(
      this.voiceService.playedVoiceSubject.subscribe(element => {
        this.playedElement = element;
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  checkifStopPlayMusic(element:HTMLElement, studentMode: boolean){
    if(studentMode && this.playedElement ){
      if(!element.isEqualNode(this.playedElement))
        this.stopVoice(this.playedElement);
      else
        this.playVoice(element,!studentMode);
    }
  }

  private updateMapContent(content: string) {
    this.renderer.setProperty(this.svgMap.nativeElement, "innerHTML", content);
    this.layerService.getLayers().subscribe((layersData) => {
      layersData.layers.forEach((l) => {
        if (!l.isActive) {
          const group = this.svgMap.nativeElement.querySelector(
            `.layer_${l.name}`
          );
          if (group) this.renderer.setAttribute(group, "display", "none");
        }
      });
      this.layerService.layersSubject.next([...layersData.layers]);
    });
  }

  public getMap(id: string) {}

  public showElementForm(element: HTMLElement, teacherMode: boolean) {
    if (teacherMode && element.nodeName !== "svg" && !element.classList.contains("svg")) {
      this.element = element;
    } else {
      this.voiceService.checkGroupOnElement(element, !teacherMode);
    }
  }

  public playDescription(e:Event, element: HTMLElement){
    e.preventDefault();
    this.voiceService.playDescription(element);
  }

  public hideElementForm() {
    this.element = null;
  }
  public playVoice(element: HTMLElement, teacherMode: boolean) {
    this.voiceService.checkGroupOnElement(element, teacherMode);
    // this.fillColor = element.getAttribute("fill");
    // this.renderer.setAttribute(element, "fill", "red");
  }

  public changeViewMode(){
    this.changeMode = !this.changeMode;
    this.voiceService.say(`Zostałeś przełączony w tryb ${this.changeMode ? "nauczyciela" : "studenta"}`);
  }

  public stopVoice(element: HTMLElement) {
    this.voiceService.stopMusic(element);
  }

  public fireLayerListener(mapElement: MapElement) {
    const svg = this.svgMap.nativeElement.children[0];
    this.assignElementToLayer(mapElement.element, mapElement.layerName, svg);
  }

  private assignElementToLayer(element: Element, layerName: string, svg: any) {
    const group = svg.querySelector(`.layer_${layerName}`);
    // const circle = this.renderer.createElement("circle");
    // this.renderer.setAttribute(
    //   circle,
    //   "cx",
    //   this.elementCords.mouseX.toString()
    // );
    // this.renderer.setAttribute(
    //   circle,
    //   "cy",
    //   this.elementCords.mouseY.toString()
    // );
    // this.renderer.setAttribute(circle, "r", "12");
    // this.renderer.setAttribute(circle, "fill", "red");
    // this.renderer.appendChild(element, circle);
    if (group) {
      this.renderer.appendChild(group, element);
      // this.renderer.removeChild(
      //   this.svgMap.nativeElement,
      //   this.svgMap.nativeElement.children[0]
      // );
      // this.renderer.appendChild(this.svgMap.nativeElement, svg);
    } else {
      const group = this.renderer.createElement("g");
      this.renderer.setAttribute(group, "class", `layer_${layerName}`);
      const parent = this.renderer.parentNode(element);
      if (parent.isEqualNode(svg)) this.renderer.appendChild(svg, group);
      else if (
        parent.nodeName === "g" &&
        parent.className.baseVal.includes("layer_")
      )
        this.renderer.appendChild(this.renderer.parentNode(parent), group);
      else this.renderer.appendChild(this.renderer.parentNode(element), group);
      this.renderer.appendChild(group, element);
      // this.renderer.setAttribute(element, "stroke", "red");
    }

    return;
  }

  public toggleLayerGroup(layer: Layer) {
    const group = this.svgMap.nativeElement.querySelector(
      `.layer_${layer.name}`
    );
    if (group) {
      this.renderer.setAttribute(
        group,
        "display",
        layer.isActive ? "block" : "none"
      );
    }
    return;
  }

  public lightModeOn(element: HTMLElement) {
    const attr = element.attributes.getNamedItem("stroke-width");
    if (attr) {
      let stroke = parseFloat(attr.nodeValue + 3);
      this.renderer.setAttribute(element, "stroke-width", stroke.toString());
      this.renderer.setAttribute(
        element,
        "stroke_cpy",
        element.attributes.getNamedItem("stroke").nodeValue
      );
      this.renderer.setAttribute(element, "stroke", "red");
    } else {
      this.renderer.setAttribute(
        element,
        "fill_cpy",
        element.attributes.getNamedItem("fill").nodeValue
      );
      this.renderer.setAttribute(element, "fill", "red");
    }
    this.updateMapContent(this.svgMap.nativeElement.innerHTML);
  }
  public lightModeOff(element: HTMLElement) {
    const attr = element.attributes.getNamedItem("stroke-width");
    if (attr) {
      let stroke = parseFloat((+attr.nodeValue - 3).toString());
      console.log(stroke);
      this.renderer.setAttribute(element, "stroke-width", stroke.toString());
      this.renderer.setAttribute(
        element,
        "stroke",
        element.attributes.getNamedItem("stroke_cpy").nodeValue
      );
    } else {
      this.renderer.setAttribute(
        element,
        "fill",
        element.attributes.getNamedItem("fill_cpy").nodeValue
      );
    }
    this.updateMapContent(this.svgMap.nativeElement.innerHTML);
  }

  private makeSvgResponsive() {
    const svg = this.svgMap.nativeElement.children[0];
    if (svg.getAttribute("width") && svg.getAttribute("height")) {
      // this.renderer.removeAttribute(svg, "width");
      this.renderer.removeAttribute(svg, "height");
      // this.renderer.removeAttribute(svg, "viewPort");
      // this.renderer.removeAttribute(svg, "viewBox");
      // const width = screen.width.toString();
      // const height = screen.height.toString();
      // this.renderer.setAttribute(svg, "width", width);
      this.renderer.setAttribute(svg, "height", "auto");
      // this.renderer.setAttribute(svg, "viewBox", `0 0 ${width} ${height}`);
      // this.renderer.setAttribute(svg, "viewPort", "0 0 100 100");
    }
  }
  private setOverflowToSvg() {
    this.renderer.setAttribute(
      this.svgMap.nativeElement.children[0],
      "overflow",
      "hidden"
    );
  }
  saveMap() {
    this.currentMap.content = this.svgMap.nativeElement.innerHTML;
    // const index = this.maps.findIndex(m => m.id === this.currentMap.id);
    console.log(this.currentMap);
    this.mapService.updateMap(null, this.currentMap).subscribe(
      (mapResponse) => {
        console.log(mapResponse);
        this.errorMsg = mapResponse.message;
      },
      (error) => {
        if (error || error.error) this.errorMsg = error.error.message;
      }
    );
  }

  private uploadMap(content: string) {
    this.updateMapContent(content);
    this.setOverflowToSvg();
    this.makeSvgResponsive();
  }

  private removeElementFromLayer(element: Element) {
    const group = this.renderer.parentNode(element);
    const parent = this.renderer.parentNode(group);
    this.renderer.appendChild(parent, element);
  }

  public onClose() {
    this.errorMsg = null;
  }
  public exportMap(map: string, fileName: string) {
    this.voiceService.say("Eksportujesz mapę");
    this.mapService.exportMapToFile(map, fileName);
  }
}
