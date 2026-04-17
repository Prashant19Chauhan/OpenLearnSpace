import api from "./Api";

export const loginHandler = async(formData) => {
    console.log(formData)
    try{
        const response = await api.post("/api/student/auth/login", formData)
        console.log(response.data)
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