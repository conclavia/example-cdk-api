import { CfnOutput, Construct, RemovalPolicy, Stack } from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

type DatabaseConstructProps = {
  keyName: string;
  tableName: string;
};

export default class DatabaseConstruct extends Construct {
  readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props: DatabaseConstructProps) {
    super(scope, id);

    const { keyName, tableName } = props;

    const stack = Stack.of(this);

    this.table = new dynamodb.Table(this, 'Table', {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: keyName, type: dynamodb.AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName,
    });

    new CfnOutput(stack, 'TableName', {
      value: this.table.tableName,
    });

    new CfnOutput(stack, 'TableArn', {
      value: this.table.tableArn,
    });
  }
}
