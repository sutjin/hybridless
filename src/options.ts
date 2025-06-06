//Plugin
export interface OPlugin {
  functions?: { [key: string]: OFunction } | { [key: string]: OFunction }[]
  images?: { [key: string]: OImage } | { [key: string]: OImage }[]
  disableWebpack?: boolean
  buildConcurrency?: number
  tags?: { [key: string]: any } | { [key: string]: any }[]
}

//Image
export interface OImage {
  dockerFile: string
  /**
   * @minItems 0
   * @maxItems 99999
   */
  additionalDockerFiles?: { from: string; to: string; path?: string }[]
  dockerBuildArgs?: { [key: string]: string }
  additionalTag?: string
  enabled?: boolean //defaults to true
}

//Function
export interface OFunction {
  handler: string
  vpc?: OVPCOptions
  timeout?: number //Only works with lambda based
  memory?: number //defaults to 1024
  events?: (
    | OFunctionHTTPDTaskEvent
    | OFunctionProcessTaskEvent
    | OFunctionScheduledTaskEvent
    | OFunctionLambdaEvent
    | OFunctionLambdaContainerEvent
  )[]
  tags?: { [key: string]: any } | { [key: string]: any }[]
  environment?: { [key: string]: string | object }
  //ECS cluster
  ecsClusterArn?: any
  ecsIngressSecGroupId?: string
  enableContainerInsights?: boolean //default is respecting account settings
  //ALB
  albListenerArn?: any
  albIsPrivate?: boolean
  albAdditionalTimeout?: number //defaults to 1 second
  //IAM
  iamRoleStatementsInherit?: null | boolean
  iamRoleStatements?: any
}

//follows @hybridless/serverless-ecs-plugin model for compatibility purposes :)
export type OVPCOptions = OVPCOptions_Dedicated | OVPCOptions_Shared
export interface OVPCOptions_Dedicated {
  cidr: string
  subnets: string[]
}
export interface OVPCOptions_Shared {
  //Optional ivars to dictate if will use existing VPC and subnets specified
  vpcId: string
  securityGroupIds: string[] | any //object allows intrinsict functions
  subnetIds: string[] | any //object allows intrinsict functions
  albSubnetIds?: string[] | object //object allows intrinsict functions
}

//Types
export enum OFunctionEventType {
  //Task
  httpd = 'httpd',
  process = 'process',
  scheduledTask = 'scheduledTask',
  launchableTask = 'launchableTask',
  //Serverless
  lambda = 'lambda',
  lambdaContainer = 'lambdaContainer',
  //Runnable
  job = 'job',
}
export enum OFunctionHttpdTaskRuntime {
  nodejs10 = 'nodejs10',
  nodejs13 = 'nodejs13',
  nodejs14 = 'nodejs14',
  nodejs16 = 'nodejs16',
  nodejs18 = 'nodejs18',
  nodejs20 = 'nodejs20',
  nodejs22 = 'nodejs22',
  php5 = 'php5',
  php7 = 'php7',
  go = 'go',
  container = 'container',
}
export enum OFunctionProcessTaskRuntime {
  nodejs10 = 'nodejs10',
  nodejs13 = 'nodejs13',
  nodejs14 = 'nodejs14',
  nodejs16 = 'nodejs16',
  nodejs18 = 'nodejs18',
  nodejs20 = 'nodejs20',
  nodejs22 = 'nodejs22',
  container = 'container',
}
export enum OFunctionScheduledTaskRuntime {
  nodejs10 = 'nodejs10',
  nodejs13 = 'nodejs13',
  nodejs14 = 'nodejs14',
  nodejs16 = 'nodejs16',
  nodejs18 = 'nodejs18',
  nodejs20 = 'nodejs20',
  nodejs22 = 'nodejs22',
  container = 'container',
}
export enum OFunctionLaunchableTaskRuntime {
  nodejs10 = 'nodejs10',
  nodejs13 = 'nodejs13',
  nodejs14 = 'nodejs14',
  nodejs16 = 'nodejs16',
  nodejs18 = 'nodejs18',
  nodejs20 = 'nodejs20',
  nodejs22 = 'nodejs22',
  container = 'container',
}
export enum OFunctionLambdaContainerRuntime {
  nodejs10 = 'nodejs10',
  nodejs12 = 'nodejs12',
  nodejs14 = 'nodejs14',
  nodejs16 = 'nodejs16',
  nodejs18 = 'nodejs18',
  nodejs20 = 'nodejs20',
  nodejs22 = 'nodejs22',
  container = 'container',
  java11 = 'java11',
  java8al12 = 'java8.al12',
  java8 = 'java8',
}
export enum OFunctionBatchJobRuntime {
  nodejs10 = 'nodejs10',
  nodejs12 = 'nodejs12',
  nodejs14 = 'nodejs14',
  nodejs16 = 'nodejs16',
  nodejs18 = 'nodejs18',
  nodejs20 = 'nodejs20',
  nodejs22 = 'nodejs22',
  container = 'container',
  java11 = 'java11',
  java8al12 = 'java8.al12',
  java8 = 'java8',
}
export enum OFunctionLambdaProtocol {
  http = 'http',
  httpAlb = 'httpLoadBalancer',
  dynamostreams = 'dynamostreams',
  sqs = 'sqs',
  sns = 'sns',
  scheduler = 'scheduler',
  cloudWatch = 'cloudWatch',
  cloudWatchLogstream = 'cloudWatchLogstream',
  cognito = 'cognito',
  s3 = 's3',
  eventBridge = 'eventBridge',
  none = 'none',
}
export enum OFunctionBatchJobTypes {
  container = 'container',
  multinode = 'multinode',
}

