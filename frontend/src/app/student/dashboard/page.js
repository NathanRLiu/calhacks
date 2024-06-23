'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from 'react'

export default function Home() {
  const [isStudent, makeStudent] = useState(true);
  const [assignments, updateAssignments] = useState([])
  const [trynaUpload, meUpload] = useState(false);
  const [assignmentInQuestion, theAssignmentInQuesstionIs] = useState("");

  useEffect(() => {
    const getSubmissions = async() => {
      const url = "http://localhost:3000/api/login";
      const response = await fetch(url, {method: "GET", credentials: "include"});
      const res = await response.json();
      if (!("userID" in res)) {
        window.location.href = "/auth";
        return;
      }
      const result = await fetch("http://localhost:3000/api/getAssignments", {credentials: 'include'});
      const data = await result.json();
      console.log(data);
      const mySubmissionsResult = await fetch("http://localhost:3000/api/submissions/yours", {credentials: 'include'});
      const mySubmissions = await mySubmissionsResult.json();
      for (const submission of mySubmissions) {
        for (const assignment of data) {
          if (submission.assignment_id==assignment._id) {
            assignment['submission'] = submission._id;
            assignment['submittedAt'] = submission.createdAt;
          }
        }
      }
      updateAssignments(data);
    }
    getSubmissions();
  }, [])

  return (
    <>
      {
        trynaUpload && 
          <div className="w-full h-full fixed z-20 flex flex-col justify-center pointer-events-none">
            <div className="bg-white p-6 text-center w-1/3 m-auto rounded-md pointer-events-auto">

              <div class="flex items-center justify-center w-full">
                  <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div class="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg class="w-8 h-8 mb-4 text-gray-500 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                          </svg>
                          <p class="mb-2 text-sm text-gray-500 "><span class="font-semibold">Click to upload</span> or drag and drop</p>
                          <p class="text-xs text-gray-500 ">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                      </div>
                      <input id="dropzone-file" type="file" class="hidden" />
                  </label>
              </div> 

            </div>
          </div>
      }
      {
        trynaUpload && 
        <div className="w-screen h-screen backdrop-blur-[2px] bg-[#10101033] z-10 fixed " onClick={()=>{meUpload(false)}}>
        </div>
      }
      <div className="bg-gradient-to-b w-screen -z-10 h-screen fixed from-gray-300 to-gray-200" />
      <main className=" p-24 z-10 text-black w-screen h-screen flex flex-col items-center">
        <div className="bg-gray-100 absolute w-5/6 h-2/3 p-6 px-0 rounded-md ">
          <h1 className="text-gray-700 text-left font-semibold ml-6 mb-6 text-black text-3xl">Student Dashboard </h1>
            <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 ">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" class="px-6 py-4">
                              Assignment Title
                            </th>
                            <th scope="col" class="px-6 py-4">
                              Score
                            </th>
                            <th scope="col" class="px-6 py-4">
                              Submission Time
                            </th>
                            <th scope="col" class="px-6 py-4">
                              Submission
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                        (assignments.map((assignment, index) => (
                          <tr class="bg-white border-b hover:bg-gray-50">
                              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                {assignment.name}
                              </th>
                              <td class="px-6 py-4">
                                {assignment.submitted ? (assignment.correct?"100%":"70%") : "N/A"}
                              </td>
                              <td class="px-6 py-4">
                                {assignment.submittedAt || "N/A"}
                              </td>
                              <td class="flex items-center px-6 py-4">
                                  <a href="#" class="font-medium text-center text-cyan-500 hover:underline ms-3" 
                                    onClick={()=>{
                                      if (!assignment.submission) {
                                        theAssignmentInQuesstionIs(assignment._id);
                                        meUpload(true);
                                      }
                                      else window.location.href = `/review/${assignment.submission}`
                                  }}>{assignment.submission ? "View" : "Submit"}</a>
                              </td>
                          </tr>
                        )))
                      }
                    </tbody>
                </table>
            </div>
          <div class="flex">
            <a type="button" href="/" class="flex align-bottom w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">Return to Whiteboard</a>
          </div>
        </div>
      </main>


    </>
  );
}
