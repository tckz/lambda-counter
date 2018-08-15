Lambda counter
===

# Requirements

* Node.js 8.x
* Yarn
* Redis(Singel server)

## Prerequisites

* Install node_modules
  ```bash
  $ yarn
  ```

# Run locally

  ```bash
  $ env REDIS_URL=redis://127.0.0.1:6379 node index.js
  ```

# Deploy

1. Make dist package.
   ```bash
   $ yarn --prod
   $ zip -r dist/lambda-counter.zip lambda-counter.js lib/* node_modules/
   ```

2. Update lambda. (Lambda function must be exist)
   ```bash
   $ aws lambda update-function-code --function-name somefunc --zip-file dist/lambda-counter.zip 
   ```
  
