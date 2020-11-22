import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { MapListComponent } from "./map-list/map-list.component";
import { LayerListComponent } from "./layer-list/layer-list.component";
import { LayerEditComponent } from "./layer-list/layer-edit/layer-edit.component";
import { MapLoaderComponent } from "./map-loader/map-loader.component";
import { MapComponent } from "./map/map.component";
import { AuthGuard } from "./auth/auth.guard";
import { PageNotFoundComponentComponent } from "./page-not-found-component/page-not-found-component.component";
// import { MapWorkerComponent } from "./map-worker/map-worker.component";

const routes: Routes = [
  { path: "", redirectTo: "/auth", pathMatch: "full" },
  { path: "auth", component: AuthComponent },
  {
    path: "my-maps",
    component: MapListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "layers",
    component: LayerListComponent,
    children: [{ path: "edit/:id/:index", component: LayerEditComponent }],
    canActivate: [AuthGuard]
  },
  {
    path: "upload-map",
    component: MapLoaderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "map/:id",
    component: MapComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", component: PageNotFoundComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
