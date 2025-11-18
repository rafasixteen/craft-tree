/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	env: Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))),
};

module.exports = nextConfig;
