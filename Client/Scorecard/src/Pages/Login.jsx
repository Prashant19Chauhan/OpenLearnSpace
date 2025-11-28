import React, { useState } from 'react'
import { login } from '../Api/Auth.js'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from "../Redux/Slices/AuthSlice.js"
import { useNavigate } from 'react-router-dom'

function Login() {
  const [formData, setFormData] = useState({email:"", password:""})
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.user.auth)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }

  const loginHandler = async(e) => {
    e.preventDefault()
    dispatch(loginStart())
    try{
      const data = await login(formData)
      const { user, accessToken } = data
      dispatch(loginSuccess({ user, accessToken }))
      navigate('/')
    }catch(error){
      const errorMessage = error.response?.data?.message || 'Login failed'
      dispatch(loginFailure(errorMessage))
    }
  }
  return (
    <div className="h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-pink-500 flex flex-col justify-center items-center text-white p-8">
        <img
          src="/login-illustration.png" // replace with your image path
          alt="Illustration"
          className="max-w-md mb-8"
        />
        <h1 className="text-3xl font-bold mb-2">
          EduManage: Streamlining Education Management.
        </h1>
        <p className="text-lg text-gray-100">
          Manage students, classes, and analytics easily.
        </p>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center px-16">
        {/* Logo */}
        <div className="absolute top-8 right-16 text-right">
          <h2 className="text-2xl font-semibold">EduMan</h2>
          <span className="text-sm text-gray-500">Platform</span>
        </div>

        {/* Login Form */}
        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-2xl font-bold mb-8">Log in</h2>
          <form className="space-y-6" onSubmit={loginHandler}>
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="email"
                id='email'
                name='email'
                placeholder="user@example.com"
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id='password'
                name='password'
                placeholder="••••••••"
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                onChange={handleChange}
              />
            </div>

            {/* Log in button */}
            <button
              type="submit"
              className="w-full rounded-full bg-pink-500 text-white py-2 font-medium hover:bg-pink-600 transition"
            >
              {loading? "Loading..." : "Log in"}
            </button>
            {error? <p>{error}</p>: null}
          </form>

          {/* Forgot password */}
          <p className="mt-4 text-sm text-gray-600 text-center cursor-pointer hover:underline">
            Forgot your password?
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
