'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'

const success_messages = ["Full Marks", "100%"]

function sort_by_key(array, key)
{
  return array.sort(function(a, b)
  {
    var x = a[key]; var y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}

function validateResponse(response) {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

export default function Home() {
  const [stillCorrect, updateCorrectness] = useState(true);
  const [message, updateMessage] = useState("Fetching feedback from the server...");
  const [assignmentName, setName] = useState("Assignment")

  const [image, setImage] = useState("");

  const params = useParams()
  const get_id = () => (params.id)
  useEffect(() => {
    const getSubmission = async() => {
      const result = await fetch("http://localhost:3000/api/submissions/byID/" + get_id(), {credentials: 'include'});
      let res = await result.json();
      let real_name = res["assignment_name"];
      res = sort_by_key(res.stepChecks, "step");
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
      setName(real_name);
      updateMessage(res_str);
    }
    getSubmission();
    const getImage = async() => {
      fetch("http://localhost:3000/api/submissions/getImage/" + get_id(), {credentials: 'include'})
        .then(validateResponse)
        .then(response => response.blob())
        .then(blob => {
            setImage( URL.createObjectURL(blob))
        })
    }
    getImage();
  }, [])

  return (
    <>
      <div className="bg-gradient-to-b w-screen -z-10 h-screen fixed from-gray-300 to-gray-200" />
      <main className=" p-24 z-10 text-black w-screen h-screen flex flex-col items-center">
        <div className="bg-gray-100 absolute w-5/6 h-2/3 p-6 px-0 rounded-md ">
          <h1 className="text-gray-700 text-left font-semibold ml-6 mb-6 text-black text-3xl">{assignmentName} Details</h1>
          <div className="flex flex-row items-center">
            <span className={`flex w-2.5 h-2.5 rounded-full ml-7 me-1.5 flex-shrink-0 ${ (stillCorrect) ? 'bg-green-500':'bg-red-500'} `} />
            <p>{message}</p>
          </div>
          <Image src={image} width={400} height={400}/>
        </div>
      </main>


    </>
  );
}
