import { App, Stack, StackProps } from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';

import ApiConstruct from '../api/api.cdk';
import DatabaseConstruct from '../database/database.cdk';

type CoreStackProps = StackProps & {
  apiCorsAllowedOrigins: string[];
  apiDomainName: string;
  hostedZoneName: string;
  packageDirectory: string;
  tableName: string;
};

export default class CoreStack extends Stack {
  constructor(scope: App, id: string, props: CoreStackProps) {
    const {
      apiCorsAllowedOrigins,
      apiDomainName,
      hostedZoneName,
      packageDirectory,
      tableName,
      ...stackProps
    } = props;

    super(scope, id, stackProps);

    const { table } = new DatabaseConstruct(this, 'MessagesTable', {
      keyName: 'id',
      tableName,
    });

    new ApiConstruct(this, 'Api', {
      apiCorsAllowedOrigins,
      apiDomainName,
      hostedZone: route53.HostedZone.fromLookup(this, 'HostedZone', {
        domainName: hostedZoneName,
      }),
      packageDirectory,
      table,
    });
  }
}
