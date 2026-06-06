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

以下範例展示如何同步靜態網站檔案到 S3、取得已上傳物件的摘要並發送通知。

```bash
# 同步本地 dist 到 S3
aws s3 sync ./dist s3://my-static-site --acl public-read --delete

# 取得最近 10 個上傳的物件並以 jq 格式化
aws s3api list-objects-v2 --bucket my-static-site --query 'Contents[0:10]' | jq '.[] | {Key: .Key, Size: .Size, LastModified: .LastModified}'

# 發送簡單通知（假設已設定 SNS topic）
aws sns publish --topic-arn arn:aws:sns:us-east-1:123456789012:deploys --message "Deployed to S3: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

這樣可以把部署、核對與通知流程串成一個輕量的自動化任務。

## Related Resources

- 📖 [AWS CLI Documentation](https://docs.aws.amazon.com/cli/latest/)
