help: ## Show help for main targets
	@$(MAKE) --no-print-directory help-generate HELP_ANCHOR=##

help-full: ## Show help for all targets
	@$(MAKE) --no-print-directory help-generate HELP_ANCHOR=#

help-generate:
	@grep -E -h "$(MAKE_TARGET_REGEX).*?$(HELP_ANCHOR)" $(MAKEFILE_LIST) \
	| sort \
	| awk -v width=38 'BEGIN {FS = ":.*?##? "} {printf "\033[36m%-*s\033[0m %s\n", width, $$1, $$2}'
