Lambda counter
===

# Requirements

* Node.js 8.x
* Yarn
* GNU make
* Redis(Single server)

## Prerequisites

* Install node_modules
  ```bash
  $ yarn
  ```

# Run locally

* Pass configuraion by env-var or .env
  ```bash
  $ env REDIS_URL=redis://127.0.0.1:6379 node index.js
  ```

# Deploy

1. Make dist package.
   ```bash
   $ yarn --prod
   $ make
   ```

2. Update lambda. (Lambda function must be exist)
   ```bash
   $ aws lambda update-function-code --function-name somefunc --zip-file fileb://dist/lambda-counter.zip 
   ```
  
