/** @file supportedMetrics.js
 *  @brief reference file for supported metrics on azure resource types in Azure Metric API.
 *
 *  This contains the supported metrics when consuming the Azure metric APIs
 *  Proactively checking if a resource has metrics supported can optimize performance
 *  when working with large scale Azure environments.
 *
 *  @author Hans van den Akker
 *  @bug No known bugs.
 */

module.exports = [
    "Microsoft.LocationBasedServices/accounts",
    "Microsoft.EventHub/namespaces",
    "Microsoft.EventHub/clusters",
    "Microsoft.Media/mediaservices/streamingEndpoints",
    "Microsoft.ServiceBus/namespaces",
    "Microsoft.KeyVault/vaults",
    "Microsoft.ClassicCompute/domainNames/slots/roles",
    "Microsoft.ClassicCompute/virtualMachines",
    "Microsoft.EventGrid/eventSubscriptions",
    "Microsoft.EventGrid/topics",
    "Microsoft.EventGrid/domains",
    "Microsoft.EventGrid/extensionTopics",
    "Microsoft.Network/virtualNetworks",
    "Microsoft.Network/publicIPAddresses",
    "Microsoft.Network/networkInterfaces",
    "Microsoft.Network/loadBalancers",
    "Microsoft.Network/networkWatchers/connectionMonitors",
    "Microsoft.Network/virtualNetworkGateways",
    "Microsoft.Network/connections",
    "Microsoft.Network/applicationGateways",
    "Microsoft.Network/dnszones",
    "Microsoft.Network/trafficmanagerprofiles",
    "Microsoft.Network/expressRouteCircuits",
    "Microsoft.Network/vpnGateways",
    "Microsoft.Network/p2sVpnGateways",
    "Microsoft.Network/expressRoutePorts",
    "Microsoft.Network/azureFirewalls",
    "Microsoft.Network/frontdoors",
    "Microsoft.Batch/batchAccounts",
    "Microsoft.TimeSeriesInsights/environments",
    "Microsoft.TimeSeriesInsights/environments/eventsources",
    "Microsoft.OperationalInsights/workspaces",
    "Microsoft.Maps/accounts",
    "Microsoft.Sql/servers",
    "Microsoft.Sql/servers/databases",
    "Microsoft.Sql/servers/elasticpools",
    "Microsoft.Sql/managedInstances",
    "Microsoft.DataBoxEdge/DataBoxEdgeDevices",
    "Microsoft.AnalysisServices/servers",
    "Microsoft.Compute/virtualMachines",
    "Microsoft.Compute/virtualMachineScaleSets",
    "Microsoft.Compute/virtualMachineScaleSets/virtualMachines",
    "Microsoft.DataFactory/dataFactories",
    "Microsoft.DataFactory/factories",
    "Microsoft.Storage/storageAccounts",
    "Microsoft.Storage/storageAccounts/blobServices",
    "Microsoft.Storage/storageAccounts/tableServices",
    "Microsoft.Storage/storageAccounts/queueServices",
    "Microsoft.Storage/storageAccounts/fileServices",
    "Microsoft.Logic/workflows",
    "Microsoft.Logic/integrationServiceEnvironments",
    "Microsoft.Automation/automationAccounts",
    "Microsoft.ContainerService/managedClusters",
    "Microsoft.StorageSync/storageSyncServices",
    "Microsoft.StorageSync/storageSyncServices/syncGroups",
    "Microsoft.StorageSync/storageSyncServices/syncGroups/serverEndpoints",
    "Microsoft.StorageSync/storageSyncServices/registeredServers",
    "Microsoft.ApiManagement/service",
    "Microsoft.DBforMySQL/servers",
    "Microsoft.DocumentDB/databaseAccounts",
    "Microsoft.ContainerRegistry/registries",
    "Microsoft.Search/searchServices",
    "Microsoft.insights/components",
    "Microsoft.insights/autoscalesettings",
    "Microsoft.DataLakeStore/accounts",
    "Microsoft.Web/serverFarms",
    "Microsoft.Web/sites",
    "Microsoft.Web/sites/slots",
    "Microsoft.Web/hostingEnvironments/multiRolePools",
    "Microsoft.Web/hostingEnvironments/workerPools",
    "Microsoft.HDInsight/clusters",
    "test.shoebox/testresources",
    "test.shoebox/testresources2",
    "Microsoft.NotificationHubs/namespaces/notificationHubs",
    "Microsoft.CustomerInsights/hubs",
    "CloudSimple.PrivateCloudIaaS/virtualMachines",
    "Microsoft.IoTSpaces/Graph",
    "Microsoft.StreamAnalytics/streamingjobs",
    "Microsoft.DBforMariaDB/servers",
    "Microsoft.CognitiveServices/accounts",
    "Microsoft.Cache/Redis",
    "Microsoft.Devices/IotHubs",
    "Microsoft.Devices/ElasticPools",
    "Microsoft.Devices/ElasticPools/IotHubTenants",
    "Microsoft.Devices/ProvisioningServices",
    "Microsoft.SignalRService/SignalR",
    "Microsoft.DataLakeAnalytics/accounts",
    "Microsoft.DBforPostgreSQL/servers",
    "Microsoft.ContainerInstance/containerGroups",
    "Microsoft.Kusto/clusters",
    "Microsoft.Relay/namespaces",
    "Microsoft.PowerBIDedicated/capacities"
]
