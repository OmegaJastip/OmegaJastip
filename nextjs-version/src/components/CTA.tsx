export default function CTA() {
  return (
    <section className="cta" id="contact">
      <div className="container">
        <h2>Siap Menggunakan Jastip Lubuklinggau?</h2>
        <p>Hubungi kami sekarang untuk pemesanan atau informasi lebih lanjut tentang layanan antar jemput di Lubuk Linggau</p>
        <a href="https://wa.me/62895700341213" className="btn cta-link" aria-label="Hubungi via WhatsApp">
          <i className="fab fa-whatsapp"></i> Hubungi via WhatsApp
        </a>
        <p className="cta-phone">
          Atau telepon: <a href="tel:+62895700341213" style={{ color: '#fff', textDecoration: 'underline' }}>
            0895-7003-41213
          </a>
        </p>
      </div>
    </section>
  );
}
