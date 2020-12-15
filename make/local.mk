LOCALSTACK_CONTAINER := localstack
LOCALSTACK_SERVICES := dynamodb
LOCALSTACK_PORT := 4566
LOCALSTACK_ENDPOINT := http://localhost:$(LOCALSTACK_PORT)
AWS_LOCAL := aws --endpoint-url=$(LOCALSTACK_ENDPOINT)

LOCAL_TABLE_NAME := local-messages

local: local-env local-destroy ## Stand up a local development environment
	docker run -d --rm \
			--name $(LOCALSTACK_CONTAINER) \
			-p $(LOCALSTACK_PORT):$(LOCALSTACK_PORT) \
			-e SERVICES=$(LOCALSTACK_SERVICES) \
			localstack/localstack

	@echo
	@echo "Waiting for localstack to start"
	@until docker logs $(LOCALSTACK_CONTAINER) 2> /dev/null | grep "^Ready.$$" > /dev/null 2>&1; \
		do printf "." && sleep 1; \
	done
	@echo
	@echo "localstack is now running"

	$(AWS_LOCAL) dynamodb create-table \
		--table-name $(LOCAL_TABLE_NAME) \
		--attribute-definitions AttributeName=id,AttributeType=S \
		--key-schema AttributeName=id,KeyType=HASH \
		--billing-mode PAY_PER_REQUEST

local-api: local-env ## Run the API locally
	npx tsnd src/api/api.local.ts \
		| npx pino-pretty --translateTime SYS:standard

local-destroy: ## Stop the local development environment
	docker stop $(LOCALSTACK_CONTAINER) 2> /dev/null || true

local-env: # Configure environment variables for connecting to local development resources
	$(eval NODE_ENV := development)
	$(eval AWS_ACCESS_KEY_ID := local)
	$(eval AWS_SECRET_ACCESS_KEY := local)
	$(eval TABLE_NAME := $(LOCAL_TABLE_NAME))
	$(eval API_URL := http://localhost:3000)

local-smoke: local-env smoke ## Run smoke tests against the locally running API
