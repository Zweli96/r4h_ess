// frontend/app/api/proxy/[...path]/route.js
import { NextResponse } from "next/server";

async function handler(request, { params }) {
  const { path } = params; // Capture dynamic path segments
  const backendUrl = `${process.env.NEXTAUTH_BACKEND_URL}${
    path ? path.join("/") : ""
  }${request.url.includes("?") ? "?" + request.url.split("?")[1] : ""}`;

  // Parse body for non-GET/HEAD requests
  let body;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      body = await request.json();
    } catch (error) {
      console.error("Body parsing error:", error);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }
  }

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        ...Object.fromEntries(request.headers), // Convert Headers to object
        host: undefined, // Prevent sending client-side host
        "content-type":
          request.headers.get("content-type") || "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Export the handler for all HTTP methods
export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
export const HEAD = handler;
