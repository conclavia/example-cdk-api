# example-cdk-api

Demonstrates infrastructure for building, running and deploying a simple API in AWS using GNU Make and the AWS CDK.

## Developing locally

1. Provision local resources using localstack.

```
make local
```

2. Run the API locally.

```
make local-api
```

3. In another window, run the smoke tests against your local API.

```
make local-smoke
```

4. Tear down the local resources.

```
make local-destroy
```

## Configuring

Environment variable configuration is managed using `.env` files in the root of the repository. As these are parsed using `make`, standard Makefile substitution syntax can be used to compose variables.

Each individual environment is managed using a file named `.env.(name)`, e.g. `.env.dev` for the `dev` environment.

The top-level `.env` file (without a suffix) provides default values that will be used in all environments. These can be overridden for a specific environment using that environments `.env.(name)` file.

All Makefile variables are exported automatically and available to child processes (e.g. the CDK).

## Tagging

AWS resource tags can be supplied using the `tags/tags.env` file. Any `make` variables in the file will be resolved automatically and the tags will be applied to each stack, propagating down to individual resources where possible.

## Deploying

1. Update the `HOSTED_ZONE_NAME` value in the default environment file (`.env`) with a **Route 53** hosted zone configured in your account.

```
HOSTED_ZONE_NAME=mydomain.example.com
```

2. Run the default target to lint, test, build, deploy and run smoke tests.

```
make
```

3. Tear down the deployed resources.

```
make destroy
```

## Getting help

Print all available commands.

```
make help
```
