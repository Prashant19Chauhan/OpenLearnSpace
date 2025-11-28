import api from "./Api.js"
import { store } from "../Redux/Store.js"
import { logout } from "../Redux/Slices/AuthSlice.js"

const API_URL = "/api/platform/auth"

export const login = async(formData) => {
    const response = await api.post(`${API_URL}/login`, formData, {
        headers: {
            "Content-Type": "application/json",
        },
    })

    return response;
}

export const register = async(formData) => {
    const response = await api.post(`${API_URL}/register`, formData, {
        headers: {
            "Content-Type": "application/json",
        },
    })

    return response;
}

export const logoutRoute = async() => {
    await api.post(`${API_URL}/logout`);
    store.dispatch(logout());
}