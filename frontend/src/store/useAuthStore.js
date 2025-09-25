import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
// import {persist} from 'zustand/middleware'
import {toast} from 'react-hot-toast'

export const useAuthStore = create((set)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,

    checkAuth: async()=>{
        set({isCheckingAuth:true})
        try {
            const res = await axiosInstance.get('/auth/check')
            console.log("checkAuth Response ",res.data)
            set({authUser:res.data.user})
        } catch (error) {
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async (data) => {
      console.log("user signup data", data);
    set({ isSigninUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      console.log("signup response", res);
      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error signing up", error);
      toast.error("Error signing up");
    } finally {
      set({ isSigninUp: false });
    }
  },

   login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.user });

      toast.success(res.data.message);
    } catch (error) {
      console.log("Error logging in", error);
      toast.error("Error logging in");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successful");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },


}));