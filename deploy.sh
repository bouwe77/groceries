#!/bin/bash

# Uncomment to see the commands as they are executed
# set -x

# Creates a production build of the app
# and deploys it together with the API to fly.io.

npm run build

# Copy the build to the API, because the API is deployed
rm -rf api/ui
cp -r dist/. api/ui

        # cd api

# Set the MONGO_URL from .env.production as a fly.io secret
        # fly secrets set MONGO_URL=$MONGO_URL

# Deploy to fly.io
        # fly deploy
        # cd ..