/* Auto scaling */
export interface OFunctionBasicStepScalingPolicy {
  //scaling
  adjustmentType?: 'ChangeInCapacity' | 'ExactCapacity' | 'PercentChangeInCapacity' //defaults to ChangeInCapacity
  cooldown?: number //default to 300
  aggregation: 'Average' | 'Maximum' | 'Minimum'
  minAdjustmentMagnitude?: number //Should only be used with PercentChangeInCapacity
  scaleBy?: number //defaults to 1 or -1
  //scaling metric
  metricNamespace: string
  metricName: string
  metricDimension: string
  metricDimensionTarget: string
  metricPeriod?: number //defaults to 120
  metricEvaluationPeriod?: number //defaults to 1
  operator:
    | 'GreaterThanOrEqualToThreshold'
    | 'GreaterThanThreshold'
    | 'LessThanThreshold'
    | 'LessThanOrEqualToThreshold'
    | 'LessThanLowerOrGreaterThanUpperThreshold'
    | 'LessThanLowerThreshold'
    | 'GreaterThanUpperThreshold'
  targetValue: number
  //additional config (scaling metric)
  metricDependsOn?: string | string[]
  additionalDimension?: { dimension: string; target: string }[]
  treatMissingData?: ' breaching' | 'notBreaching' | 'ignore' | 'missing' //defaults to notBreaching
  fillupMissingData?: any //fillup value is used on absence of data. default to false, true uses '0', number can be specified instead if any other fillup values is needed.
}

/**
 ** BASE EVENTS **
 **/
export interface OFunctionEvent {
  runtime: string
  eventType: OFunctionEventType
  handler?: string //this, takes precende over function handler - Usefulll for multi-purpose clusters
  enabled?: boolean //defaults to true
  memory?: number //defaults to 1024 - takes precedence over OFunction.memory
  role?: string
  logsRetentionInDays?: number //defaults to 365 days
  environment?: { [key: string]: string | object }
}

export interface OFunctionContainerReusableImage extends OFunctionEvent {
  imageId?: string
}
export interface OFunctionContainerOptionalImage extends OFunctionEvent {
  dockerFile?: string
  /**
   * @minItems 0
   * @maxItems 99999
   */
  additionalDockerFiles?: { from: string; to: string }[]
  dockerBuildArgs?: { [key: string]: string }
}
export type OFunctionContainerBaseEvent = {
  entrypoint?: string //incase of using container runtimes, you can always make custom entrypoints
} & (OFunctionContainerReusableImage | OFunctionContainerOptionalImage)

/**
 ** TASK BASED **
 **/
