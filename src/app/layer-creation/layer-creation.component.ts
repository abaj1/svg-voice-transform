import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy
} from "@angular/core";
import { Layer } from "../models/layer.model";
import { NgForm } from "@angular/forms";
import { LayerService } from "../services/layer.service";
import { UsefullsService } from "../services/usefulls.service";
import { Subscription } from "rxjs";
import { VoiceService } from '../services/voice.service';

@Component({
  selector: "app-layer-creation",
  templateUrl: "./layer-creation.component.html",
  styleUrls: ["./layer-creation.component.css"]
})
export class LayerCreationComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
  @Output() close = new EventEmitter<void>();
  @Output() layerAdded = new EventEmitter<{
    layer: Layer;
    message: string;
  }>();
  @Input("layer") layer: Layer;
  @ViewChild("lForm", { static: false }) lForm: NgForm;
  @ViewChild("voice", { static: false }) voice: ElementRef;
  @ViewChild("name", { static: true }) name: ElementRef;
  subscription: Subscription;
  pageError: String = "";

  constructor(private layerService: LayerService, private voiceService: VoiceService) {}

  ngOnInit() {
    this.name.nativeElement.focus();
    this.voiceService.say("Formularz dodania warstwy został otwarty");
  }

  onSave(form: NgForm) {
    const fValue = form.value;
    let status: boolean = false;
    if (fValue.status) status = true;
    // const voicePath = String(fValue.voice);
    // const fileName = voicePath.substring(
    //   voicePath.lastIndexOf("\\") + 1,
    //   voicePath.lastIndexOf(".")
    // );
    const layer: Layer = {
      id: null,
      name: fValue.name,
      isActive: true,
      status: status,
      fileName: fValue.name
    };
    // this.usefull.getFile(this.voice.nativeElement);
    const file = this.voice.nativeElement.files[0];
    this.subscription = this.layerService.addLayer(layer, file).subscribe(
      layerResponse => {
        console.log(layerResponse);
        this.layerAdded.emit({
          layer: layerResponse.layer,
          message: layerResponse.message
        });
        this.onClose();
      },
      error => {
        if (error && error.error) this.pageError = error.error.message;
        console.log(error);
        this.onClose();
      }
    );
  }
  onClose() {
    this.pageError = null;
    this.voiceService.say("Formularz dodania warstwy został zamknięty");
    this.close.emit();
  }
}
