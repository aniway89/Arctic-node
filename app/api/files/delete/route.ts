import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { root, files } = await request.json();

    const res = await axios.post(
      `https://panel.arcticverse.in/api/client/servers/430de4da/files/delete`,
      {
        root,
        files,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PTERO_TOKEN}`,
          Accept: "Application/vnd.pterodactyl.v1+json",
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Delete API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to delete files" }, 
      { status: 500 }
    );
  }
}