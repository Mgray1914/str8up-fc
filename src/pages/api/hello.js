// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// import type { NextApiRequest, NextApiResponse } from "next";

// type Data = {
//   name: string;
// };

export default async function handler(
  req,
  res
) {
      const response = await fetch('http://localhost:3000/api/hii');
      const data = await response.json();
      res.status(200).json({message:"Got data from api", data})

  // res.status(200).json({ name: "John Doe" });

}
