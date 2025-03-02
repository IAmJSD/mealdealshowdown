import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "ui.assets-asda.com",
            },
            {
                hostname: "images.ctfassets.net",
            },
            {
                hostname: "digitalcontent.api.tesco.com",
            },
        ],
    },
};
export default nextConfig;
