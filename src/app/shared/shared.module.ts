import { NgModule } from "@angular/core";
import { SpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { AlertComponent } from "./alert/alert.component";
import { CommonModule } from "@angular/common";

@NgModule({
  declarations: [SpinnerComponent, AlertComponent],
  imports: [CommonModule],
  exports: [SpinnerComponent, AlertComponent, CommonModule]
})
export class SharedModule {}
