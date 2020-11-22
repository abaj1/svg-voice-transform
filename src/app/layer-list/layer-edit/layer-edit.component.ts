import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnDestroy
} from "@angular/core";

import { NgForm } from "@angular/forms";
import { Layer } from "../../models/layer.model";
import { LayerService } from "../../services/layer.service";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Subscription } from "rxjs";
import { VoiceService } from 'src/app/services/voice.service';

@Component({
  selector: "app-layer-edit",
  templateUrl: "./layer-edit.component.html",
  styleUrls: ["./layer-edit.component.css"]
})
export class LayerEditComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  // id: number;
  id: string;
  objectId: string;
  // layer: Layer;
  name: string;
  status: boolean;
  pageError: String;
  subscription: Subscription;
  @Input() index: number;
  @Input() layer: Layer;
  @ViewChild("lForm", { static: false }) lForm: NgForm;
  @ViewChild("voice", { static: false }) voice: ElementRef;
  @ViewChild("inputName", { static: true }) inputName: ElementRef;

  constructor(
    private layerService: LayerService,
    private router: Router,
    private route: ActivatedRoute,
    private voiceService: VoiceService
  ) {}

  ngOnInit() {
    this.inputName.nativeElement.focus();
    this.voiceService.say("Formularz edycji został otwarty");
    this.route.params.subscribe(
      (params: Params) => {
        // this.id = +params["id"];
        this.id = params["id"];
        this.index = params["index"];
        this.layerService.getLayer(this.id).subscribe(
          response => {
            this.layer = response.layer;
            if (this.layer) {
              this.objectId = this.layer.id;
              this.name = this.layer.name;
              this.status = this.layer.status;
            }
          },
          error => {
            if (error && error.error) this.pageError = error.error.message;
          }
        );
      },
      error => {
        if (error && error.error) this.pageError = error.error.message;
      }
    );
    // this.objectId = this.layer.id;
    // this.name = this.layer.name;
    // this.status = this.layer.status;
  }

  onEdit(f: NgForm) {
    const newLayer: Layer = {
      name: String(f.value.name),
      status: Boolean(f.value.status),
      fileName: String(f.value.name),
      id: this.objectId,
      isActive: this.layer.isActive
    };
    const file = this.voice.nativeElement.files[0];
    // this.layerService.updateLayer(this.id, newLayer);

    this.layerService.updateLayer(newLayer, file).subscribe(
      response => {
        console.log(response);
        //update warstwy na bazie
        let oldLayerName = this.layer.name;
        this.layer = { ...newLayer, isActive: true };
        //update nazwy i parametrów warstwy na froncie w komponencie layer-list
        this.layerService.layerEdited.next({
          index: this.index,
          layer: this.layer,
          message: response.message
        });
        //update nazwy warstwy wszystkich map które są na bazce
        this.layerService.changeLayerName.next({
          newLayerName: newLayer.name,
          oldLayerName: oldLayerName
        });
      },
      error => {
        console.log(error);
        if (error && error.error) this.pageError = error.error.message;
      },
      () => {
        console.log("update layer subscribe completed");
      }
    );
    //NIE DZIAŁA WYSŁANIE OBSERVABLE
    //todo: change layerName on each map for this user

    this.exitForm();
  }
  onCancel() {
    this.voiceService.say("Formularz edycji został zamknięty");
    this.exitForm();
  }
  private exitForm() {
    this.layerService.editLayer.next(false);
    this.router.navigate(["layers"]);
  }
  onClose() {
    this.pageError = null;
  }
}
