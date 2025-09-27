export default function BottomNav() {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      <ul>
        <li>
          <a href="#home" className="nav-item active">
            <i className="fas fa-home"></i>
            <span>Beranda</span>
          </a>
        </li>
        <li>
          <a href="#services" className="nav-item">
            <i className="fas fa-concierge-bell"></i>
            <span>Layanan</span>
          </a>
        </li>
        <li>
          <a href="/resto.html" className="nav-item">
            <i className="fas fa-utensils"></i>
            <span>Restoran</span>
          </a>
        </li>
        <li>
          <a href="/toko.html" className="nav-item">
            <i className="fas fa-store"></i>
            <span>Toko</span>
          </a>
        </li>
        <li>
          <a href="#calculator" className="nav-item">
            <i className="fas fa-calculator"></i>
            <span>Tarif</span>
          </a>
        </li>
        <li>
          <a href="#contact" className="nav-item">
            <i className="fas fa-whatsapp"></i>
            <span>Kontak</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
