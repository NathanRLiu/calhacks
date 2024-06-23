'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas';

export default function Home() {
  const [assignments, updateAssignments] = useState([]);
  useEffect(() => {
    const getSubmissions = async() => {
      const result = await fetch("http://localhost:3000/api/submissions/all");
      const data = await result.json();
      console.log(data);
      updateAssignments(data);
    }
    getSubmissions();
  }, [])
  return (
    <>
      <div className="bg-gradient-to-b w-screen -z-10 h-screen fixed from-gray-300 to-gray-200" />
      <main className=" p-24 z-10 text-black w-screen h-screen flex flex-col items-center">
        <div className="bg-gray-100 absolute w-5/6 h-2/3 p-6 px-0 rounded-md ">
          <h1 className="text-gray-700 text-left font-semibold ml-6 mb-6 text-black text-3xl">Teacher Dashboard </h1>
            <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 ">
                        <tr>
                            <th scope="col" class="px-6 py-4">
                              Assignment
                            </th>
                            <th scope="col" class="px-6 py-4">
                              Student
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
                        (assignments.map((submission, index) => (
                          <tr class="bg-white border-b hover:bg-gray-50 ">
                              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                                {submission.assignment_name}
                              </th>
                              <td class="px-6 py-4">
                                {submission.student_name}
                              </td>
                              <td class="px-6 py-4">
                                {submission.correct?"100%":"70%"}
                              </td>
                              <td class="px-6 py-4">
                                {submission.createdAt}
                              </td>
                              <td class="flex items-center px-6 py-4">
                                <button class="text-blue-400" onClick={()=>window.location.href=`/review/${submission._id}`}>View</button>
                              </td>
                          </tr>
                        )))
                      }
                    </tbody>
                </table>
            </div>
          <div>
            <div class="mt-3 mx-0.5 w-full">
            </div>
          </div>
        </div>
      </main>


    </>
  );
}
