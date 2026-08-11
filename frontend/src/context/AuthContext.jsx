import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  registerUser,
  getCurrentUser,
  logoutUser,
} from "../services/authService";

const AuthContext =
  createContext(null);

export const AuthProvider = ({
  children,
}) => {
  const [user, setUser] =
    useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  /*
    Restore existing session
    from HttpOnly cookie.
  */

  useEffect(() => {
    const restoreSession =
      async () => {
        try {
          const response =
            await getCurrentUser();

          const currentUser =
            response.data?.user;

          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null);
          }
        } catch (error) {
          setUser(null);
        } finally {
          setAuthLoading(false);
        }
      };

    restoreSession();
  }, []);

  /*
    Register
  */

  const register = async (
    userData
  ) => {
    const response =
      await registerUser(
        userData
      );

    const newUser =
      response.data?.user;

    if (!newUser) {
      throw new Error(
        "Invalid registration response from server."
      );
    }

    setUser(newUser);

    return newUser;
  };

  /*
    Login

    Login.jsx receives the
    complete user object from
    backend and stores it here.
  */

  const login = (
    userData
  ) => {
    if (!userData) {
      return;
    }

    setUser(userData);
  };

  /*
    Logout
  */

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error(
        "Logout request failed:",
        error
      );
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        authLoading,

        isAuthenticated:
          Boolean(user),

        register,

        login,

        logout,

        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
};