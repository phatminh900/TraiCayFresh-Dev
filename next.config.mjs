/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
			},
			// TODO: UPDATE LAter
		],
	},
    experimental:{
        missingSuspenseWithCSRBailout:false
    }
}
;

export default nextConfig;
