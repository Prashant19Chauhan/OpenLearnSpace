import { useState } from "react";
import { loginHandler } from "../Api/Auth";

const useForm = () => {
    const [formData, setFormData] = useState({
        email:'',
        password:'',
    });

    const [response, setResponse] = useState('');

    const handleFormData = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value.trim()})
        setResponse("data fetching...")
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        const response = await loginHandler(formData);
        setResponse(response.data);
    }

    return [response, handleFormData, handleSubmit];
}

export default useForm;