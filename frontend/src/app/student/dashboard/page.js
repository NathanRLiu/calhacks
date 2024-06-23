'use client'
import Image from "next/image";
import { useEffect, useState, useRef } from 'react'
import { ReactSketchCanvas } from 'react-sketch-canvas';

export default function Home() {
  const [isStudent, makeStudent] = useState(true);
  const [assignments, updateAssignments] = useState([
    {
      "latest_submission_id":"39ff9ed116c3",
      "created_at":Date.now,
      "file_name":"blah.png",
      "correct":true,
      "student_name":"Nate",
      "assignment_title":"Hw #1",
    },
    {
      "latest_submission_id":"93ffc3ee83ba",
      "created_at":Date.now,
      "file_name":"blah2.png",
      "correct":false,
      "student_name":"Nate",
      "assignment_title":"Hw #2",
    } 
  ])
  return (
    <>
      <div className="bg-gradient-to-b w-screen -z-10 h-screen fixed from-gray-300 to-gray-200" />
      <main className=" p-24 z-10 text-black w-screen h-screen flex flex-col items-center">
        <div className="bg-gray-100 absolute w-5/6 h-2/3 p-6 px-0 rounded-md ">
          <h1 className="text-gray-700 text-left font-semibold ml-6 mb-6 text-black text-3xl">{isStudent?"Student":"Teacher"} Dashboard </h1>
            <div class="relative overflow-x-auto sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                              Submission ID
                            </th>
                            <th scope="col" class="px-6 py-3">
                              Assignment Title
                            </th>
                            <th scope="col" class="px-6 py-3">
                              Score
                            </th>
                            <th scope="col" class="px-6 py-3">
                              Submission Time
                            </th>
                            <th scope="col" class="px-6 py-3">
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                      {
                        (assignments.map((submission, index) => (
                          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                              <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {submission.latest_submission_id}
                              </th>
                              <td class="px-6 py-4">
                                {submission.assignment_title}
                              </td>
                              <td class="px-6 py-4">
                                {submission.correct?"100%":"70%"}
                              </td>
                              <td class="px-6 py-4">
                                {submission.created_at}
                              </td>
                              <td class="flex items-center px-6 py-4">
                                  <a href="#" class="font-medium text-center text-cyan-500 dark:text-blue-500 hover:underline ms-3">Resubmit</a>
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
