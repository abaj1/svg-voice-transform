import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { Layer } from "../../models/layer.model";
import { LayerService } from "../../services/layer.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";

@Component({
  selector: "app-layer-item",
  templateUrl: "./layer-item.component.html",
  styleUrls: ["./layer-item.component.css"]
})
export class LayerItemComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  @Input() layer: Layer;
  @Input() index: number;
  @Output() edit = new EventEmitter<void>();
  @Output() deleteLayer = new EventEmitter<{
    index: number;
    message: string;
  }>();
  subscription: Subscription;
  constructor(private layerService: LayerService, private router: Router) {}

  ngOnInit() {}
  onEditLayer() {
    this.edit.emit();
    this.router.navigate([
      "/layers/edit",
      // this.layerService.getLayerIndexByName(this.layer.name)
      // this.index
      this.layer.id,
      this.index
    ]);
  }
  onDeleteLayer() {
    // this.layers.splice(index, 1);
    this.subscription = this.layerService
      .deleteLayer(this.layer.id)
      .subscribe(response => {
        this.deleteLayer.emit({ index: this.index, message: response.message });
      });
  }
}
