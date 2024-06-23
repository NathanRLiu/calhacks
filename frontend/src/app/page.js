'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas';

export default function Home() {
  const [strokeColor, setColor] = useState("black");
  const canvas = useRef(null);
  useEffect(() => {
    const keyDownHandler = (e) => {
      if (e.code == "KeyE"){
        canvas.current.eraseMode(true);
      }else if (e.code == "KeyB"){
        canvas.current.eraseMode(false);
      }else if (e.code == "KeyC"){
        const img = canvas.current.exportImage("jpg");
        let f = new FormData();
        f.append("file", img);
        fetch("https://localhost:8000/", {
          method:"POST",
          body:""
        });

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
      <div className="h-full w-full absolute mt-0 z-50">
         <ReactSketchCanvas
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

        <div className="grid text-center mt-6 lg:max-w-3xl lg:w-full lg:mb-0 lg:grid-cols-2 lg:text-left">
          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors text-right"
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

          <a
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                &lt;-
              </span>
              {" "}Check
            </h2>
            <p className={`-mt-2.5 max-w-[30ch] text-sm opacity-50`}>
              Then have it automatically checked!
            </p>
          </a>
        </div>
      </main>


    </>
  );
}
