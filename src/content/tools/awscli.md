---
title: "awscli — AWS Command Line Interface"
description: "Interact with AWS services from the terminal using awscli: S3, EC2, IAM, CloudFormation and more."
category: cloud
tags: [aws, awscli, cloud, s3, ec2]
featured: false
installCommand: "pip install awscli"
officialUrl: "https://aws.amazon.com/cli/"
related: [jq, curl]
pubDate: 2024-06-01
author: "CLI Tools Guide"
lastUpdated: 2024-06-01
---

# awscli — AWS Command Line Interface

The AWS CLI provides a unified tool to manage AWS services from your terminal. It is scriptable and widely used for automation.

## Installation

```bash
# With pip
pip install awscli --upgrade --user

# Or use package managers: brew, apt, etc.
```

## Basic Usage

```bash
# Configure credentials
aws configure

# List S3 buckets
aws s3 ls

# Describe EC2 instances
aws ec2 describe-instances --region us-east-1
```

## Practical Example: Sync S3, filter with jq, and notify

The example below shows how to sync static site files to S3, fetch a summary of uploaded objects, and send a notification.

```bash
# Sync the local dist directory to S3
aws s3 sync ./dist s3://my-static-site --acl public-read --delete

# Fetch the 10 most recently listed objects and format them with jq
aws s3api list-objects-v2 --bucket my-static-site --query 'Contents[0:10]' | jq '.[] | {Key: .Key, Size: .Size, LastModified: .LastModified}'

# Send a simple notification, assuming an SNS topic is already configured
aws sns publish --topic-arn arn:aws:sns:us-east-1:123456789012:deploys --message "Deployed to S3: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

This turns deployment, verification, and notification into a lightweight automation workflow.

## Related Resources

- 📖 [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/)
