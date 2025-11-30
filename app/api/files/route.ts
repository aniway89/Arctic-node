// app/api/files/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const directory = searchParams.get('directory') || '/';

    const res = await axios.get(
      `https://panel.arcticnodes.io/api/client/servers/430de4da/files/list?directory=${encodeURIComponent(directory)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PTERO_TOKEN}`,
          Accept: "Application/vnd.pterodactyl.v1+json",
        },
      }
    );

    // Extract only attributes
    let files = res.data?.data?.map((item: any) => item.attributes) || [];

    // Sort: special chars → folders → files; within each, sort A–Z
    files.sort((a: any, b: any) => {
      const aSpecial = /^[^a-zA-Z0-9]/.test(a.name);
      const bSpecial = /^[^a-zA-Z0-9]/.test(b.name);

      if (aSpecial !== bSpecial) return aSpecial ? -1 : 1;
      if (a.is_file !== b.is_file) return a.is_file ? 1 : -1;
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    return NextResponse.json(files);
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 });
  }
}