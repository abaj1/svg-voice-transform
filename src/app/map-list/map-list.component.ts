import { Component, OnInit, OnDestroy } from "@angular/core";
import { MapService, Map } from "../services/map.service";
import { Subscription } from "rxjs";
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: "app-map-list",
  templateUrl: "./map-list.component.html",
  styleUrls: ["./map-list.component.css"]
})
export class MapListComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    this.pageError = null;
    this.mapListError = null;
  }
  constructor(
    private mapService: MapService,
    private authService: AuthService
  ) {}

  public maps: Map[] = [];
  mapVisible: boolean = false;
  isLoading: boolean = true;
  mapListError: string = "";
  subscription: Subscription;
  pageError: String = "";
  user: User;

  onClose() {
    this.pageError = null;
  }
  ngOnInit() {
    this.subscription = this.authService.user.subscribe(user => {
      this.user = user;
    })
    this.subscription.add(this.mapService.getMapsFromDbForUser(this.user.id).subscribe(
    // this.subscription = this.mapService.getMapsFromDb().subscribe(
      response => {
        this.maps = response.maps;
        this.isLoading = false;
      },
      error => {
        if (error && error.error) {
          if (String(error.error.message).includes("List of maps is empty!"))
            this.mapListError = error.error.message;
          else this.pageError = error.error.message;
        } else this.pageError = error;

        this.isLoading = false;
      }
    ));

    this.subscription.add(
      this.mapService.addMap.subscribe(
        maps => {
          this.maps = maps;
        },
        error => {
          if (error || error.error) this.pageError = error.error.message;
        }
      )
    );

  }
  selectMap(index: number) {
    return this.maps[index];
  }
  onMapWasSelected() {
    // this.listVisible = false;
    this.mapVisible = true;
  }

  onMapWasDeleted(event: { index: number; message: string }) {
    this.maps.splice(event.index, 1);
    this.pageError = event.message;
  }
}
