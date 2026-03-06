targetScope = 'resourceGroup'

@description('Globally unique name for the Azure App Service web app.')
param appName string

@description('Name of the App Service plan used by the web app.')
param appServicePlanName string = '${appName}-plan'

@description('Azure region for the App Service resources.')
param location string = resourceGroup().location

@description('Logical environment name applied as a tag.')
param environmentName string = 'production'

@description('App Service pricing tier name.')
param appServicePlanSkuName string = 'B1'

@description('App Service pricing tier family.')
param appServicePlanSkuTier string = 'Basic'

@description('Number of App Service workers.')
param appServicePlanCapacity int = 1

@description('Runtime stack for the Linux App Service.')
param nodeRuntimeStack string = 'NODE|20-lts'

@description('Startup command used by the standalone Next.js server.')
param startupCommand string = 'node server.js'

@description('Whether the App Service should stay warm between requests.')
param alwaysOn bool = true

@description('Blog source provider passed to the application runtime.')
@allowed([
  'local'
  'github'
])
param blogSourceProvider string = 'local'

@description('Path used by the blog source adapter.')
param blogSourcePath string = 'content/blog'

@description('GitHub owner for the remote blog source when github mode is enabled.')
param blogSourceOwner string = ''

@description('GitHub repository for the remote blog source when github mode is enabled.')
param blogSourceRepo string = ''

@description('GitHub branch for the remote blog source when github mode is enabled.')
param blogSourceBranch string = 'main'

@description('Optional GitHub token used for private repository access.')
@secure()
param blogSourceToken string = ''

@description('Additional tags applied to the provisioned resources.')
param tags object = {}

var mergedTags = union(tags, {
  environment: environmentName
  managedBy: 'bicep'
  workload: 'm0x6a-portfolio-blog'
})

var baseAppSettings = {
  BLOG_SOURCE_PATH: blogSourcePath
  BLOG_SOURCE_PROVIDER: blogSourceProvider
  NODE_ENV: 'production'
  SCM_DO_BUILD_DURING_DEPLOYMENT: 'false'
  WEBSITE_RUN_FROM_PACKAGE: '1'
}

var gitHubAppSettings = blogSourceProvider == 'github'
  ? {
      BLOG_SOURCE_BRANCH: blogSourceBranch
      BLOG_SOURCE_OWNER: blogSourceOwner
      BLOG_SOURCE_REPO: blogSourceRepo
    }
  : {}

var secureAppSettings = empty(blogSourceToken)
  ? {}
  : {
      BLOG_SOURCE_TOKEN: blogSourceToken
    }

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: appServicePlanName
  location: location
  kind: 'linux'
  sku: {
    capacity: appServicePlanCapacity
    name: appServicePlanSkuName
    tier: appServicePlanSkuTier
  }
  properties: {
    reserved: true
  }
  tags: mergedTags
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: appName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    httpsOnly: true
    serverFarmId: appServicePlan.id
  }
  tags: mergedTags
}

resource webAppSiteConfig 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: webApp
  name: 'web'
  properties: {
    alwaysOn: alwaysOn
    appCommandLine: startupCommand
    ftpsState: 'Disabled'
    healthCheckPath: '/'
    http20Enabled: true
    linuxFxVersion: nodeRuntimeStack
    minTlsVersion: '1.2'
  }
}

resource webAppAppSettings 'Microsoft.Web/sites/config@2022-09-01' = {
  parent: webApp
  name: 'appsettings'
  properties: union(baseAppSettings, gitHubAppSettings, secureAppSettings)
}

output webAppName string = webApp.name
output webAppUrl string = 'https://${webApp.properties.defaultHostName}'
output managedIdentityPrincipalId string = webApp.identity.principalId
