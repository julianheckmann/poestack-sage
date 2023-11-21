#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { SageStack } from '../lib/sage-stack'
import { InsightsStack } from '../lib/insights-stack'
import { SageBackendStack } from '../lib/sage-backend-stack'

const app = new cdk.App()

const sageStack = new SageStack(app, 'SageStack', {})

new InsightsStack(app, 'InsightsStack', {}, sageStack)
new SageBackendStack(app, 'SageBackendStack', {}, sageStack)
