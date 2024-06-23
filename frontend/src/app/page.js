'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas';

function sort_by_key(array, key)
{
  return array.sort(function(a, b)
  {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

const success_messages = ["Good work!", "Nice job.","Looks good!", "Looks correct. Keep it up!", "Looks great.", "Correct!", "You're on the right track!"]

export default function Home() {

  const [isStudent, setStudent] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = async() => {
      const url = "http://localhost:3000/api/login";
      const response = await fetch(url, {method: "GET", credentials: "include"});
      const res = await response.json();

      if (res?.error === 'no user logged in') {
        setLoggedIn(false);
      }
      else {
        setLoggedIn(true);
        if ("userID" in res){
          setStudent(true);
        }
        else {
          setStudent(false);
        }
      }
    }
    checkLogin();
  }, []);

  const canvasStyle = {
    border: '0'
  };

  const [strokeColor, setColor] = useState("black");
  const canvas = useRef(null);
  const [stillCorrect, updateCorrectness] = useState(true);
  const [message, updateMessage] = useState("Get started by writing equations with the cursor.");
  const upload_canvas = async () => {
    let imageUri = await canvas.current.exportImage("jpg");
    let img = new FormData();
    img.append('file', imageUri );
    img.append('uri', true);
    console.log(imageUri);
    let res = await fetch("http://localhost:3000/api/upload", {
      method:"POST",
      body:img,
      credentials:'include',
    });
    res = await res.json();
    console.log(res)
    res = sort_by_key(res, "step");
    const anchor = res[0]["solution"];
    let res_bool = true;
    let res_str = success_messages[Math.floor((Math.random()*success_messages.length))];
    for (let i = res.length - 1; i >= 1; i--){
      if (!(res[i]["solution"] === anchor)){
        res_str = "Sorry, looks like there's a mistake on line " + (i + 1);
        res_bool = false;
      }
    }
    updateCorrectness(res_bool);
    updateMessage(res_str);
  }
  const use_pencil = () => {
    canvas.current.eraseMode(false);
  }
  const use_eraser = () => {
    canvas.current.eraseMode(true);
  }
  const canvas_clear = () => {
    canvas.current.clearCanvas();
  }
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.code == "KeyE"){
        use_eraser();
      }else if (e.code == "KeyB"){
        use_pencil();
      }else if (e.code == "KeyC"){
        upload_canvas();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    // clean up
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  return (
    <>
      <nav>
        <div class="max-w-screen-xl flex flex-row-reverse flex-wrap items-center justify-between mx-auto p-1">
          <ul class="font-medium flex-row-reverse flex-col p-1 mt-4">
            { !isLoggedIn ? (<li><a href="/auth" class="block text-gray-900 hover:text-gray-500 bg-transparent">Login</a></li>):(<span></span>)}
            { isStudent&&isLoggedIn ? (<li><a href="/student/dashboard" class="block text-gray-900 hover:text-gray-500 bg-transparent">Dashboard</a></li>):(<span></span>)}
            { !isStudent&&isLoggedIn ? (<a href="/teacher/dashboard" class="block text-gray-900 hover:text-gray-500 bg-transparent">Dashboard</a>) : (<span></span>)}
          </ul>
        </div>
      </nav>
      <div className="h-full w-full absolute mt-0 z-20">
         <ReactSketchCanvas
          style={canvasStyle}
          strokeWidth={4}
          strokeColor={strokeColor}
          ref={canvas}
          canvasColor="transparent"
        />       
      </div>
      <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#96ade9d3_1px,transparent_1px),linear-gradient(to_bottom,#96ade9d3_1px,transparent_1px)] bg-[size:24px_24px] h-lvh w-lvw -z-10 fixed" />
      <main className="flex min-h-screen flex-col items-center p-24 pt-0 z-10 text-black">
        <h1 class="text-gray-500 mt-12 font-light text-8xl">
          Automathic
        </h1>
        <div className="flex flex-row items-center">
          <span className={`flex w-2.5 h-2.5 rounded-full me-1.5 flex-shrink-0 ${ (stillCorrect) ? 'bg-green-500':'bg-red-500'} `} />
          <p>{message}</p>
        </div>
        <div className="grid text-center mt-6 lg:max-w-3xl lg:w-full lg:mb-0 z-30 lg:grid-cols-4 lg:text-left pointer-events-auto">
          <div className="cursor-pointer z-20"
            onClick={()=>{use_pencil();}}>
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors text-left"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Draw{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 -mt-2.5 text-sm opacity-50`}>
              Draw out your work.
            </p>
          </a>
          </div>

          <div className="cursor-pointer z-20"
            onClick={()=>{upload_canvas();}}
          >
            <a
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                Check{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`-mt-2.5 max-w-[30ch] text-sm opacity-50`}>
                Then have it automatically checked!
              </p>
            </a>
          </div>

          <div className="cursor-pointer z-20"
            onClick={()=>{use_eraser();}}
          >
            <a
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                Erase{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`-mt-2.5 max-w-[30ch] text-sm opacity-50`}>
                Erase your mistakes and try again!
              </p>
            </a>
          </div>

          <div className="cursor-pointer z-20"
            onClick={()=>{canvas_clear();}}
          >
            <a
              className="group rounded-lg border border-transparent px-5 py-4 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold`}>
                Clear{" "}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                  -&gt;
                </span>
              </h2>
              <p className={`-mt-2.5 max-w-[30ch] text-sm opacity-50`}>
                Clear the canvas to start a new problem!
              </p>
            </a>
          </div>
        </div>
      </main>


    </>
  );
}
