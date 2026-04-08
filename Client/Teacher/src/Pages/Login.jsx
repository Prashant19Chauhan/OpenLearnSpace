import React from 'react'
import useForm from "../hooks/useForm.jsx";
import useListHandler from '../hooks/useListHandler.jsx';

function Login() {
  const [response, handleFormData] =  useForm();
  const [data, getList] = useListHandler();
  return (
    <div className="h-screen flex">
      {/* Left Section */}
      <div className="w-1/2 bg-green-500 flex flex-col justify-center items-center text-white p-8">
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
          <span className="text-sm text-gray-500">Institution</span>
        </div>

        {/* Login Form */}
        <div className="max-w-sm w-full mx-auto">
          <h2 className="text-2xl font-bold mb-8">Log in</h2>
          <form className="space-y-6">
            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User ID
              </label>
              <input
                type="email"
                name="email"
                id='email'
                onChange={(e)=>handleFormData(e)}
                placeholder="user@example.com"
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name='password'
                id='password'
                onChange={(e)=>handleFormData(e)}
                placeholder="••••••••"
                className="w-full rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Log in button */}
            <button
              type="submit"
              className="w-full rounded-full bg-green-500 text-white py-2 font-medium hover:bg-green-600 transition"
            >
              Log in
            </button>
          </form>

          {/* Forgot password */}
          <p className="mt-4 text-sm text-gray-600 text-center cursor-pointer hover:underline">
            Forgot your password?
          </p>
          {response?<p>{response}</p>:null}
        </div>
          <div>
            <button onClick={()=>getList()}>Show All Teacher List</button>
            {
              data?.data.map((value)=>{
                return <li key={value._id}>{value.name}</li>
              })
            }
          </div>
        </div>
    </div>
  )
}

export default Login
