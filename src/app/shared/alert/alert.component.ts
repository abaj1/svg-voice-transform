import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from "@angular/core";
import { VoiceService } from 'src/app/services/voice.service';

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"]
})
export class AlertComponent {
  @Input() message: string;
  @Output() close = new EventEmitter<void>();
  @ViewChild("button", {static: true}) button: ElementRef;

  
  constructor(private voiceService: VoiceService ){}

  ngOnInit(): void {
    this.button.nativeElement.focus();
    this.voiceService.say(this.message);
  }

  onClose() {
    this.close.emit();
  }
}
