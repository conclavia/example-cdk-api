STACK_PREFIX = $(ENV)-$(APPLICATION_NAME)

CORE_STACK = $(STACK_PREFIX)-core

TAGS_INPUT_FILE := $(PROJECT_ROOT)/tags/tags.env
TAGS_OUTPUT_FILE := $(ARTEFACT_DIRECTORY)/tags.env

TABLE_NAME = $(STACK_PREFIX)-messages

API_URL = https://$(API_DOMAIN_NAME)

deploy: tags ## Deploy all resources to AWS
	npx cdk deploy --require-approval never "*"

describe-stack: # List outputs for a specific stack, e.g. make describe-stack STACK_NAME=...
	@aws cloudformation describe-stacks \
		--stack-name $(STACK_NAME) \
		--query "Stacks[0].Outputs[*].[OutputKey,OutputValue]" \
		--output table \
	| sed s/DescribeStacks/$(STACK_NAME)/

destroy: ## Clean up the resources in AWS
	npx cdk destroy --force "*"

destroy-%: # Clean up a specific stack in AWS, e.g. make destroy-core
	npx cdk destroy --force "$(STACK_PREFIX)-$*"

diff: # Show differences between CDK app and deployed resources
	npx cdk diff

smoke: ## Execute smoke tests against the deployed environment
	http $(API_URL)/messages text=hello
	http $(API_URL)/messages

stacks: ## List all stacks and their outputs
	@npx cdk list 2>/dev/null \
	| xargs -L 1 -I '{}' \
		$(MAKE) --no-print-directory describe-stack STACK_NAME={}

synth-%: # Generate the CloudFormation template for a stack, e.g. make synth-core
	npx cdk synth "$(STACK_PREFIX)-$*"

tags: # Resolve and generate tags for AWS resources
	@mkdir -p $(ARTEFACT_DIRECTORY)
	$(eval RESOLVED_TAGS := $(shell cat $(TAGS_INPUT_FILE) | tr '\n' '|'))
	@printf '$(RESOLVED_TAGS)' | tr '|' '\n' > $(TAGS_OUTPUT_FILE)
