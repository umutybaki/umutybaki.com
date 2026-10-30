/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'umutybaki-com',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: { region: 'us-east-1' },
      },
    }
  },
  async run() {
    const attendance = new sst.aws.Dynamo('AttendanceQR', {
      fields: { pk: 'string', sk: 'string' },
      primaryIndex: { hashKey: 'pk', rangeKey: 'sk' },
      ttl: 'expires',
    })
    const feed = new sst.aws.Function('AttendanceQRBackend', {
      runtime: 'go',
      handler: 'backend/attendance-qr',
      timeout: '10 seconds',
      memory: '256 MB',
      environment: { TABLE_NAME: attendance.name },
      permissions: [
        {
          actions: [
            'dynamodb:GetItem',
            'dynamodb:PutItem',
            'dynamodb:UpdateItem',
            'dynamodb:Query',
          ],
          resources: [attendance.arn],
        },
      ],
      url: {
        cors: {
          allowOrigins: $dev
            ? ['http://localhost:3000']
            : ['https://umutybaki.com', 'https://www.umutybaki.com'],
          allowMethods: ['POST'],
          allowHeaders: ['content-type', 'authorization'],
        },
      },
    })
    const site = new sst.aws.Nextjs('Web', {
      environment: { NEXT_PUBLIC_ATTENDANCE_QR_API_URL: feed.url },
    })

    return {
      url: site.url,
      attendanceQrApi: feed.url,
    }
  },
})
