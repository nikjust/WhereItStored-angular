import {AfterViewInit, Component, ElementRef, Inject, ViewChild} from '@angular/core'
import {style} from "@angular/animations";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {


  itemicons = ["bi-box", "bi-box-seam", "bi-bag", "bi-book",
    "bi-briefcase", "bi-inbox", "bi-inboxes", "bi-journal",
    "bi-phone", "bi-sd-card", "bi-tablet", "bi-tools",
    "bi-tv", "bi-watch", "bi-smartwatch", "bi-folder"];

  storageicons = ["bi-bag", "bi-box", "bi-box-seam", "bi-archive",
    "bi-briefcase", "bi-folder", "bi-gift", "bi-handbag"
  ]

  currentitemicon = this.itemicons[1]
  currentstorageicon = "bi-bag"

  dbbuffer: any = [
    {
      key: "storage", name: "storage", icon: "bi-archive", items: [
        {id: 0, name: "item", icon: "bi-box"},
        {id: 1, name: "item 2", icon: "bi-box-seam"},
        {id: 2, name: "item 3", icon: "bi-alarm"}
      ]
    },
    {
      key: "storage2", name: "storage2", icon: "bi-bag", items: [
        {id: 3, name: "item2", icon: "bi-sd-card"}
      ]
    }
  ]
  selectedItem?: any = this.dbbuffer[0];
  server_ip: any = 'localhost';

  @ViewChild('root', {static: false})
  rootElement!: ElementRef;

  @ViewChild('storage', {static: false})
  storageElement!: ElementRef;

  @ViewChild('ipInput', {static: false})
  ipInput!: ElementRef

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }


  ngAfterViewInit() {
    if (localStorage.getItem("HostIP") != undefined) {
      this.server_ip = localStorage.getItem("HostIP")
      this.ipInput.nativeElement.value = localStorage.getItem("HostIP")
    }
    /*if (this.server_ip != null) {
      this.getfromserver(this.server_ip, 8080)
    }*/

  }

  restyle() {
    const e = this.rootElement.nativeElement;
    e.setAttribute('class', e.getAttribute("class") === "light-theme" ? "dark-theme" : "light-theme");
  }

  changeStorage(e: any) {
    this.selectedItem = e
  }

  HostIpChange() {
    console.log("serverip=" + encodeURIComponent(this.ipInput.nativeElement.value))
    localStorage.setItem("HostIP", this.ipInput.nativeElement.value)
    let params = new HttpParams().set('command', "get")
    let headers = new HttpHeaders().set("command", "get")
    this.http.get("http://" + this.server_ip + ":8081", {params: params, headers: headers}).subscribe(data => {
      console.log(data)
      console.log(JSON.stringify(data) + typeof data)
      this.dbbuffer = Object.entries(data)[0][1]
      this.selectedItem = Object.entries(data)[0][1][0]
    })

  }

  showhide_storage_icons() {
    let x = document.getElementById("iconsStorage");
    if (x!.style.display === "none") {
      x!.style.display = "block";
    } else {
      x!.style.display = "none";
    }
  }

  change_icon(icon: string) {
    this.currentitemicon = icon;
  }

  change_storage_icon(icon: string) {
    this.currentstorageicon = icon;
  }


}




