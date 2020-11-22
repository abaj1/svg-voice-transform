import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Layer } from "../models/layer.model";
import { LayerService } from "../services/layer.service";
import { Subscription } from "rxjs";
import { VoiceService } from "../services/voice.service";
// import { DataManagerService } from "../services/data-manager.service";

@Component({
  selector: "app-map-layer-toolbox",
  templateUrl: "./map-layer-toolbox.component.html",
  styleUrls: ["./map-layer-toolbox.component.css"]
})
export class MapLayerToolboxComponent implements OnInit, OnDestroy {
  constructor(
    private layerService: LayerService,
    private voiceService: VoiceService
  ) {}
  layerGroups: Layer[] = [];
  subscription: Subscription;
  @Input() mapLoaded: boolean;

  toggleLayer(index: number) {
    // const index = this.layerService.getLayerIndexByName(name);
    //this.layerService.toggleLayer(index);
    let temp: Layer = this.layerGroups[index];
    temp.isActive = !temp.isActive;
    temp.isActive
      ? this.voiceService.say(`Warstwa ${temp.name} została włączona`)
      : this.voiceService.say(`Warstwa ${temp.name} została wyłączona`);
    this.layerService.toggleLayerSubject.next({
      ...this.layerGroups[index]
    });
    // this.layerService.layersSubject.next(this.layers.filter(l => l.status));
  }

  ngOnInit() {
    // this.subscription = this.layerService.layersSubject.subscribe(layers => {
    //   console.log(layers);
    //   this.layerGroups = layers;
    // });

    this.layerService.getActiveLayers().subscribe(response => {
      // console.log(response);
      this.layerGroups = response.layers;
    });
  }
  ngOnDestroy(): void {
    // if (this.subscription) this.subscription.unsubscribe();
  }
}
