import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { root, files, destination } = await request.json();

    // For Pterodactyl, we need to move files one by one
    // The endpoint expects a single file to be moved at a time
    const moveResults = [];

    for (const file of files) {
      try {
        const res = await axios.put(
          `https://panel.arcticverse.in/api/client/servers/430de4da/files/rename`,
          {
            root: root,
            files: [file], // Single file array
            to: `${destination}/${file}`, // Destination path with filename
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PTERO_TOKEN}`,
              Accept: "Application/vnd.pterodactyl.v1+json",
              "Content-Type": "application/json",
            },
          }
        );
        moveResults.push({ file, success: true, data: res.data });
      } catch (error: any) {
        console.error(`Error moving file ${file}:`, error.response?.data || error.message);
        moveResults.push({ 
          file, 
          success: false, 
          error: error.response?.data || error.message 
        });
      }
    }

    // Check if all moves were successful
    const allSuccessful = moveResults.every(result => result.success);
    
    if (!allSuccessful) {
      const failedFiles = moveResults.filter(r => !r.success).map(r => r.file);
      return NextResponse.json(
        { 
          error: "Some files failed to move",
          failedFiles,
          details: moveResults
        }, 
        { status: 207 } // 207 Multi-Status
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: `Successfully moved ${files.length} file(s)`,
      results: moveResults 
    });

  } catch (error: any) {
    console.error("Move API Error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to move files" }, 
      { status: 500 }
    );
  }
}