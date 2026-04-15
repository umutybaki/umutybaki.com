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
    const site = new sst.aws.Nextjs("Web", {
      domain: {
        name: "umutybaki.com",
        dns: false,
      },
    })

    return {
      url: site.url,
    }
  },
})