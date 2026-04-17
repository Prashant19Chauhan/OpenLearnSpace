import { useState } from "react";
import { loginHandler } from "../Api/Auth";
import { useNavigate } from "react-router-dom";
import { loginStart, loginSuccess, loginFailure } from "../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";

const useForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
        try{
            dispatch(loginStart())
            e.preventDefault();
            const response = await loginHandler(formData);
            if(response.success == true){
                const { data: user, accessToken } = response;
                dispatch(loginSuccess({ user, accessToken }));
                navigate("/dashboard")
            }
            
        }catch(error){
            dispatch(loginFailure())
            setResponse(error.message)
        }
    }

    return [response, handleFormData, handleSubmit];
}

export default useForm;