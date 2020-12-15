export

# Adding "-o xtrace" will print all shell commands (useful for debugging)
SHELL := /usr/bin/env bash -o errexit -o nounset -o pipefail
.DEFAULT_GOAL := default
PROJECT_ROOT := $(shell git rev-parse --show-toplevel)
MAKE_TARGET_REGEX := ^[a-zA-Z%_-]+:

ENV ?= dev
include .env .env.$(ENV)

include $(PROJECT_ROOT)/make/*.mk

# Automatically mark all targets as .PHONY
# (since we're not using file-based targets)
.PHONY: $(shell grep -E -h "$(MAKE_TARGET_REGEX)" $(MAKEFILE_LIST) | sed s/:.*// | tr '\n' ' ')

default: lint test build deploy stacks sleep-10 smoke ## Check, test, build, deploy and verify the code

dump: ## Dump all make variables
	@$(foreach V, $(sort $(.VARIABLES)), \
		$(if $(filter-out environment% default automatic, $(origin $V)), \
			$(info $V=$($V) ($(value $V))) \
		) \
	)
	@echo > /dev/null
