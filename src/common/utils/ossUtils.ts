import OSS from 'ali-oss';
import crypto from 'crypto';
import { Buffer } from 'buffer';
import config from '@/config/index';

const client = new OSS({
  region: config().oss?.ossRegion,
  accessKeyId: config().oss?.ossKeyId,
  accessKeySecret: config().oss?.ossKeySecret,
  bucket: config().oss?.ossBucket,
});

export const getSignatureUrl = (id: string, timeoutSeconds: number): string => {
  return client.signatureUrl(id, {
    expires: timeoutSeconds,
    method: 'GET',
    response: {
      'content-disposition': 'inline',
    },
  });
};

const sha1Base64 = (str: string) =>
  crypto.createHmac('sha1', config().oss?.ossKeySecret).update(str).digest().toString('base64');

const md5Base64 = (str: string) =>
  crypto.createHmac('md5', '').update(str).digest().toString('base64');

const base64 = (str: string) => Buffer.from(str).toString('base64');

export const getCallback = (): GetCallbackReturnType => {
  const callbackObj = {
    callbackUrl: config().oss?.ossCallbackUrl,
    callbackBody:
      '{"user_id":${x:user_id},"file_id":${object},"bucket":${bucket},"object":${object},"etag":${etag},"size":${size},"mimeType":${mimeType},"imageInfo":${imageInfo}}', // eslint-disable-line
    callbackBodyType: 'application/json',
  };
  const callbackBase64 = base64(JSON.stringify(callbackObj));

  return { callbackObj, callbackBase64 };
};

export const getPolicy = (
  key: string,
  callbackBase64: string,
  expireInSeconds?: number
): GetPolicyReturnType => {
  if (!key) {
    throw new Error('object key is required!');
  }
  const now = new Date();
  const policyObj = {
    expiration: new Date(now.getTime() + (expireInSeconds || 30 * 1000)).toISOString(),
    conditions: [
      { bucket: config().oss?.ossBucket },
      { callback: callbackBase64 },
      ['content-length-range', 0, config().oss?.imageMaxSize], // <5m
      ['eq', '$key', key],
    ],
  };
  const policyBase64 = Buffer.from(JSON.stringify(policyObj)).toString('base64');

  const policySignature = sha1Base64(policyBase64);

  return { policyObj, policyBase64, policySignature };
};

export const getSignature = (
  verb: string,
  contentObj: any,
  contentType: string,
  objectKey: any,
  timeoutSeconds: number
): GetSignatureReturnType => {
  // not well tested yet
  let authString = `${verb.toUpperCase()}\n`;
  if (contentObj) {
    // branch not tested yet
    const contentMd5 = md5Base64(JSON.stringify(contentObj));
    authString += `${contentMd5}`;
  }
  authString += '\n'; // add new line no matter if there is or no content
  if (contentType) {
    // branch not tested yet
    authString += `${contentType}`;
  }
  authString += '\n'; // add new line no matter if there is or no content
  const expires = new Date().getTime() + timeoutSeconds * 1000;
  authString += `${expires}\n`;
  authString += `/${config().oss?.ossBucket}/${objectKey}`;

  const authSignature = sha1Base64(authString);

  return {
    OSSAccessKeyId: config().oss.ossKeyId,
    Expires: expires,
    Signature: encodeURI(authSignature),
  };
};

/* exports */
type GetPolicyReturnType = {
  policyObj: any;
  policyBase64: string;
  policySignature: string;
};
type GetSignatureReturnType = {
  OSSAccessKeyId: string;
  Expires: number;
  Signature: string;
};
type GetCallbackReturnType = {
  callbackObj: any;
  callbackBase64: string;
};
