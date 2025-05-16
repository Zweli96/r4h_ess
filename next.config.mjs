/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/timesheets/:path*",
  //       destination: `${process.env.NEXTAUTH_BACKEND_URL}timesheets/:path*`, // Proxy only timesheets
  //     },
  //     // Add more specific routes as needed, e.g.:
  //     // {
  //     //   source: "/api/approvals/:path*",
  //     //   destination: `${process.env.NEXTAUTH_BACKEND_URL}approvals/:path*`,
  //     // },
  //   ];
  // },
};

export default nextConfig;
