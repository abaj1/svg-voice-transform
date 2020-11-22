import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  OnDestroy,
  ElementRef
} from "@angular/core";
import { Layer } from "../models/layer.model";
import { NgForm } from "@angular/forms";
import { MapElement } from "../models/map-element.model";
import { LayerService } from "../services/layer.service";
import { Subscription } from "rxjs";
import { VoiceService } from '../services/voice.service';

@Component({
  selector: "app-assing-map-element",
  templateUrl: "./assing-map-element.component.html",
  styleUrls: ["./assing-map-element.component.css"]
})
export class AssingMapElementComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Input("element") element: HTMLElement;
  @ViewChild("f", { static: false }) elementForm: NgForm;
  @ViewChild("select", { static: true }) select: ElementRef;
  layers: Layer[] = [];
  selectedLayerName: string;
  name: string;
  desc: string;
  error: string;
  subscription: Subscription;

  constructor(private layerService: LayerService, private voiceService: VoiceService) {}
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  ngOnInit() {
    this.subscription = this.layerService.getActiveLayers().subscribe(
      response => {
        this.layers = response.layers;
      },
      error => {
        if (error && error.error) this.error = error.error.message;
      }
    );
    // this.div.nativeElement.focus();
    // console.log(this.div.nativeElement);
    this.select.nativeElement.focus();
    this.voiceService.say("Formularz został otwarty");
    if (this.element.getAttribute("clicked")) {
      // const mapElement: MapElement = this.voiceService.getMapElement(
      //   this.element
      // );
      const mapElement = {
        layerName: this.element.parentElement.getAttribute("class").substr(6),
        name: this.element.getAttribute("_name"),
        description: this.element.getAttribute("_description"),
        element: this.element
      };

      if (mapElement) {
        // this.selectedLayerName = this.layerService.getLayerByName(
        //   mapElement.layerName
        // ).name;
        this.selectedLayerName = mapElement.layerName;
        this.name = mapElement.name;
        this.desc = mapElement.description;
      }
    }else{
      this.selectedLayerName = "-1";
    }
  }

  onSave() {
    if (this.elementForm.valid) {
      const formValue = this.elementForm.value;
      const isItLayer = formValue.layer == -1;
      const mapElement: MapElement = {
        layerName: formValue.layer,
        name: formValue.name,
        description: formValue.desc,
        element: this.element
      };
      this.layerService.elementDetails.next(
        !isItLayer
          ? mapElement
          : {
              layerName: null,
              name: null,
              description: null,
              element: this.element
            }
      );
      this.onClose();
    } else {
      // this.onClose();
      this.error = "Form is not valid!";
    }
  }
  onClose() {
    this.close.emit();
    this.voiceService.say("Formularz został zamknięty");
  }
  onHandleError() {
    this.error = null;
  }
}
