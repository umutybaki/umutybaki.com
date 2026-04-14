/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "umutybaki-com",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        aws: { region: "us-east-1" },
      },
    }
  },
  async run() {
    const site = new sst.aws.StaticSite("Web", {
      build: {
        command: "pnpm build",
        output: "out",
      },
      // Uncomment and set your domain once it's pointed to Route 53:
      // domain: "umutybaki.com",
    })

    return {
      url: site.url,
    }
  },
})