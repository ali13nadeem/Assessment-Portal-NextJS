// useUserStore.ts
import { create } from "zustand";
import { useEffect } from "react";

export type UserStates = {
  fullName: string;
  userName: string;
  email: string;
  educationLevel: string;
  password: string;
  confirmPassword: string;
  user: any; // or define a specific type for user data
  setFullName: (fullName: string) => void;
  setUserName: (userName: string) => void;
  setEmail: (email: string) => void;
  setEducationLevel: (educationLevel: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setUser: (user: any) => void;
  register: (formData: UserStates, router?: any) => Promise<void>;
  login: (credentials: { emailOrUsername: string; password: string }, router?: any) => Promise<void>;
  fetchUserData: () => Promise<void>;
  logout: (router?: any) => Promise<void>;
  registerLoading: boolean;
  loginLoading: boolean;
  fetchUserDataLoading: boolean;
  logoutLoading: boolean;
  registerErrorMessage: string | null;
  registerSuccessMessage: string | null;
  loginErrorMessage: string | null;
  loginSuccessMessage: string | null;
  fetchUserDataErrorMessage: string | null;
  fetchUserDataSuccessMessage: string | null;
  logoutErrorMessage: string | null;
  logoutSuccessMessage: string | null;
};

export const useUserStore = create<UserStates>((set) => ({
  fullName: "",
  userName: "",
  email: "",
  educationLevel: "",
  password: "",
  confirmPassword: "",
  user: null,
  registerLoading: false,
  loginLoading: false,
  fetchUserDataLoading: false,
  logoutLoading: false,
  registerErrorMessage: null,
  registerSuccessMessage: null,
  loginErrorMessage: null,
  loginSuccessMessage: null,
  fetchUserDataErrorMessage: null,
  fetchUserDataSuccessMessage: null,
  logoutErrorMessage: null,
  logoutSuccessMessage: null,
  setFullName: (fullName) => set({ fullName }),
  setUserName: (userName) => set({ userName }),
  setEmail: (email) => set({ email }),
  setEducationLevel: (educationLevel) => set({ educationLevel }),
  setPassword: (password) => set({ password }),
  setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
  setUser: (user) => set({ user }),
  register: async (formData, router) => {
    try {
      set({ registerLoading: true, registerErrorMessage: null, registerSuccessMessage: null });

      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

    

      const data = await response.json();
      set({ registerLoading: false, registerSuccessMessage: data.message });
      if (router) {
        router.push("/login");
      }

        // Reset form and success message on successful registration
        set({
          fullName: "",
          userName: "",
          email: "",
          educationLevel: "",
          password: "",
          confirmPassword: "",
          registerSuccessMessage: null,
          registerErrorMessage: null
        });
    } catch (error: any) {
      set({ registerErrorMessage: error.message });
      console.error("Registration error:", error.message);
    } finally {
      set({ registerLoading: false });
    }
  },
  login: async (credentials, router) => {
    try {
      set({ loginLoading: true, loginErrorMessage: null, loginSuccessMessage: null });

      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await response.json();
      set({ user: data.user, loginLoading: false, loginSuccessMessage: data.message });
      if (router) {
        router.push("/create");
      }

      set({
        loginSuccessMessage:null,
        loginErrorMessage:null,
      })
    } catch (error: any) {
      set({ loginErrorMessage: error.message });
      console.error("Login error:", error.message);
    } finally {
      set({ loginLoading: false });
    }
  },
  fetchUserData: async () => {
    try {
      set({ fetchUserDataLoading: true, fetchUserDataErrorMessage: null, fetchUserDataSuccessMessage: null });
      const response = await fetch("/api/user/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user data");
      }

      set({ user: data.data, fetchUserDataLoading: false, fetchUserDataSuccessMessage: "User data fetched successfully" });
    } catch (error: any) {
      set({ fetchUserDataErrorMessage: error.message });
      console.error("Fetch user data error:", error.message);
    } finally {
      set({ fetchUserDataLoading: false });
    }
  },
  logout: async (router) => {
    try {
      set({ logoutLoading: true, logoutErrorMessage: null, logoutSuccessMessage: null });

      const response = await fetch("/api/user/logout", {
        method: "GET",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Logout failed");
      }

      set({ user: null, logoutLoading: false, logoutSuccessMessage: "Logout successfully" });
      if (router) {
        router.push("/login");
      }
    } catch (error: any) {
      set({ logoutErrorMessage: error.message });
      console.error("Logout error:", error.message);
    } finally {
      set({ logoutLoading: false });
    }
  },
}));

export const useUser = () => {
  const { fetchUserData } = useUserStore();

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return useUserStore();
};
