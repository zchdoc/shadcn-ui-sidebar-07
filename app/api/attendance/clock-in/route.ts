import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const sn = req.nextUrl.searchParams.get("sn");
  const table = req.nextUrl.searchParams.get("table");
  const Stamp = req.nextUrl.searchParams.get("Stamp");
  const { data } = await req.json();

  console.log("Query Params:", { sn, table, Stamp });
  console.log("Request Body:", { data });

  const serverUrl = "http://127.0.0.1:8081";
  const url = `${serverUrl}/iclock/attDataCustom?sn=${sn}&table=${table}&Stamp=${Stamp}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    let result;
    console.info('contentType:', contentType);
    
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Internal server error", error: error.message },
        { status: 500 }
      );
    } else {
      return NextResponse.json(
        { message: "Internal server error", error: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
