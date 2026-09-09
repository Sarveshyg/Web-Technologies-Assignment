import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('A valid email is required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const message = await register(fullName.trim(), email.trim(), password);
      setSuccess(message);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10 col-xl-9">
            <div className="card auth-card">
              <div className="row g-0">
                {/* Side panel */}
                <div className="col-lg-5 d-none d-lg-flex auth-side flex-column justify-content-between p-4 p-xl-5">
                  <div style={{ position: 'relative' }}>
                    <div className="d-flex align-items-center gap-2 mb-4">
                      <span className="brand-mark">B</span>
                      <span className="brand-name">BookNest</span>
                    </div>
                    <p className="auth-quote">“Once you learn to read, you will be forever free.”</p>
                    <p className="small mt-2" style={{ color: 'rgba(253,249,240,.65)' }}>
                      — Frederick Douglass
                    </p>
                    <ul className="small mt-4 ps-3" style={{ color: 'rgba(253,249,240,.8)' }}>
                      <li>Search across 8 categories</li>
                      <li>Secure BCrypt + JWT auth</li>
                      <li>Free forever for readers</li>
                    </ul>
                  </div>
                  <div className="auth-mini-books" aria-hidden="true">
                    <span style={{ background: 'linear-gradient(150deg,#059669,#0ea5e9)' }} />
                    <span style={{ background: 'linear-gradient(150deg,#b45309,#78350f)' }} />
                    <span style={{ background: 'linear-gradient(150deg,#ea580c,#ef4444)' }} />
                    <span style={{ background: 'linear-gradient(150deg,#334155,#0ea5e9)' }} />
                  </div>
                </div>
                {/* Form */}
                <div className="col-12 col-lg-7">
                  <div className="p-4 p-md-5">
                    <span className="section-eyebrow">Join the club</span>
                    <h2 className="font-display fw-semibold mb-1">Create account</h2>
                    <p className="text-muted small mb-4">Your password is hashed with BCrypt — never stored as plain text.</p>
                    {error && <div className="alert alert-danger alert-anim">{error}</div>}
                    {success && <div className="alert alert-success alert-anim">{success} Redirecting to login…</div>}
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-floating-label">Full Name</label>
                        <input
                          id="fullName"
                          type="text"
                          className="form-control form-control-lg fs-6"
                          placeholder="Jane Reader"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-floating-label">Email</label>
                        <input
                          id="email"
                          type="email"
                          className="form-control form-control-lg fs-6"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label htmlFor="password" className="form-floating-label">Password</label>
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg fs-6"
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                          />
                        </div>
                        <div className="col-12 col-md-6">
                          <label htmlFor="confirmPassword" className="form-floating-label">Confirm Password</label>
                          <input
                            id="confirmPassword"
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg fs-6"
                            placeholder="Repeat password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-check mt-3 mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="showPw"
                          checked={showPassword}
                          onChange={(e) => setShowPassword(e.target.checked)}
                        />
                        <label className="form-check-label small" htmlFor="showPw">
                          Show passwords
                        </label>
                      </div>
                      <button type="submit" className="btn btn-pine w-100 py-2" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Creating account…
                          </>
                        ) : (
                          'Register →'
                        )}
                      </button>
                    </form>
                    <p className="mt-4 mb-0 text-center small text-muted">
                      Already have an account? <Link to="/login" className="fw-semibold">Login here</Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
