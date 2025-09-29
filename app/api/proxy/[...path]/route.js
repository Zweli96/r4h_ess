import { NextResponse } from "next/server";

async function handler(request, { params }) {
  const { path } = params; // Capture dynamic path segments
  const query = request.url.includes("?")
    ? `?${request.url.split("?")[1]}`
    : "";

  // Log original request details
  console.log(
    `Proxy: Original request URL: ${request.url}, Method: ${request.method}`
  );
  console.log(`Proxy: Path segments:`, path);

  // Construct backend URL, forcing trailing slash for non-GET/HEAD
  const pathString = path ? path.join("/") : "";
  const needsTrailingSlash = ["PUT", "POST", "PATCH", "DELETE"].includes(
    request.method
  );
  const backendUrl = `${process.env.NEXTAUTH_BACKEND_URL}${pathString}${
    needsTrailingSlash ? "/" : ""
  }${query}`;

  console.log(`Proxy: Constructed backend URL: ${backendUrl}`);

  // Parse body for non-GET/HEAD requests
  let body;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        body = await request.json();
        console.log(`Proxy: Request body:`, body);
      } catch (error) {
        console.error("Body parsing error:", error);
        return NextResponse.json(
          { error: "Invalid JSON body" },
          { status: 400 }
        );
      }
    } else {
      // Optionally log or skip body parsing for non-JSON
      console.log("Skipping body parsing for content-type:", contentType);
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

    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // Treat as JSON by default if content-type is missing
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    } else {
      // Handle binary (blob) response
      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        status: response.status,
        headers: {
          "content-type": contentType,
          "content-disposition":
            response.headers.get("content-disposition") || "",
        },
      });
    }
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
