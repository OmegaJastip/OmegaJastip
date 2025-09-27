export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Omega Jastip Lubuklinggau</h3>
            <p>Layanan jasa titip antar jemput terpercaya di Lubuk Linggau untuk kebutuhan harian Anda.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/omega_jastip_lubuklinggau/" aria-label="Instagram" target="_blank" rel="noopener">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/62895700341213" aria-label="WhatsApp" target="_blank" rel="noopener">
                <i className="fab fa-whatsapp"></i>
              </a>
              <a href="https://www.tiktok.com/@jastipomega" aria-label="TikTok" target="_blank" rel="noopener">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h3>Layanan</h3>
            <ul>
              <li><a href="#services">Antar Makanan</a></li>
              <li><a href="#services">Antar Barang</a></li>
              <li><a href="#services">Antar Penumpang</a></li>
              <li><a href="#services">Jasa Belanja</a></li>
              <li><a href="#services">Kirim Hadiah</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Link Cepat</h3>
            <ul>
              <li><a href="#home">Beranda</a></li>
              <li><a href="#services">Layanan</a></li>
              <li><a href="#calculator">Kalkulator Tarif</a></li>
              <li><a href="#how-it-works">Cara Kerja</a></li>
              <li><a href="#testimonials">Testimoni</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Kontak</h3>
            <ul>
              <li>
                <i className="fas fa-map-marker-alt"></i> Jalan Teladan RT 1 no 08 Sebelum Kantor Lurah, Bandung Kiri, Kec. Lubuk Linggau Bar. I, Kota Lubuklinggau, Sumatera Selatan 31611
              </li>
              <li>
                <i className="fas fa-phone"></i> <a href="tel:+62895700341213">+62 895 7003 41213</a>
              </li>
              <li>
                <i className="fas fa-envelope"></i> <a href="mailto:Jastipomega@gmail.com">Jastipomega@gmail.com</a>
              </li>
              <li>
                <i className="fas fa-clock"></i> Senin - Minggu: 07.00 - 21.00 WIB
              </li>
            </ul>
          </div>
        </div>

        <div className="copyright">
          <p>&copy; 2024 Omega Jastip Lubuklinggau. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
