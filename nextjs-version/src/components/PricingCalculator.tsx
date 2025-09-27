'use client';

import { useEffect } from 'react';

export default function PricingCalculator() {
  useEffect(() => {
    // Initialize map if Leaflet is loaded
    if (typeof window !== 'undefined' && window.L) {
      const map = window.L.map('map').setView([-3.2945, 102.8614], 13);
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);
    }
  }, []);

  return (
    <section className="pricing-calculator" id="calculator">
      <div className="container">
        <div className="section-title">
          <h2>Kalkulator Tarif Jastip Lubuklinggau</h2>
          <p>Hitung estimasi biaya layanan jastip berdasarkan jarak dan kebutuhan Anda</p>
        </div>

        <div className="calculator-container">
          <div className="calculator-form">
            <div className="form-group">
              <label htmlFor="service-type">Jenis Layanan</label>
              <select id="service-type">
                <option value="food">Antar Makanan</option>
                <option value="goods">Antar Barang</option>
                <option value="passenger">Antar Penumpang</option>
                <option value="shopping">Jasa Belanja</option>
                <option value="gift">Kirim Hadiah</option>
                <option value="pickup">Pickup Barang</option>
              </select>
            </div>
          </div>

          <div className="search-container">
            <input
              type="text"
              id="address-search"
              className="search-input"
              placeholder="Cari alamat di Lubuk Linggau..."
            />
            <button className="search-button" id="search-button" aria-label="Cari alamat">
              <i className="fas fa-search"></i>
            </button>
          </div>

          <div className="map-container">
            <div id="map"></div>
          </div>

          <div className="map-info">
            <div className="map-info-item">
              <span>Lokasi Awal:</span>
              <span id="start-location">Belum dipilih</span>
            </div>
            <div className="map-info-item">
              <span>Lokasi Tujuan:</span>
              <span id="end-location">Belum dipilih</span>
            </div>
            <div className="map-info-item">
              <span>Jarak (km):</span>
              <span id="distance">-</span>
            </div>
            <div className="map-info-item">
              <span>Estimasi Waktu:</span>
              <span id="estimated-time">-</span>
            </div>
            <div className="weight-input-container">
              <label htmlFor="weight">Berat Barang (kg):</label>
              <input type="number" id="weight" min="1" value="1" className="weight-input" />
            </div>
          </div>

          <button className="btn" id="calculate-btn">
            Hitung Tarif
          </button>

          <div className="calculator-result" id="calculator-result">
            <div className="result-title">Estimasi Biaya</div>
            <div className="result-price" id="result-price">
              Rp 0
            </div>
            <div className="result-details" id="result-details">
              Pilih layanan dan masukkan detail untuk menghitung biaya
            </div>
          </div>
        </div>

        <div className="tarif-info">
          <h3 className="tarif-title">Info Tarif Dasar</h3>
          <div className="tarif-grid">
            <div>
              <h4>Tarif Dasar per KM</h4>
              <ul>
                <li>3 km pertama: Rp 10.000</li>
                <li>Per km berikutnya: Rp 2.500</li>
              </ul>
            </div>
            <div>
              <h4>Biaya Tambahan</h4>
              <ul>
                <li>Barang berat ({'>'}5kg): Rp 2.000/kg</li>
                <li>Waktu tunggu: Rp 5.000/15 menit</li>
                <li>Layanan prioritas: +Rp 10.000</li>
              </ul>
            </div>
            <div>
              <h4>Layanan Khusus</h4>
              <ul>
                <li>Jasa belanja: +Rp 15.000</li>
                <li>Antar penumpang: +Rp 5.000</li>
                <li>Layanan malam (22.00-06.00): +Rp 10.000</li>
              </ul>
            </div>
          </div>
          <p className="tarif-note">
            * Harga dapat berubah sesuai dengan kondisi lalu lintas dan jarak tempuh
          </p>
        </div>
      </div>
    </section>
  );
}
