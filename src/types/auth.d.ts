export interface PrivateRouteProps {
    isAuthenticated: boolean;
  }

export interface AuthContextProps {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
  }

export interface LoginRequest {
    usernameOrEmail: string;
    password: string;
  }

export interface SignUpRequest {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }

 export interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }
  