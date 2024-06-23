'use client'
import { redirect } from "next/dist/server/api-utils";
import Image from "next/image";
import { useEffect, useState} from 'react'

export default function Home() {
  const [isStudent, makeStudent] = useState(true);
  const [hasAccount, setAccountExists] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const checkLogin = async() => {
      const url = "http://localhost:3000/api/login";
      const response = await fetch(url, {method: "GET", credentials: "include"});
      const res = await response.json();
      if ("userID" in res) window.location.href = "/student/dashboard";
    }
    checkLogin();
  }, []);

  const handleSubmit = async(e) => {
    e.preventDefault();
    const url = "http://localhost:3000/api" + (hasAccount ? '/login' : '/signup');
    const response = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({"username": username, "password": password}),
      credentials: 'include'
    })
    console.log(response);
    if (!("error" in response)) {
      window.location.href = "/student/dashboard";
    }
  }
  return (
    <>
      <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#96ade9d3_1px,transparent_1px),linear-gradient(to_bottom,#96ade9d3_1px,transparent_1px)] bg-[size:24px_24px] h-lvh w-lvw -z-10 fixed" />
      <main className="flex min-h-screen flex-col items-center p-24 pt-0 z-10 text-black backdrop-blur-[1px] bg-[#10101030]">
        <div className="bg-gray-100 mt-36 h-96 w-1/2 p-6 rounded-md flex-col">
          <h1 className="text-gray-700 align-middle text-left font-semibold text-black text-3xl">{isStudent?"Student":"Teacher"} {hasAccount?"Login":"Registration"} </h1>

          <button className="ml-0.5 mt-0 text-sm text-blue-700 underline" onClick={()=>makeStudent(!isStudent)}>
            Not a {isStudent?"Student?":"Teacher?"}
          </button>

          <div>
            <div class="mt-3 mx-0.5 w-full">
              <form class="space-y-6" action="#" method="POST">
                <div className="w-full">
                  <label for="username" class="block text-sm font-medium leading-6 text-gray-900">Username</label>
                  <div class="mt-2">
                    <input id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 pl-3 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-outset focus:ring-blue-600 sm:text-sm sm:leading-6" />
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                  <div class="text-sm">
                    <a href="#" class="font-semibold text-blue-600 hover:text-blue-500">Forgot password?</a>
                  </div>
                </div>
                <div class="mt-2">
                  <input id="password" name="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} autocomplete="current-password" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-600 pl-3 sm:text-sm sm:leading-6" />
                </div>

                <div>
                  <button type="submit" onClick={(e)=>handleSubmit(e)} class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">{hasAccount?"Sign in":"Register"}</button>
                    <a href="#" class="font-semibold text-blue-600 text-xs pt-1 hover:text-blue-500" onClick={()=>{setAccountExists(!hasAccount)}}>{hasAccount?"I don't have an account (Register).":"I have an account (Sign in)"}</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>


    </>
  );
}
