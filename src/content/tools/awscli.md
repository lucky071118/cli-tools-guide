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

## What is awscli?

The AWS Command Line Interface (`aws`) is the official unified tool for managing Amazon Web Services from your terminal. With a single tool you can control EC2 instances, manage S3 buckets, deploy Lambda functions, query DynamoDB tables, configure IAM roles, interact with CloudFormation stacks, and automate virtually every AWS service — all from shell scripts or CI/CD pipelines.

For developers and DevOps engineers working with AWS infrastructure, `awscli` is not optional — it is the backbone of cloud automation. Teams use it for deployments, backup jobs, infrastructure auditing, and cost monitoring.

## Why Use awscli?

- **Complete AWS coverage** — every service and API operation is available as a CLI command.
- **Scriptable automation** — combine with shell scripts, `jq`, and cron for powerful workflows.
- **Profile management** — manage multiple AWS accounts and regions with named profiles.
- **JSON and table output** — machine-readable output for piping into other tools.
- **AWS SSO support** — authenticate via AWS IAM Identity Center (SSO) natively.
- **Active development** — AWS CLI v2 brings improved performance, interactive wizards, and better pager support.

## Installation

```bash
# With pip (Python 3)
pip install awscli --upgrade --user

# AWS CLI v2 — recommended for new installations

# macOS (Homebrew)
brew install awscli

# macOS (official installer)
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
sudo installer -pkg AWSCLIV2.pkg -target /

# Linux (x86_64)
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows (MSI installer)
# Download from https://awscli.amazonaws.com/AWSCLIV2.msi

# Verify
aws --version
```

## Configuration and Authentication

```bash
# Interactive configuration wizard
aws configure

# Configure a named profile
aws configure --profile production

# Configure specific values directly
aws configure set region us-east-1
aws configure set output json

# Use a named profile for a command
aws s3 ls --profile production

# Set a default profile via environment variable
export AWS_PROFILE=production

# Use temporary credentials (useful in CI)
export AWS_ACCESS_KEY_ID=AKIA...
export AWS_SECRET_ACCESS_KEY=...
export AWS_DEFAULT_REGION=us-east-1
```

## Working with S3

S3 is the most commonly used AWS service from the CLI. `aws s3` provides a high-level interface while `aws s3api` offers lower-level API access.

```bash
# List all buckets
aws s3 ls

# List objects in a bucket
aws s3 ls s3://my-bucket/

# Copy a file to S3
aws s3 cp ./dist/index.html s3://my-bucket/index.html

# Sync a directory to S3 (like rsync)
aws s3 sync ./dist s3://my-bucket --delete

# Download a file from S3
aws s3 cp s3://my-bucket/backup.tar.gz ./backup.tar.gz

# Remove an object
aws s3 rm s3://my-bucket/old-file.txt

# Move an object
aws s3 mv s3://my-bucket/temp.txt s3://my-bucket/archive/temp.txt

# Generate a pre-signed URL (expires in 1 hour)
aws s3 presign s3://my-bucket/report.pdf --expires-in 3600
```

## Working with EC2

```bash
# List running EC2 instances with key fields
aws ec2 describe-instances \
  --filters "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].{ID:InstanceId,Type:InstanceType,IP:PublicIpAddress,Name:Tags[?Key==`Name`]|[0].Value}' \
  --output table

# Start and stop instances
aws ec2 start-instances --instance-ids i-0abc12345def67890
aws ec2 stop-instances --instance-ids i-0abc12345def67890

# Get instance status
aws ec2 describe-instance-status --instance-ids i-0abc12345def67890

# Connect via EC2 Instance Connect (no SSH key needed)
aws ec2-instance-connect send-ssh-public-key \
  --instance-id i-0abc12345def67890 \
  --availability-zone us-east-1a \
  --instance-os-user ec2-user \
  --ssh-public-key file://~/.ssh/id_ed25519.pub
```

## Working with Lambda

```bash
# List all Lambda functions
aws lambda list-functions --query 'Functions[*].{Name:FunctionName,Runtime:Runtime}' --output table

# Invoke a Lambda function synchronously
aws lambda invoke \
  --function-name my-function \
  --payload '{"key": "value"}' \
  --cli-binary-format raw-in-base64-out \
  output.json && cat output.json | jq .

# Update function code from a zip file
aws lambda update-function-code \
  --function-name my-function \
  --zip-file fileb://function.zip

# View recent logs
aws logs tail /aws/lambda/my-function --follow
```

## Working with IAM

```bash
# List IAM users
aws iam list-users --query 'Users[*].{User:UserName,Created:CreateDate}' --output table

# Get caller identity (who am I?)
aws sts get-caller-identity

# List attached policies for a user
aws iam list-attached-user-policies --user-name alice

# Create an IAM role
aws iam create-role \
  --role-name MyLambdaRole \
  --assume-role-policy-document file://trust-policy.json
```

## 💡 Tips & Tricks

### Tip 1: Use `--query` to Filter Output

The `--query` flag uses JMESPath to filter and project JSON output without needing `jq`:

```bash
# Get only instance IDs and their states
aws ec2 describe-instances \
  --query 'Reservations[*].Instances[*].[InstanceId,State.Name]' \
  --output text
```