export type OFunctionTaskBaseEvent = OFunctionContainerBaseEvent & {
  //Service
  ec2LaunchType?: boolean //defaults to false, if true will laucnh task into EC2
  newRelicKey?: string //
  propagateTags?: OPropagateTagsType //defaults to false
  placementConstraints?: { expression: string; type: 'distinctInstance' | 'memberOf' }[]
  placementStrategies?: { field: string; type: 'binpack' | 'random' | 'spread' }[]
  capacityProviderStrategy?: { base: number; capacityProvider: string; weight: number }[]
  //Task
  concurrency?: number //defaults to 1
  cpu?: number //defaults to 512
  softCPU?: number
  softMemory?: number
  logsMultilinePattern?: string //defaults to '(([a-zA-Z0-9\-]* \[[a-zA-Za-]*\] )|(\[[a-zA-Za -]*\] ))'
}
export type OFunctionEC2TaskBaseEvent = {
  ec2LaunchType?: true
  daemonType?: boolean
}
export type OFunctionFargateTaskBaseEvent = {
  ec2LaunchType?: false | undefined
}
export type OFunctionHTTPDTaskEvent = {
  runtime: OFunctionHttpdTaskRuntime //@overwrite
  eventType: OFunctionEventType.httpd //@overwrite
  //ALB listener layer
  routes?: {
    path: string
    method?: string
    priority?: number //defaults to 1
    albListenerArn?: string
  }[]
  cors?: {
    origin: string
    headers: string[]
    allowCredentials: boolean
  }
  hostname?: string | string[]
  limitSourceIPs?: string | string[]
  limitHeaders?: { name: string; value: string | string[] }[] //optional limit headers on ALB
  port?: number // HTTPD port (the port exposed on the container image) - If port is not specified, it will use 80 for non SSL and 443 for SSL
  certificateArns?: any[] //certificateArn - if present it will use HTTPS
  cognitoAuthorizer?: {
    poolDomain: string
    poolArn: any
    clientId: string
  }
  //health check
  healthCheckInterval?: number //defaults to 15,
  healthCheckTimeout?: number //defaults to 10
  healthCheckHealthyCount?: number //defaults to 2
  healthCheckUnhealthyCount?: number //defaults to 5
  healthCheckRoute?: string //default will use auto generated health route
  healthCheckStatusCode?: number
  deregistrationDelay?: number
  //AS
  autoScale?: {
    min?: number //default to 1
    max?: number //default to 1
    metric: string
    cooldown?: number //defaults to 30
    cooldownIn?: number //defaults to cooldown but has priority over it
    cooldownOut?: number //defaults to cooldown but has priority over it
    targetValue: number
    scaleIn?: OFunctionBasicStepScalingPolicy
    scaleOut?: OFunctionBasicStepScalingPolicy
  }
} & OFunctionTaskBaseEvent & //Task base
  (OFunctionEC2TaskBaseEvent | OFunctionFargateTaskBaseEvent)
export type OFunctionProcessTaskEvent = {
  runtime: OFunctionProcessTaskRuntime
  eventType: OFunctionEventType.process
} & OFunctionTaskBaseEvent & //Task base
  (OFunctionEC2TaskBaseEvent | OFunctionFargateTaskBaseEvent)
export type OFunctionScheduledTaskEvent = {
  runtime: OFunctionScheduledTaskRuntime
  eventType: OFunctionEventType.scheduledTask
  schedulerRate: string
  schedulerInput?: string | object
} & OFunctionTaskBaseEvent & //Task base
  (OFunctionEC2TaskBaseEvent | OFunctionFargateTaskBaseEvent)
export type OFunctionLaunchableTaskEvent = {
  runtime: OFunctionLaunchableTaskRuntime
  eventType: OFunctionEventType.launchableTask
} & OFunctionTaskBaseEvent & //Task base
  (OFunctionEC2TaskBaseEvent | OFunctionFargateTaskBaseEvent)

/**
 ** BATCH JOB BASED **
 **/
export type OFunctionBatchJobEvent = {
  eventType: OFunctionEventType.job
  runtime: OFunctionBatchJobRuntime
  retryCount?: number //defaults to 1
  propagateTags?: boolean //defaults to off
  tags?: { [key: string]: string }
  type?: OFunctionBatchJobTypes //defaults to OFunctionBatchJobTypes.container
  timeout?: number //takes precendece over func.
  runsOnFargate?: boolean //defaults to false
  //container
  cpu?: number
  softCPU?: number
  // softMemory?: number; -- not yet supported
  logsMultilinePattern?: string //defaults to '(([a-zA-Z0-9\-]* \[[a-zA-Za-]*\] )|(\[[a-zA-Za -]*\] ))'
} & OFunctionContainerBaseEvent

/**
 ** LAMBDA BASED **
 **/
export type OFunctionLambdaBaseEvent = {
  reservedConcurrency?: number
  disableTracing?: boolean //XRay tracing is enabled by default
  protocol: OFunctionLambdaProtocol
  package?: any
  snapStart?: boolean //default to false
  provisionedConcurrency?: number //default is not set
  concurrencyAutoscaling?: any //default is not set -- serverless-provisioned-concurrency-autoscaling
  timeout?: number //takes precendece over func.
  onError?: string | any //allow intrinsict function
}

