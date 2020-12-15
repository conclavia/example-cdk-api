logs-%: ## Show the logs for a Lambda function, e.g. make logs-api
	$(eval LAMBDA_FUNCTION_NAME := $(CORE_STACK)-$*)
	awslogs get -s 1m -S -G -w /aws/lambda/$(LAMBDA_FUNCTION_NAME) \
		| npx pino-pretty --translateTime SYS:standard

sleep-%: # Sleep for n seconds, e.g. make sleep-5
	sleep $*
