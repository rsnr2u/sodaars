import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getApiErrorMessage, getApiFieldErrors } from '../../services/api';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleQuickFillDemo = () => {
    setEmail('provider@metrooutdoor.com');
    setPassword('password123');
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      success('Authentication successful.');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const errors = getApiFieldErrors(err);
      let msg = getApiErrorMessage(err);
      if (errors && Object.keys(errors).length > 0) {
        const firstField = Object.keys(errors)[0];
        const firstMsg = errors[firstField]?.[0];
        if (firstMsg) {
          msg = firstMsg;
        }
      }
      setErrorMessage(msg);
      showError(msg, 'Authentication Failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      cardTitle="Sign in to your organization"
      cardSubtitle="Enter your corporate credentials to access your advertising inventory, live availability schedules, and campaign inquiries."
    >
      {/* Demo Test Account Helper Bar */}
      <div className="auth-test-account-bar">
        <div className="auth-test-account-meta">
          <Shield size={15} style={{ color: '#2563eb', flexShrink: 0 }} />
          <span>Demo Account: <strong>provider@metrooutdoor.com</strong></span>
        </div>
        <button
          type="button"
          onClick={handleQuickFillDemo}
          className="auth-test-autofill-btn"
        >
          Auto-Fill
        </button>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <div className="auth-corp-error">
          <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{errorMessage}</div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Input
          label="Corporate Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@company.com"
          required
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          helperText="The verified email associated with your provider account"
        />

        <Input
          label="Account Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
          leftIcon={<Lock size={16} />}
          rightIcon={
            <button
              type="button"
              className="auth-input-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
            marginTop: '-0.25rem',
            fontSize: '0.82rem',
          }}
        >
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer', color: '#475569' }}>
            <input type="checkbox" defaultChecked style={{ borderRadius: '3px' }} />
            <span>Keep me signed in on this device</span>
          </label>
        </div>

        <button
          type="submit"
          className="auth-primary-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Authenticating...</span>
          ) : (
            <>
              <span>Sign In to Workspace</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Footer Switcher */}
      <div className="auth-corp-footer">
        New outdoor advertising provider?{' '}
        <Link to="/register">
          Register your organization
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
