import axios from 'axios';

export const loginHandler = async(formData) => {
    console.log(formData);
}

export const getList = async() => {
    try {
        const response = await axios.get("http://localhost:5000/api/demo/teacherlist/demo");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}