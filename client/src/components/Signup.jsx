import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';

const Signup = ({ switchToLogin }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Password strength calculator
  const getPasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strength = getPasswordStrength(formData.password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f59e0b', '#3b82f6', '#22c55e'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const res = await signup(formData.fullName, formData.email, formData.password);
    setLoading(false);

    if (res.success) {
      setSuccess(res.message);
    } else {
      setError(res.message);
    }
  };

  return (
    <div>
      <div className="auth-header">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us today to get full access</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="signup-name">Full Name</label>
          <div className="input-wrapper">
            <User className="input-icon" size={18} />
            <input
              id="signup-name"
              type="text"
              name="fullName"
              className="form-input"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-email">Email Address</label>
          <div className="input-wrapper">
            <Mail className="input-icon" size={18} />
            <input
              id="signup-email"
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-password">Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="form-input"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              className="toggle-pwd"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {formData.password && (
            <div>
              <div className="strength-meter">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="strength-bar"
                    style={{
                      backgroundColor: i < strength ? strengthColors[strength - 1] : undefined,
                    }}
                  />
                ))}
              </div>
              <div className="strength-text">
                Password Strength: <strong style={{ color: strengthColors[strength - 1] || '#94a3b8' }}>{strengthLabels[strength - 1] || 'Too Short'}</strong>
              </div>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input
              id="signup-confirm"
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-input"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <div className="spinner" />
          ) : (
            <>
              <UserPlus size={18} />
              Register Account
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Signup;
