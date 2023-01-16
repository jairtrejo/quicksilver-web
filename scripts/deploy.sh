#!/usr/bin/env bash

npm run build
aws s3 sync --acl private dist s3://avatar.jairtrejo.com --delete --cache-control max-age=31536000,public
aws s3 cp s3://avatar.jairtrejo.com/index.html s3://avatar.jairtrejo.com/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl private

stack_id=$(aws cloudformation describe-stack-resources --stack-name avatar-jairtrejo-com | jq -r ".StackResources | map(select(.LogicalResourceId == \"StaticSite\")) | .[] | .PhysicalResourceId")
distribution_id=$(aws cloudformation describe-stack-resources --stack-name $stack_id --logical-resource-id 'SiteDistribution' | jq -r ".StackResources | .[] | .PhysicalResourceId")
aws cloudfront create-invalidation --distribution-id $distribution_id --paths /index.html
