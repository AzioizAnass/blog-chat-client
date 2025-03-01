import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx'; 
import { useLogin } from '../services/auth/authService.ts';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest } from '../types/auth.d.ts';

const Login = () => {
  const { login: setAuthenticated } = useAuth();
  const loginMutation = useLogin();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginRequest>({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); 

    loginMutation.mutate(formData, {
      onSuccess: (response) => {
        const token = response.accessToken; 
        localStorage.setItem("token", token); 

    console.log("token: " + JSON.stringify(token));
        setAuthenticated(); 
        navigate("/blog"); 
      },
      onError: () => {
        setError("Une erreur est survenue, veuillez réessayer.");
      },
    });
  };

  return (
  
<div className="login-form">
<h2>Welcome Back</h2>
<form onSubmit={handleSubmit} className="auth-form">
  {error && <div className="error-message">{error}</div>}
  <div className="form-group">
    <input
      type="text"
      name="usernameOrEmail"
      placeholder="Username or Email"
      value={formData.usernameOrEmail}
      onChange={handleInputChange}
      required
    />
  </div>
  <div className="form-group">
    <input
      type="password"
      name="password"
      placeholder="Password"
      value={formData.password}
      onChange={handleInputChange}
      required
    />
  </div>
  <button 
    type="submit" 
    disabled={loginMutation.isPending}
    className="submit-button"
  >
    {loginMutation.isPending ? 'Logging in...' : 'Login'}
  </button>
  <p>
  Don't have an account?{' '}
  <button className="link-button" onClick={() => navigate('/signup')}>
    Create one here
  </button>
</p>
</form>
</div>
  );
};

export default Login;
