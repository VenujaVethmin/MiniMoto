"use client";

import useSession from "@/lib/session";
import React from "react";


const Page = () => {
 
const {user} = useSession();

  return (
    <div>
      <h1>hi</h1>

      <p>{process.env.NEXT_PUBLIC_BACKEND_URL}</p>
     {user?.email}
    </div>
  );
};

export default Page;
