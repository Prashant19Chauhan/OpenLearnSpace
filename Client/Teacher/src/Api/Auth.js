import api from "./Api";

export const loginHandler = async(formData) => {
    try{
        const response = await api.post("/api/teacher/auth/login", formData)
        return response.data
    }catch(error){
        return error;
    }
}

export const getList = async() => {
    try {
        const response = await api.get("/api/demo/teacherlist/demo");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}