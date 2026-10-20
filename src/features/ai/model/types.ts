import type { components } from "@/services/api/api";

export type AdminSort = components["schemas"]["AdminSort"];

// AI Task
export type TasksRow = components["schemas"]["TasksRow"];
export type AdminPageTasksRow = components["schemas"]["AdminPage_TasksRow_"];
export type AiTaskTypeEnum = components["schemas"]["AiTaskTypeEnum"];
export type MessageRow = components["schemas"]["MessageRow"];
export type AdminPageMessageRow =
  components["schemas"]["AdminPage_MessageRow_"];
export type AiTaskMessageResponse =
  components["schemas"]["AiTaskMessageResponse"];

// AI Gateway
export type RequestsRow = components["schemas"]["RequestsRow"];
export type AdminPageRequestsRow =
  components["schemas"]["AdminPage_RequestsRow_"];
export type AiGatewayStatusEnum = components["schemas"]["AiGatewayStatusEnum"];
export type AiGatewayRequestAdminResponse =
  components["schemas"]["AiGatewayRequestAdminResponse"];

// AI Registry Models
export type ModelsRow = components["schemas"]["ModelsRow"];
export type AdminPageModelsRow = components["schemas"]["AdminPage_ModelsRow_"];
export type AiRegistryModelDetail =
  components["schemas"]["AiRegistryModelDetail"];
export type AiRegistryModelOwnerEnum =
  components["schemas"]["AiRegistryModelOwnerEnum"];
export type AiRegistryModelSupportedTypesEnum =
  components["schemas"]["AiRegistryModelSupportedTypesEnum"];
export type AiRegistryModelCreateRequest =
  components["schemas"]["AiRegistryModelCreateRequest"];
export type AiRegistryModelUpdateRequest =
  components["schemas"]["AiRegistryModelUpdateRequest"];
export type AiRegistryModelProviderLinkCreateRequest =
  components["schemas"]["AiRegistryModelProviderLinkCreateRequest"];
export type AiRegistryModelProviderLinkUpdateRequest =
  components["schemas"]["AiRegistryModelProviderLinkUpdateRequest"];

// AI Registry Providers
export type ProvidersRow = components["schemas"]["ProvidersRow"];
export type AdminPageProvidersRow =
  components["schemas"]["AdminPage_ProvidersRow_"];
export type AiRegistryProviderDetail =
  components["schemas"]["AiRegistryProviderDetail"];
export type AiRegistryProviderNameEnum =
  components["schemas"]["AiRegistryProviderNameEnum"];
export type AiRegistryProviderCreateRequest =
  components["schemas"]["AiRegistryProviderCreateRequest"];
export type AiRegistryProviderUpdateRequest =
  components["schemas"]["AiRegistryProviderUpdateRequest"];

// Reports
export type AdminReportBucket = components["schemas"]["AdminReportBucket"];
export type AdminPageAdminReportBucket =
  components["schemas"]["AdminPage_AdminReportBucket_"];
