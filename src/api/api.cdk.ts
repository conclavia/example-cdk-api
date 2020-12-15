import { CfnOutput, Construct, Duration, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as apiGateway from '@aws-cdk/aws-apigatewayv2';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as integrations from '@aws-cdk/aws-apigatewayv2-integrations';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

import { resolve } from 'path';

type ApiConstructProps = {
  apiCorsAllowedOrigins: string[];
  apiDomainName: string;
  hostedZone: route53.IHostedZone;
  packageDirectory: string;
  table: dynamodb.Table;
};

export default class ApiConstruct extends Construct {
  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    const { apiCorsAllowedOrigins, apiDomainName, hostedZone, packageDirectory, table } = props;

    const stack = Stack.of(this);

    const func = new lambda.Function(this, 'ApiFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset(resolve(packageDirectory, 'api.zip')),
      environment: {
        TABLE_NAME: table.tableName,
      },
      handler: 'api.handler',
      functionName: `${stack.stackName}-api`,
    });

    table.grantReadWriteData(func);

    new logs.LogGroup(this, 'ApiFunctionLogs', {
      logGroupName: `/aws/lambda/${func.functionName}`,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    const customDomainName = new apiGateway.DomainName(stack, 'DomainName', {
      domainName: apiDomainName,
      certificate: new acm.Certificate(this, 'Certificate', {
        domainName: apiDomainName,
        validation: acm.CertificateValidation.fromDns(hostedZone),
      }),
    });

    new apiGateway.HttpApi(this, 'HttpApi', {
      corsPreflight: {
        allowHeaders: ['Authorization'],
        allowMethods: [
          apiGateway.HttpMethod.GET,
          apiGateway.HttpMethod.HEAD,
          apiGateway.HttpMethod.OPTIONS,
          apiGateway.HttpMethod.POST,
        ],
        allowOrigins: apiCorsAllowedOrigins,
        maxAge: Duration.days(10),
      },
      defaultDomainMapping: {
        domainName: customDomainName,
      },
      defaultIntegration: new integrations.LambdaProxyIntegration({ handler: func }),
    });

    new route53.ARecord(this, 'DnsRecord', {
      recordName: apiDomainName,
      zone: hostedZone,
      target: route53.RecordTarget.fromAlias(new targets.ApiGatewayv2Domain(customDomainName)),
    });

    new CfnOutput(stack, 'ApiFunction', {
      value: func.functionName,
    });

    new CfnOutput(stack, 'ApiEndpoint', {
      value: `https://${apiDomainName}`,
    });
  }
}
