import api from "./Api";

const API_URL = "/api/platform/management"

export const employeList = async() => {
    const response = await api.get(`${API_URL}/users`)
    return response.data
}

export const employeeDetails = async(id) => {
    const response = await api.post(`${API_URL}/userDetail`, id, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

export const deleteEmployee = async(id) => {
    const response = await api.post(`${API_URL}/deleteUser`, id, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

export const updateEmployee = async(formData) => {
    const response = await api.post(`${API_URL}/updateUser`, formData, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}