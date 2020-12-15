ARTEFACT_DIRECTORY := $(PROJECT_ROOT)/output
BUILD_DIRECTORY := $(ARTEFACT_DIRECTORY)/build
PACKAGE_DIRECTORY := $(ARTEFACT_DIRECTORY)/package

build: clean ## Compile and package the code
	npx webpack --config webpack.config.js

clean: ## Clean up the project artefacts
	rm -rf $(ARTEFACT_DIRECTORY)

lint: ## Lint the code
	npx eslint .

test: ## Run unit tests
	npx jest
