import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer-nest pt-5 mt-auto">
      <div className="container pb-4">
        <div className="row g-4">
          <div className="col-12 col-md-5">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-mark">B</span>
              <span className="brand-name">BookNest</span>
            </div>
            <p className="small mb-0" style={{ maxWidth: '24rem' }}>
              A cosy corner of the internet for readers — browse curated titles across
              technology, fiction, business, science and more.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h6>Explore</h6>
            <div className="d-flex flex-column">
              <Link className="footer-link" to="/">Home</Link>
              <Link className="footer-link" to="/catalogue">Catalogue</Link>
              <Link className="footer-link" to="/login">Login</Link>
              <Link className="footer-link" to="/register">Register</Link>
            </div>
          </div>
          <div className="col-6 col-md-4">
            <h6>Built with</h6>
            <div className="d-flex flex-column">
              <span className="footer-link">React + TypeScript + Vite</span>
              <span className="footer-link">Spring Boot + Spring Security</span>
              <span className="footer-link">MongoDB + JWT + BCrypt</span>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom py-3 text-center">
        <div className="container">
          <small>© {new Date().getFullYear()} BookNest — a college project demo.</small>
        </div>
      </div>
    </footer>
  );
}
