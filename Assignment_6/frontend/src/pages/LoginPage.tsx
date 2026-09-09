import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = (location.state as { message?: string } | null)?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/catalogue');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
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
                    <p className="auth-quote">“A reader lives a thousand lives before he dies.”</p>
                    <p className="small mt-2" style={{ color: 'rgba(253,249,240,.65)' }}>
                      — George R.R. Martin
                    </p>
                  </div>
                  <div className="auth-mini-books" aria-hidden="true">
                    <span style={{ background: 'linear-gradient(150deg,#7c3aed,#db2777)' }} />
                    <span style={{ background: 'linear-gradient(150deg,#0e7c6b,#134e4a)' }} />
                    <span style={{ background: 'linear-gradient(150deg,#e8a33d,#c96f4a)' }} />
                    <span style={{ background: 'linear-gradient(150deg,#2563eb,#0ea5e9)' }} />
                  </div>
                </div>
                {/* Form */}
                <div className="col-12 col-lg-7">
                  <div className="p-4 p-md-5">
                    <span className="section-eyebrow">Welcome back</span>
                    <h2 className="font-display fw-semibold mb-1">Login</h2>
                    <p className="text-muted small mb-4">Pick up right where you left off.</p>
                    {redirectMessage && <div className="alert alert-info alert-anim">{redirectMessage}</div>}
                    {error && <div className="alert alert-danger alert-anim">{error}</div>}
                    <form onSubmit={handleSubmit} noValidate>
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
                      <div className="mb-4">
                        <label htmlFor="password" className="form-floating-label">Password</label>
                        <div className="input-group">
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="form-control form-control-lg fs-6"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary password-toggle px-3"
                            onClick={() => setShowPassword((s) => !s)}
                          >
                            {showPassword ? 'Hide' : 'Show'}
                          </button>
                        </div>
                      </div>
                      <button type="submit" className="btn btn-pine w-100 py-2" disabled={loading}>
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Logging in…
                          </>
                        ) : (
                          'Login →'
                        )}
                      </button>
                    </form>
                    <p className="mt-4 mb-0 text-center small text-muted">
                      No account? <Link to="/register" className="fw-semibold">Register here</Link>
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
