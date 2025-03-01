import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx'; 
import { useSignUp } from '../services/auth/authService.ts';
import { useNavigate } from 'react-router-dom';
import type { SignUpRequest } from '../types/auth.d.ts';

const Signup  =()=> {
  const { login: setAuthenticated } = useAuth();
  const signupMutation = useSignUp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpRequest>({ username:"",email:"",firstName:"",lastName: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    console.log("formData: " + JSON.stringify(formData));

    signupMutation.mutate(formData, {
      onSuccess: (response) => {
        const token = response.token; 
        localStorage.setItem("token", token); 
        setAuthenticated(); 
        navigate("/home"); 
      },
      onError: () => {
        setError("Une erreur est survenue, veuillez réessayer.");
      },
    });
  };


return(
<div className="signup-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
            minLength={6}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleInputChange}
            required
            minLength={6}
          />
        </div>
        <button 
          type="submit" 
          disabled={signupMutation.isPending}
          className="submit-button"
        >
          {signupMutation.isPending ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <button className="link-button" onClick={() => navigate('/login')}>
          Login here
        </button>
      </p>
    </div>) ;
}


export default Signup;
