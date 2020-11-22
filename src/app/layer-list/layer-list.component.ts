import { Component, OnInit, OnDestroy } from "@angular/core";
import { Layer } from "../models/layer.model";
import { LayerService } from "../services/layer.service";
import { Subscription } from "rxjs";
import { MapService, Map } from '../services/map.service';

@Component({
  selector: "app-layer-list",
  templateUrl: "./layer-list.component.html",
  styleUrls: ["./layer-list.component.css"]
})
export class LayerListComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  constructor(private layerService: LayerService, private mapService: MapService) {}
  layers: Layer[] = [];
  maps: Map[] = [];
  editMode: boolean = false;
  createMode: boolean = false;
  layer: Layer;
  showForm: boolean = false;
  selectedIndex: number = -1;
  subscription: Subscription;
  isLoading: boolean = true;
  pageError: string;

  ngOnInit() {
    // this.layers = this.layerService.getAllLayers();
    this.subscription = this.layerService.getLayers().subscribe(
      response => {
        this.layers = response.layers;
        this.isLoading = false;
      },
      error => {
        if (error || error.error) 
          this.pageError = error.error.message;
        
        this.isLoading = false;
      }
    );
    this.subscription.add(
      this.layerService.layersSubject.subscribe(
        layers => {
          console.log(layers);
          this.layers = layers;
        },
        error => {
          if (error || error.error) this.pageError = error.error.message;
        }
      )
    );

    this.subscription = this.layerService.editLayer.subscribe(edit => {
      this.editMode = edit;
    });

    this.subscription.add(
      this.layerService.layerEdited.subscribe(resp => {
        this.layers[resp.index] = resp.layer;
      })
    );
    // this.layersSubscription.add(
    //   this.mapIconService.delLayer.subscribe(index => {
    //     this.layers.splice(index, 1);
    //   })
    // );

    this.layerService.changeLayerName.subscribe(
      layer => {
        this.subscription = this.mapService.getMapsFromDb().subscribe(response => {
          this.maps = response.maps;
          this.maps.forEach((map, index) => {
            let newContent: string = map.content;
            newContent = newContent.replace(
              `class="layer_${layer.oldLayerName}"`,
              `class="layer_${layer.newLayerName}"`
            );
            map.content = newContent;
            this.mapService.updateMap(index, map).subscribe(
              response => {
                console.log(`Map ${response.map.name} was updated!`);
              },
              error => {
                if (error || error.error) this.pageError = error.error.message;
              }
            );
          });
        },(error) => {
          console.log(error);
        });
      },
      error => console.log(error),
      () => console.log("change layer name completed")
    );
  }

  selectLayer(index: number) {
    this.selectedIndex = index;
    this.editMode = true;
  }
  setEditMode() {
    this.editMode = true;
  }
  onNewLayerAdded() {
    this.showForm = true;
  }

  onLayerAdded(event: { layer: Layer; message: string }) {
    console.log(event.layer);
    this.layers.push(event.layer);
    this.layerService.layersSubject.next([...this.layers]);
  }

  onLayerEdited(event: { index: number; layer: Layer; message: string }) {
    console.log(event);
    this.layers[event.index] = event.layer;
  }
  onLayerDeleted(event: { index: number; message: string }) {
    this.layers.splice(event.index, 1);
    const activeLayers = this.layers.filter(l => l.status);
    this.layerService.layersSubject.next([...activeLayers]);
  }

  onClose() {
    this.pageError = null;
  }

  closeForm() {
    this.showForm = false;
    // this.editMode = !this.editMode;
  }
}
