/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://dev-ec2.compaira.com:8181/:path*",
      },
    ];
  },
};

module.exports = nextConfig
