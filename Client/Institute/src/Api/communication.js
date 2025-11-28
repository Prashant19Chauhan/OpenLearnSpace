import api from "./Api";

const API_URL = 'api/institute/communication'

export const addNotice = async(data) => {
    try{
        const response = await api.post(`${API_URL}/notices/create`, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data
    }catch(error){
        console.log(error)
    }
}

export const noticeList = async() => {
    try{
        const response = await api.get(`${API_URL}/notices`)
        return response.data
    }catch(error){
        console.log(error)
    }
}