### Tip 2: Use `--output table` for Human-Readable Output

```bash
aws s3api list-buckets --output table
```

### Tip 3: Use `aws configure list-profiles` to Manage Multiple Accounts

```bash
aws configure list-profiles
# Switch profile for one command:
AWS_PROFILE=staging aws s3 ls
```

### Tip 4: Wait for Resources to Be Ready

Many `aws` commands have `wait` subcommands that block until a resource reaches a desired state:

```bash
# Wait until an EC2 instance is running
aws ec2 wait instance-running --instance-ids i-0abc12345def67890

# Wait until a CloudFormation stack completes
aws cloudformation wait stack-create-complete --stack-name my-stack
```

### Tip 5: Stream CloudWatch Logs

```bash
# Tail logs in real time (like `tail -f`)
aws logs tail /aws/lambda/my-function --follow --format short
```

## Advanced Applications

### Sync S3, Filter with jq, and Notify

```bash
#!/bin/bash
# Deploy static site to S3 and notify via SNS

BUCKET="my-static-site"
DIST_DIR="./dist"
TOPIC_ARN="arn:aws:sns:us-east-1:123456789012:deploys"

# Sync the local dist directory to S3
aws s3 sync "$DIST_DIR" "s3://$BUCKET" --acl public-read --delete
echo "Sync complete"

# Fetch the 10 most recently modified objects and display them
echo "Recently updated objects:"
aws s3api list-objects-v2 --bucket "$BUCKET" \
  --query 'sort_by(Contents, &LastModified)[-10:]' | \
  jq '.[] | {Key: .Key, Size: .Size, LastModified: .LastModified}'

# Send notification
aws sns publish \
  --topic-arn "$TOPIC_ARN" \
  --message "Deployed to S3: $(date -u +%Y-%m-%dT%H:%M:%SZ)"

echo "Notification sent"
```

### Daily Cost Report

Use `aws ce` (Cost Explorer) to pull yesterday's spend and send a daily digest:

```bash
#!/bin/bash
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)
TODAY=$(date +%Y-%m-%d)

costs=$(aws ce get-cost-and-usage \
  --time-period "Start=$YESTERDAY,End=$TODAY" \
  --granularity DAILY \
  --metrics "UnblendedCost" \
  --query 'ResultsByTime[0].Total.UnblendedCost.{Amount:Amount,Unit:Unit}')

amount=$(echo "$costs" | jq -r '.Amount')
unit=$(echo "$costs" | jq -r '.Unit')

echo "AWS cost for $YESTERDAY: $amount $unit"
```

## Related Resources

- 📖 [AWS CLI v2 Documentation](https://docs.aws.amazon.com/cli/latest/)
- 🔧 [AWS CLI Configuration Reference](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- 🧪 [AWS CLI Command Reference](https://awscli.amazonaws.com/v2/documentation/api/latest/index.html)

## Related Tools

- `jq` — JSON processor for filtering and transforming `aws` command output.
- `curl` — useful for calling AWS API endpoints directly or testing API Gateway endpoints.
- `terraform` — infrastructure-as-code tool that wraps many `aws` operations declaratively.

## Real-world Use Cases

- **Static site deployments** — sync a `dist/` directory to S3 and invalidate a CloudFront distribution in a single pipeline step.
- **EC2 fleet management** — start, stop, and query large numbers of instances programmatically with a shell script loop.
- **Secrets rotation** — retrieve secrets from AWS Secrets Manager and inject them into environment variables before app startup.
- **Log analysis** — tail CloudWatch Logs from multiple Lambda functions simultaneously during incident investigation.
- **Cost auditing** — pull daily/monthly spend breakdowns with Cost Explorer and send digests to Slack or email.

## When Not To Use awscli

- **Infrastructure provisioning** — use `terraform`, `pulumi`, or AWS CDK for declarative, version-controlled infrastructure instead of imperative CLI calls.
- **Complex IAM policy authoring** — the AWS Console's policy editor and IAM Access Analyzer provide better visual tooling.
- **Browsing and exploring** — the AWS Console is faster for one-off exploration of unfamiliar services.
- **High-frequency automation** — for many API calls per second, use an AWS SDK (Boto3, AWS SDK for JavaScript, etc.) instead of shelling out to `aws`.

---

## Practical Examples: Automate AWS Workflows with awscli

```bash
# 1. Deploy a static site to S3 and invalidate CloudFront cache
aws s3 sync ./dist s3://my-bucket --delete --acl public-read
DIST_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='my-bucket.s3.amazonaws.com'].Id" \
  --output text)
aws cloudfront create-invalidation --distribution-id "$DIST_ID" --paths "/*"

# 2. Find and stop all EC2 instances tagged env=staging
aws ec2 describe-instances \
  --filters "Name=tag:env,Values=staging" "Name=instance-state-name,Values=running" \
  --query 'Reservations[*].Instances[*].InstanceId' --output text | \
  xargs aws ec2 stop-instances --instance-ids

# 3. Rotate a secret and restart the dependent service
NEW_SECRET=$(openssl rand -base64 32)
aws secretsmanager put-secret-value \
  --secret-id prod/myapp/db-password \
  --secret-string "$NEW_SECRET"
aws ecs update-service --cluster prod --service myapp --force-new-deployment
```
