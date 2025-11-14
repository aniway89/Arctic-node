import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { root, files, archiveName } = await request.json();

    const res = await axios.post(
      `https://panel.arcticverse.in/api/client/servers/430de4da/files/compress`,
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

    // If archiveName is provided, try to rename the created archive
    if (archiveName && res.data.attributes?.name) {
      try {
        const renameRes = await axios.put(
          `https://panel.arcticverse.in/api/client/servers/430de4da/files/rename`,
          {
            root,
            files: [res.data.attributes.name],
            to: archiveName,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PTERO_TOKEN}`,
              Accept: "Application/vnd.pterodactyl.v1+json",
              "Content-Type": "application/json",
            },
          }
        );
        return NextResponse.json(renameRes.data);
      } catch (renameError) {
        // If rename fails, still return the original compression result
        console.error("Rename failed:", renameError);
        return NextResponse.json(res.data);
      }
    }

    return NextResponse.json(res.data);
  } catch (error: any) {
    console.error("Compress API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to compress files" }, 
      { status: 500 }
    );
  }
}