export interface OFunctionLambdaHTTPEvent extends OFunctionEvent {
  routes: {
    path: string
    method?: string
  }[]
  cors?: {
    origin: string
    headers: string[]
    allowCredentials: boolean
  }
  protocol: OFunctionLambdaProtocol.http
  cognitoAuthorizerArn?: any //assumption
}
export interface OFunctionLambdaHTTPLoadBalancerEvent extends OFunctionEvent {
  routes: {
    path: string
    method?: string | string[]
    priority?: number //default to 1
  }[]
  cors?: {
    origin: string
    headers: string[]
    allowCredentials: boolean
  }
  //ALB
  protocol: OFunctionLambdaProtocol.httpAlb
  hostname?: string | string[]
  limitSourceIPs?: string | string[]
  //todo: PR serverless to support multiple headers
  limitHeader?: { name: string; value: string | string[] } //optional limit headers on ALB
  cognitoAuthorizer?: {
    poolDomain: string
    poolArn: any
    clientId: string
  }
  //health check
  healthCheckInterval?: number //defaults to 15,
  healthCheckTimeout?: number //defaults to 10
  healthCheckHealthyCount?: number //defaults to 2
  healthCheckUnhealthyCount?: number //defaults to 5
  healthCheckRoute?: string //required to enable health checks
}
export interface OFunctionLambdaSQSEvent extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.sqs
  protocolArn?: any
  queueBatchSize?: number
  maximumBatchingWindow?: number
  reportFailureResponse?: boolean
  queueMaxConcurrency?: number
}
export interface OFunctionLambdaSNSEvent extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.sns
  protocolArn?: any
  filterPolicy?: object
}
export interface OFunctionLambdaSchedulerEvent extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.scheduler
  schedulerRate?: string
  schedulerInput?: string | any
}
export interface OFunctionLambdaDynamoStreamsEvent extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.dynamostreams
  protocolArn?: any
  queueBatchSize?: number
  maximumRetryAttempts?: number
  filterPatterns?: {}[]
}
export interface OFunctionLambdaS3Event extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.s3
  s3bucket: string
  s3event?: string
  s3bucketExisting?: boolean
  s3rules?: { [key in 'prefix' | 'suffix']?: string }[]
}
export interface OFunctionLambdaCloudWatchEvent extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.cloudWatch
  cloudWatchEventSource: string
  cloudWatchDetailType: string
  cloudWatchDetailState?: string
  cloudWatchInput?: string | any
}
export interface OFunctionLambdaCloudWatchLogStream extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.cloudWatchLogstream
  cloudWatchLogGroup: string
  cloudWatchLogFilter?: string
}
export interface OFunctionLambdaCognitoTrigger extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.cognito
  cognitoUserPoolArn: any
  cognitoTrigger: string
}
export interface OFunctionLambdaEventBridge extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.eventBridge
  eventBus?: string
  schedule?: string
  pattern?: any
}
export interface OFunctionLambdaNoneEvent extends OFunctionEvent {
  protocol: OFunctionLambdaProtocol.none
}
//Final types
export type OFunctionLambdaEvent = {
  layers?: string[]
  eventType: OFunctionEventType.lambda
} & OFunctionLambdaBaseEvent & //lambda base
  //Any lambda event source
  (| OFunctionLambdaHTTPEvent
    | OFunctionLambdaSQSEvent
    | OFunctionLambdaSNSEvent
    | OFunctionLambdaSchedulerEvent
    | OFunctionLambdaDynamoStreamsEvent
    | OFunctionLambdaNoneEvent
    | OFunctionLambdaS3Event
    | OFunctionLambdaCloudWatchEvent
    | OFunctionLambdaCloudWatchLogStream
    | OFunctionLambdaCognitoTrigger
    | OFunctionLambdaHTTPLoadBalancerEvent
    | OFunctionLambdaEventBridge
  )
export type OFunctionLambdaContainerEvent = {
  runtime: OFunctionLambdaContainerRuntime
  eventType: OFunctionEventType.lambdaContainer
} & OFunctionLambdaBaseEvent & //lambda base
  OFunctionContainerBaseEvent & //container base
  //Any lambda event source
  (| OFunctionLambdaHTTPEvent
    | OFunctionLambdaSQSEvent
    | OFunctionLambdaSNSEvent
    | OFunctionLambdaSchedulerEvent
    | OFunctionLambdaDynamoStreamsEvent
    | OFunctionLambdaNoneEvent
    | OFunctionLambdaS3Event
    | OFunctionLambdaCloudWatchEvent
    | OFunctionLambdaCloudWatchLogStream
    | OFunctionLambdaCognitoTrigger
    | OFunctionLambdaHTTPLoadBalancerEvent
    | OFunctionLambdaEventBridge
  )

//Misc
export enum OPropagateTagsType {
  OFF = 'OFF',
  SERVICE = 'SERVICE',
  TASK = 'TASK',
}
//Failed attempt to include servicePrincipal to IAM
// export const OIAMServicesPrincipal = {
//     type: 'array',
//     items: {
//         type: 'string'
//     },
//     maxItems: 1,
//     minItems: 0,
// };
