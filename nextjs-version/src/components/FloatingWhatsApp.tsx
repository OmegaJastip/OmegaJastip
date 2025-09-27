'use client';

import { useEffect } from 'react';

export default function FloatingWhatsApp() {
  useEffect(() => {
    // Floating WhatsApp logic if needed
  }, []);

  return (
    <a
      href="https://wa.me/62895700341213?text=Halo%20Omega%20Jastip%2C%20saya%20mau%20pesan%20layanan%20antar%20jemput"
      className="floating-whatsapp"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi via WhatsApp"
    >
      <i className="fab fa-whatsapp"></i>
      <span className="whatsapp-tooltip">Pesan Sekarang</span>
    </a>
  );
}
