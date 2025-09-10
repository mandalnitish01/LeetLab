import {create} from 'zustand'
import {axiosInstance} from '../lib/axios.js'
import {persist} from 'zustand/middleware'


export const useAuthStore = create((set)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,
}))