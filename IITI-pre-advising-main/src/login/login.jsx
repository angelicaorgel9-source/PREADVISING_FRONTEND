import React from 'react'
import { useNavigate } from 'react-router-dom'

import iitiLOGO from '../navbar/navbarLOGO/iitiLogo.png'   

function Login() {
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value

    const res = await fetch('/bridge/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.success) {
      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/dashboard')
    } else {
      alert(data.error || 'Invalid credentials')
    }
  }

  return (
    <div className='flex justify-center items-center h-screen font-RB bg-[#3B8126]'>
        
        <div 
            className=' bg-white rounded-2xl shadow-xl
                        w-86.75 h-149.5 '
            >
              
            <div>

                {/* IITI Logo */}
                <div className="flex justify-center p-8 ">
                  <img 
                    src={iitiLOGO} 
                    alt="IITI Logo" 
                    className=" bg-white rounded-full w-33.75 h-33.75 " 
                  />
                </div>

                {/* IITI title */}
                <div>
                    <h1 className='font-RB font-semibold text-center'>
                      Institute of Information
                      <br />Technology and Innovation
                    </h1>
                </div>

                {/*Log In Form*/}
                <div>
                    <form onSubmit={handleSubmit}
                        className='flex flex-col justify-center items-center space-y-5 pt-15'>
                        {/*username*/}
                        <input  type="text" id="username" name="username" required
                                className='border border-[#0E5A1280] rounded-full
                                           h-10.75 w-72.5 p-4 
                                           focus:outline-none focus:ring-2 focus:ring-green-400
                                           placeholder:text-xs  text-black/45
                                           cursor-pointer active:scale-95' 
                                placeholder='Admin'/>

                        {/*admin password*/}
                        <input  type="password" id="password" name="password" required
                                className='border border-[#0E5A1280] rounded-full
                                           h-10.75 w-72.5 p-4 
                                           focus:outline-none focus:ring-2 focus:ring-green-400
                                           placeholder:text-xs text-black/45
                                           cursor-pointer active:scale-95' 
                                placeholder='Password'/>

                        {/*Login Button */}
                        <div>

                            <button type='submit'
                            className=' bg-[#1C6100] rounded-full
                                         w-72.5 h-10.75
                                         cursor-pointer active:scale-95'>
                                <h1 className='font-bold text-white'>
                                    LOG IN
                                </h1>
                            </button>

                        </div>

                    </form>
                </div>
            </div>


        </div>

    </div>
  )
}

export default Login