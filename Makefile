develop:
	npx webpack serve
build:
	NODE_ENV=production npx webpack
start:
	npm start
install:
	npm ci
lint:
	npx eslint --fix