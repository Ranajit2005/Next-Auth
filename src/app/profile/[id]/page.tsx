// This is the dynamic route page and it writes [anything_folder_name] and inner we write page.tsx . Here we can get the dynamic route value by using the params object.

import React from 'react'

export default function page({params}:any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <h1>Profile Details Page</h1>

      <h2 className="py-3 px-3 bg-green-500 rounded text-black">{params.id}</h2>  {/* Here we give params.id beacuse id is the folder name and params is the object which is given by the next js. */}
      
    </div>
  )
}
