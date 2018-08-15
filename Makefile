.PHONY: all version clean

VERSION := $(shell node -e "console.log(require('./package.json').version)")
REVISION := $(shell git show -s --format=%h)

TARGETS = dist/lambda-counter.zip
LIBS := $(shell find lib -type f)

all: version $(TARGETS)
	@echo $@ done.

version: 
	printf '{"version": "$(VERSION)",\n "revision": "$(REVISION)"}\n' > version.json

clean:
	/bin/rm -f $(TARGETS)
	@echo $@ done.

dist/lambda-counter.zip: lambda-counter.js $(LIBS)
	zip -q -r $@ $^ node_modules/ version.json

