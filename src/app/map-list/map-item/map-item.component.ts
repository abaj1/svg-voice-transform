import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from "@angular/core";
import { MapService, Map } from "src/app/services/map.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-map-item",
  templateUrl: "./map-item.component.html",
  styleUrls: ["./map-item.component.css"]
})
export class MapItemComponent implements OnInit {
  // @Input() map: FileContent;
  @Input() map: Map;
  @Input() index: number;
  @Output() mapSelected = new EventEmitter<void>();
  @Output() mapDeleted = new EventEmitter<{ index: number; message: string }>();
  @ViewChild("thumb", { static: false }) thumb: ElementRef;

  constructor(private mapService: MapService, private router: Router) {}

  ngOnInit() {}
  selectMap() {
    this.mapSelected.emit();
    this.router.navigate(["upload-map"]);
    this.mapService.mapChoosen.next(this.map);
  }
  deleteMap() {
    this.mapService
      .deleteMap(this.map.id, this.index)
      .subscribe(mapResponse => {
        this.mapDeleted.emit({
          index: this.index,
          message: mapResponse.message
        });
      });
  }
}
