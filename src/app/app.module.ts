import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MapLoaderComponent } from "./map-loader/map-loader.component";
import { AuthModule } from "./auth/auth.module";
import { HeaderComponent } from "./header/header.component";
import { MapLayerToolboxComponent } from "./map-layer-toolbox/map-layer-toolbox.component";
import { AssingMapElementComponent } from "./assing-map-element/assing-map-element.component";
import { FormsModule } from "@angular/forms";
import { LayerCreationComponent } from "./layer-creation/layer-creation.component";
import { LayerListComponent } from "./layer-list/layer-list.component";
import { LayerItemComponent } from "./layer-list/layer-item/layer-item.component";
import { LayerEditComponent } from "./layer-list/layer-edit/layer-edit.component";
import { MapListComponent } from "./map-list/map-list.component";
import { MapItemComponent } from "./map-list/map-item/map-item.component";
import { SharedModule } from "./shared/shared.module";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MapComponent } from "./map/map.component";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { PageNotFoundComponentComponent } from "./page-not-found-component/page-not-found-component.component";

@NgModule({
  declarations: [
    AppComponent,
    MapLoaderComponent,
    HeaderComponent,
    MapLayerToolboxComponent,
    AssingMapElementComponent,
    LayerCreationComponent,
    LayerListComponent,
    LayerItemComponent,
    LayerEditComponent,
    MapListComponent,
    MapItemComponent,
    MapComponent,
    PageNotFoundComponentComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
