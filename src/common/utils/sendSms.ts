import { ConfigService } from '@nestjs/config';
import SMSClient from '@alicloud/sms-sdk';

//发送短信

export const sendSMS = (phone: string, code: string, type: string, config: ConfigService) => {
  const smsClient = new SMSClient({
    accessKeyId: config.get<string>('app.aliyunSendSms.accessKeyId'),
    secretAccessKey: config.get<string>('app.aliyunSendSms.secretAccessKey'),
  });
  const TemplateCode = config.get<string>('app.aliyunSendSms.templateCode') || {};
  return smsClient
    .sendSMS({
      PhoneNumbers: phone,
      SignName: config.get<string>('app.aliyunSendSms.signName'),
      TemplateCode: TemplateCode[`${type}`],
      TemplateParam: `{"code":${code}}`,
    })
    .then(
      function (res) {
        const { Code, Message } = res;
        return {
          Code,
          Message,
        };
      },
      function (err) {
        return {
          Code: err.data.Code,
          Message: err.data.Message,
        };
      }
    );
};

module.exports = {
  sendSMS,
};
