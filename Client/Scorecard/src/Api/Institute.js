import api from "./Api.js"

const API_URL = "/api/platform/institute"

export const enrollInstitute = async (data) => {
    const response = await api.post(`${API_URL}/enroll`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

export const getAllInstitutes = async () => {
    const response = await api.get(`${API_URL}/list`)
    return response.data
}

export const findInstituteDetails = async(id) => {
    const response = await api.post(`${API_URL}/details`, id, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}

export const updateInstituteDetails = async(data) => {
    const response = await api.post(`${API_URL}/update`, data, {
        headers: {
            "Content-Type": "application/json",
        },
    })
    return response.data
}