import { NgModule } from "@angular/core";
import { AuthComponent } from "./auth.component";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AuthComponent],
  imports: [FormsModule, SharedModule, HttpClientModule],
  exports: [AuthComponent]
})
export class AuthModule {}
