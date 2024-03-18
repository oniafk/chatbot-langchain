/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push(/typeorm/);
      config.externals.push(/react-native-sqlite-storage/);
      config.externals.push(/@sap\/hana-client\/extension\/Stream/);
    }

    return config;
  },
};

export default nextConfig;
