'use client';

import { useEffect } from 'react';

export default function Testimonials() {
  useEffect(() => {
    // Story navigation logic if needed
  }, []);

  return (
    <section className="testimonials" id="testimonials">
      <div className="container">
        <div className="section-title">
          <h2>Cerita Pelanggan Omega Jastip</h2>
          <p>Pengalaman nyata dari pelanggan yang sudah merasakan layanan jastip terpercaya di Lubuk Linggau</p>
        </div>

        <div className="stories-container">
          <div className="story-card">
            <div className="story-header">
              <div className="story-user">
                <div className="story-avatar">
                  <img src="/images/cewe.jpg" alt="Rina Susanti" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
                <div className="story-user-info">
                  <h4>Rina Susanti</h4>
                  <p>Pelanggan Setia • 2 minggu lalu</p>
                </div>
              </div>
              <div className="story-time">📖</div>
            </div>
            <div className="story-content">
              <p className="story-text">
                {`"Halo semua! 👋 Saya mau share pengalaman pakai jasa Omega Jastip. Minggu lalu saya lagi butuh banget antar makanan dari resto kesukaan ke kantor. Driver nya datang tepat waktu, makanan masih hangat dan packaging nya rapi banget! 😍<br /><br />
                Yang bikin impressed, driver nya juga ramah dan komunikatif. Sekarang saya jadi langganan deh buat antar barang kecil-kecilan. Recommended banget buat yang lagi sibuk tapi butuh bantuan pengantaran di Lubuk Linggau! ⭐⭐⭐⭐⭐"`}
              </p>
              <div className="story-reactions">
                <span className="reaction">❤️ 24</span>
                <span className="reaction">💬 8</span>
                <span className="reaction">📤 3</span>
              </div>
            </div>
          </div>

          <div className="story-card">
            <div className="story-header">
              <div className="story-user">
                <div className="story-avatar">
                  <img src="/images/cewe.jpg" alt="Dewi Anggraini" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
                <div className="story-user-info">
                  <h4>Dewi Anggraini</h4>
                  <p>Ibu Rumah Tangga • 5 hari lalu</p>
                </div>
              </div>
              <div className="story-time">🚗</div>
            </div>
            <div className="story-content">
              <p className="story-text">
                {`"Story time! 🚗💨 Pernah gak sih kalian butuh diantar ke suatu tempat tapi gak ada kendaraan? Nah, Omega Jastip jawabannya! Saya baru aja pakai layanan antar penumpang mereka.<br /><br />
                Driver nya profesional banget, mobil bersih, dan yang penting AMAN. Dari rumah di kompleks A langsung ke pasar tradisional tanpa harus naik angkot berkali-kali. Hemat waktu dan tenaga! Plus harganya juga terjangkau. Sekarang gak perlu khawatir lagi kalau mau keluar rumah tanpa kendaraan pribadi. Terima kasih Omega Jastip! 🙏✨"`}
              </p>
              <div className="story-reactions">
                <span className="reaction">❤️ 31</span>
                <span className="reaction">💬 12</span>
                <span className="reaction">📤 7</span>
              </div>
            </div>
          </div>

          <div className="story-card">
            <div className="story-header">
              <div className="story-user">
                <div className="story-avatar">
                  <img src="/images/cowo.png" alt="Budi Santoso" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
                <div className="story-user-info">
                  <h4>Budi Santoso</h4>
                  <p>Pelanggan Luar Kota • 1 hari lalu</p>
                </div>
              </div>
              <div className="story-time">🎁</div>
            </div>
            <div className="story-content">
              <p className="story-text">
                {`"Dari Jakarta mau kirim hadiah buat orang tua di Lubuk Linggau, bingung banget caranya. Sampai nemu Omega Jastip di Instagram! Langsung chat WhatsApp mereka dan ternyata prosesnya gampang banget. 📱<br /><br />
                Saya kasih detail hadiah yang mau dikirim, alamat lengkap, terus mereka yang urus semuanya. Hadiah sampai dengan selamat, orang tua saya seneng banget! Yang bikin puas lagi, mereka kirim foto bukti pengiriman. Sekarang kalau mau kirim apapun ke Lubuk Linggau, Omega Jastip pilihan pertama! Terpercaya dan responsif. 👍"`}
              </p>
              <div className="story-reactions">
                <span className="reaction">❤️ 45</span>
                <span className="reaction">💬 15</span>
                <span className="reaction">📤 12</span>
              </div>
            </div>
          </div>
        </div>

        <div className="story-navigation">
          <span className="story-dot active" data-story="0"></span>
          <span className="story-dot" data-story="1"></span>
          <span className="story-dot" data-story="2"></span>
        </div>

        <div className="story-cta">
          <p>Punya cerita pengalaman pakai jasa Omega Jastip?</p>
          <a href="https://wa.me/62895700341213" className="btn">Share Cerita Kamu</a>
        </div>
      </div>
    </section>
  );
}
