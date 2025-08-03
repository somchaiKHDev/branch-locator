import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  map!: L.Map;
  markers: L.Marker[] = [];

  branches = [
    { name: 'สาขากรุงเทพ', lat: 13.7563, lng: 100.5018 },
    { name: 'สาขาเชียงใหม่', lat: 18.7883, lng: 98.9853 },
    { name: 'สาขาโคราช', lat: 14.9799, lng: 102.0978 },
    { name: 'สาขาราชบุรี', lat: 13.5362, lng: 99.8172 },
    { name: 'สาขานครปฐม', lat: 13.8199, lng: 100.0607 },
    { name: 'สาขาสมุทรปราการ', lat: 13.5991, lng: 100.5998 },
    { name: 'สาขานนทบุรี', lat: 13.8591, lng: 100.5217 },
    { name: 'สาขาปทุมธานี', lat: 14.0208, lng: 100.525 },
  ];

  currentIcon = L.icon({
    iconUrl: 'assets/current_location.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  coffeeIcon = L.icon({
    iconUrl: 'assets/coffee_cup.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });

  isLoading: boolean = false;

  ngAfterViewInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([13.7563, 100.5018], 6);

    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '© OpenStreetMap contributors',
      }
    ).addTo(this.map);

    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);

    this.branches.forEach((branch) => {
      const marker = L.marker([branch.lat, branch.lng], {
        icon: this.coffeeIcon,
      })
        .addTo(this.map)
        .bindPopup(`<b>${branch.name}</b>`);
      this.markers.push(marker);
    });
  }

  goToCurrentLocation(): void {
    if (!navigator.geolocation) {
      alert('เบราว์เซอร์ไม่รองรับการหาตำแหน่ง');
      return;
    }

    this.isLoading = true;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // ซูมไปยังตำแหน่งผู้ใช้
        this.map.setView([lat, lng], 14);

        // เพิ่ม marker
        L.marker([lat, lng], { icon: this.currentIcon })
          .addTo(this.map)
          .bindPopup('ตำแหน่งของคุณ')
          .openPopup();

        this.isLoading = false;
      },
      (error) => {
        alert('ไม่สามารถดึงตำแหน่งได้');
        console.error(error);
        this.isLoading = false;
      }
    );
  }
}
