import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'unipaas/1.12 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  authController_authorize(body: types.AuthControllerAuthorizeBodyParam): Promise<FetchResponse<201, types.AuthControllerAuthorizeResponse201>> {
    return this.core.fetch('/authorize', 'post', body);
  }

  vendorController_createVendor(body: types.VendorControllerCreateVendorBodyParam): Promise<FetchResponse<201, types.VendorControllerCreateVendorResponse201>> {
    return this.core.fetch('/vendors', 'post', body);
  }

  vendorController_getAllVendor(): Promise<FetchResponse<202, types.VendorControllerGetAllVendorResponse202>> {
    return this.core.fetch('/vendors', 'get');
  }

  vendorController_getVendorById(metadata: types.VendorControllerGetVendorByIdMetadataParam): Promise<FetchResponse<202, types.VendorControllerGetVendorByIdResponse202>> {
    return this.core.fetch('/vendors/{vendorId}', 'get', metadata);
  }

  vendorController_getAuthorizations(metadata: types.VendorControllerGetAuthorizationsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/authorizations', 'get', metadata);
  }

  vendorController_updateDescriptor(body: types.VendorControllerUpdateDescriptorBodyParam, metadata: types.VendorControllerUpdateDescriptorMetadataParam): Promise<FetchResponse<200, types.VendorControllerUpdateDescriptorResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/settings/descriptor', 'patch', body, metadata);
  }

  vendorController_getPublicConfiguration(metadata: types.VendorControllerGetPublicConfigurationMetadataParam): Promise<FetchResponse<202, types.VendorControllerGetPublicConfigurationResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/public-settings', 'get', metadata);
  }

  vendorController_getPlatformFeeConfiguration(metadata: types.VendorControllerGetPlatformFeeConfigurationMetadataParam): Promise<FetchResponse<202, types.VendorControllerGetPlatformFeeConfigurationResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/public-settings/fees', 'get', metadata);
  }

  vendorController_getMarketingConfiguration(metadata: types.VendorControllerGetMarketingConfigurationMetadataParam): Promise<FetchResponse<202, types.VendorControllerGetMarketingConfigurationResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/marketing-configuration/{templateName}', 'get', metadata);
  }

  vendorController_getMarketingData(metadata: types.VendorControllerGetMarketingDataMetadataParam): Promise<FetchResponse<202, types.VendorControllerGetMarketingDataResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/marketing-data', 'get', metadata);
  }

  vendorController_updateCommunicationEmail(body: types.VendorControllerUpdateCommunicationEmailBodyParam, metadata: types.VendorControllerUpdateCommunicationEmailMetadataParam): Promise<FetchResponse<202, types.VendorControllerUpdateCommunicationEmailResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/communication-email', 'patch', body, metadata);
  }

  vendorEwalletController_createEwallet(body: types.VendorEwalletControllerCreateEwalletBodyParam, metadata: types.VendorEwalletControllerCreateEwalletMetadataParam): Promise<FetchResponse<201, types.VendorEwalletControllerCreateEwalletResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/ewallets', 'post', body, metadata);
  }

  vendorEwalletController_getEwallet(metadata: types.VendorEwalletControllerGetEwalletMetadataParam): Promise<FetchResponse<202, types.VendorEwalletControllerGetEwalletResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/ewallets', 'get', metadata);
  }

  vendorEwalletController_getEwalletTransactionsByVendorId(metadata: types.VendorEwalletControllerGetEwalletTransactionsByVendorIdMetadataParam): Promise<FetchResponse<202, types.VendorEwalletControllerGetEwalletTransactionsByVendorIdResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/ewallets/transactions', 'get', metadata);
  }

  vendorEwalletController_getEwalletTransactions(metadata: types.VendorEwalletControllerGetEwalletTransactionsMetadataParam): Promise<FetchResponse<202, types.VendorEwalletControllerGetEwalletTransactionsResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/ewallets/{ewalletId}/transactions', 'get', metadata);
  }

  vendorPayoutController_getPayouts(metadata: types.VendorPayoutControllerGetPayoutsMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerGetPayoutsResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts', 'get', metadata);
  }

  vendorPayoutController_createPayout(body: types.VendorPayoutControllerCreatePayoutBodyParam, metadata: types.VendorPayoutControllerCreatePayoutMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerCreatePayoutResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts', 'post', body, metadata);
  }

  vendorPayoutController_getVendorPayoutConfiguration(metadata: types.VendorPayoutControllerGetVendorPayoutConfigurationMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerGetVendorPayoutConfigurationResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts/configuration', 'get', metadata);
  }

  vendorPayoutController_deleteVendorPayoutConfiguration(metadata: types.VendorPayoutControllerDeleteVendorPayoutConfigurationMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerDeleteVendorPayoutConfigurationResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts/configuration', 'delete', metadata);
  }

  vendorPayoutController_setVendorPayoutConfiguration(body: types.VendorPayoutControllerSetVendorPayoutConfigurationBodyParam, metadata: types.VendorPayoutControllerSetVendorPayoutConfigurationMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerSetVendorPayoutConfigurationResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts/configuration', 'post', body, metadata);
  }

  vendorPayoutController_commitPayout(metadata: types.VendorPayoutControllerCommitPayoutMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerCommitPayoutResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts/{payoutId}/commit', 'post', metadata);
  }

  vendorPayoutController_cancelPayout(metadata: types.VendorPayoutControllerCancelPayoutMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerCancelPayoutResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts/{payoutId}/cancel', 'post', metadata);
  }

  vendorPayoutController_drillThroughPayout(metadata: types.VendorPayoutControllerDrillThroughPayoutMetadataParam): Promise<FetchResponse<201, types.VendorPayoutControllerDrillThroughPayoutResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payouts/{payoutId}/drillthrough', 'get', metadata);
  }

  vendorPayoutOptionsController_getPayoutOptions(metadata: types.VendorPayoutOptionsControllerGetPayoutOptionsMetadataParam): Promise<FetchResponse<201, types.VendorPayoutOptionsControllerGetPayoutOptionsResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payout-options', 'get', metadata);
  }

  vendorPaymentOptionsController_getAvailablePaymentOptions(metadata: types.VendorPaymentOptionsControllerGetAvailablePaymentOptionsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/payment-options/available', 'get', metadata);
  }

  vendorPaymentOptionsController_getPaymentOptions(metadata: types.VendorPaymentOptionsControllerGetPaymentOptionsMetadataParam): Promise<FetchResponse<201, types.VendorPaymentOptionsControllerGetPaymentOptionsResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/payment-options', 'get', metadata);
  }

  ewalletController_createEwallet(body: types.EwalletControllerCreateEwalletBodyParam): Promise<FetchResponse<201, types.EwalletControllerCreateEwalletResponse201>> {
    return this.core.fetch('/ewallets', 'post', body);
  }

  ewalletController_getEwallet(): Promise<FetchResponse<202, types.EwalletControllerGetEwalletResponse202>> {
    return this.core.fetch('/ewallets', 'get');
  }

  ewalletController_getEwalletById(metadata: types.EwalletControllerGetEwalletByIdMetadataParam): Promise<FetchResponse<202, types.EwalletControllerGetEwalletByIdResponse202>> {
    return this.core.fetch('/ewallets/{ewalletId}', 'get', metadata);
  }

  ewalletController_getEwalletTransactions(metadata: types.EwalletControllerGetEwalletTransactionsMetadataParam): Promise<FetchResponse<202, types.EwalletControllerGetEwalletTransactionsResponse202>> {
    return this.core.fetch('/ewallets/{ewalletId}/transactions', 'get', metadata);
  }

  paymentOptionsController_getPaymentOptions(): Promise<FetchResponse<201, types.PaymentOptionsControllerGetPaymentOptionsResponse201>> {
    return this.core.fetch('/payment-options', 'get');
  }

  payoutController_getPayouts(metadata?: types.PayoutControllerGetPayoutsMetadataParam): Promise<FetchResponse<201, types.PayoutControllerGetPayoutsResponse201>> {
    return this.core.fetch('/payouts', 'get', metadata);
  }

  payoutController_createPayout(body: types.PayoutControllerCreatePayoutBodyParam): Promise<FetchResponse<201, types.PayoutControllerCreatePayoutResponse201>> {
    return this.core.fetch('/payouts', 'post', body);
  }

  payoutController_commitPayout(metadata: types.PayoutControllerCommitPayoutMetadataParam): Promise<FetchResponse<201, types.PayoutControllerCommitPayoutResponse201>> {
    return this.core.fetch('/payouts/{payoutId}/commit', 'post', metadata);
  }

  payoutController_cancelPayout(metadata: types.PayoutControllerCancelPayoutMetadataParam): Promise<FetchResponse<201, types.PayoutControllerCancelPayoutResponse201>> {
    return this.core.fetch('/payouts/{payoutId}/cancel', 'post', metadata);
  }

  payoutController_getPayoutConfiguration(): Promise<FetchResponse<201, types.PayoutControllerGetPayoutConfigurationResponse201>> {
    return this.core.fetch('/payouts/configuration', 'get');
  }

  payoutController_deletePayoutConfiguration(): Promise<FetchResponse<201, types.PayoutControllerDeletePayoutConfigurationResponse201>> {
    return this.core.fetch('/payouts/configuration', 'delete');
  }

  payoutController_setPayoutConfiguration(body: types.PayoutControllerSetPayoutConfigurationBodyParam): Promise<FetchResponse<201, types.PayoutControllerSetPayoutConfigurationResponse201>> {
    return this.core.fetch('/payouts/configuration', 'post', body);
  }

  payoutController_getPayoutById(metadata: types.PayoutControllerGetPayoutByIdMetadataParam): Promise<FetchResponse<201, types.PayoutControllerGetPayoutByIdResponse201>> {
    return this.core.fetch('/payouts/{payoutId}', 'get', metadata);
  }

  payoutController_drillThroughPayout(metadata: types.PayoutControllerDrillThroughPayoutMetadataParam): Promise<FetchResponse<201, types.PayoutControllerDrillThroughPayoutResponse201>> {
    return this.core.fetch('/payouts/{payoutId}/drillthrough', 'get', metadata);
  }

  onboardingController_postAndSubmitFile(body: types.OnboardingControllerPostAndSubmitFileBodyParam, metadata: types.OnboardingControllerPostAndSubmitFileMetadataParam): Promise<FetchResponse<201, types.OnboardingControllerPostAndSubmitFileResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/onboarding/file', 'post', body, metadata);
  }

  onboardingController_getOnboardingFlatForms(metadata: types.OnboardingControllerGetOnboardingFlatFormsMetadataParam): Promise<FetchResponse<200, types.OnboardingControllerGetOnboardingFlatFormsResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/onboarding', 'get', metadata);
  }

  onboardingController_postOnboardingFlatForms(body: types.OnboardingControllerPostOnboardingFlatFormsBodyParam, metadata: types.OnboardingControllerPostOnboardingFlatFormsMetadataParam): Promise<FetchResponse<201, types.OnboardingControllerPostOnboardingFlatFormsResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/onboarding', 'post', body, metadata);
  }

  onboardingController_getOnboardingOverview(metadata: types.OnboardingControllerGetOnboardingOverviewMetadataParam): Promise<FetchResponse<200, types.OnboardingControllerGetOnboardingOverviewResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/overview', 'get', metadata);
  }

  onboardingController_requireOnboardingAction(body: types.OnboardingControllerRequireOnboardingActionBodyParam, metadata: types.OnboardingControllerRequireOnboardingActionMetadataParam): Promise<FetchResponse<201, types.OnboardingControllerRequireOnboardingActionResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/onboarding/require', 'post', body, metadata);
  }

  payInPlanController_createPayInPlan(body: types.PayInPlanControllerCreatePayInPlanBodyParam): Promise<FetchResponse<201, types.PayInPlanControllerCreatePayInPlanResponse201>> {
    return this.core.fetch('/pay-ins/plans', 'post', body);
  }

  payInPlanController_getPayInPlans(): Promise<FetchResponse<200, types.PayInPlanControllerGetPayInPlansResponse200>> {
    return this.core.fetch('/pay-ins/plans', 'get');
  }

  payInPlanController_getPayInPlan(metadata: types.PayInPlanControllerGetPayInPlanMetadataParam): Promise<FetchResponse<200, types.PayInPlanControllerGetPayInPlanResponse200>> {
    return this.core.fetch('/pay-ins/plans/{planId}', 'get', metadata);
  }

  payInPlanController_updatePayInPlan(body: types.PayInPlanControllerUpdatePayInPlanBodyParam, metadata: types.PayInPlanControllerUpdatePayInPlanMetadataParam): Promise<FetchResponse<200, types.PayInPlanControllerUpdatePayInPlanResponse200>> {
    return this.core.fetch('/pay-ins/plans/{planId}', 'patch', body, metadata);
  }

  payInPlanController_deletePayInPlan(metadata: types.PayInPlanControllerDeletePayInPlanMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/pay-ins/plans/{planId}', 'delete', metadata);
  }

  payInPlanController_getPayInPlanSubscriptions(metadata: types.PayInPlanControllerGetPayInPlanSubscriptionsMetadataParam): Promise<FetchResponse<200, types.PayInPlanControllerGetPayInPlanSubscriptionsResponse200>> {
    return this.core.fetch('/pay-ins/plans/{planId}/subscriptions', 'get', metadata);
  }

  payInPlanController_postPayInPlanSubscriptions(body: types.PayInPlanControllerPostPayInPlanSubscriptionsBodyParam, metadata: types.PayInPlanControllerPostPayInPlanSubscriptionsMetadataParam): Promise<FetchResponse<200, types.PayInPlanControllerPostPayInPlanSubscriptionsResponse200>> {
    return this.core.fetch('/pay-ins/plans/{planId}/subscriptions', 'post', body, metadata);
  }

  payInPlanController_getPayInPlanSubscriptionById(metadata: types.PayInPlanControllerGetPayInPlanSubscriptionByIdMetadataParam): Promise<FetchResponse<200, types.PayInPlanControllerGetPayInPlanSubscriptionByIdResponse200>> {
    return this.core.fetch('/pay-ins/plans/{planId}/subscriptions/{subscriptionId}', 'get', metadata);
  }

  payInPlanController_updatePayInPlanSubscription(body: types.PayInPlanControllerUpdatePayInPlanSubscriptionBodyParam, metadata: types.PayInPlanControllerUpdatePayInPlanSubscriptionMetadataParam): Promise<FetchResponse<200, types.PayInPlanControllerUpdatePayInPlanSubscriptionResponse200>> {
    return this.core.fetch('/pay-ins/plans/{planId}/subscriptions/{subscriptionId}', 'patch', body, metadata);
  }

  webSdkPayInController_createCheckout(body: types.WebSdkPayInControllerCreateCheckoutBodyParam): Promise<FetchResponse<201, types.WebSdkPayInControllerCreateCheckoutResponse201>> {
    return this.core.fetch('/pay-ins/checkout', 'post', body);
  }

  /**
   * Update checkout
   *
   */
  webSdkPayInController_updateCheckout(body: types.WebSdkPayInControllerUpdateCheckoutBodyParam, metadata: types.WebSdkPayInControllerUpdateCheckoutMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerUpdateCheckoutResponse201>> {
    return this.core.fetch('/pay-ins/checkout/{signedLinkId}', 'patch', body, metadata);
  }

  /**
   * Expire checkout
   *
   */
  webSdkPayInController_expireCheckout(metadata: types.WebSdkPayInControllerExpireCheckoutMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerExpireCheckoutResponse201>> {
    return this.core.fetch('/pay-ins/checkout/{signedLinkId}/expire', 'post', metadata);
  }

  webSdkPayInController_getCheckout(metadata: types.WebSdkPayInControllerGetCheckoutMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerGetCheckoutResponse201>> {
    return this.core.fetch('/pay-ins/checkout/{checkoutId}', 'get', metadata);
  }

  webSdkPayInController_getBanks(metadata?: types.WebSdkPayInControllerGetBanksMetadataParam): Promise<FetchResponse<200, types.WebSdkPayInControllerGetBanksResponse200>> {
    return this.core.fetch('/pay-ins/banks', 'get', metadata);
  }

  webSdkPayInController_createToken(body: types.WebSdkPayInControllerCreateTokenBodyParam): Promise<FetchResponse<201, types.WebSdkPayInControllerCreateTokenResponse201>> {
    return this.core.fetch('/pay-ins/token', 'post', body);
  }

  webSdkPayInController_createPayIn(body: types.WebSdkPayInControllerCreatePayInBodyParam): Promise<FetchResponse<201, types.WebSdkPayInControllerCreatePayInResponse201>> {
    return this.core.fetch('/pay-ins', 'post', body);
  }

  webSdkPayInController_getPayIn(metadata: types.WebSdkPayInControllerGetPayInMetadataParam): Promise<FetchResponse<200, types.WebSdkPayInControllerGetPayInResponse200>> {
    return this.core.fetch('/pay-ins/{authorizationId}', 'get', metadata);
  }

  webSdkPayInController_payInCapture(body: types.WebSdkPayInControllerPayInCaptureBodyParam, metadata: types.WebSdkPayInControllerPayInCaptureMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerPayInCaptureResponse201>> {
    return this.core.fetch('/pay-ins/{authorizationId}/capture', 'post', body, metadata);
  }

  webSdkPayInController_payInVoid(metadata: types.WebSdkPayInControllerPayInVoidMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerPayInVoidResponse201>> {
    return this.core.fetch('/pay-ins/{authorizationId}/void', 'post', metadata);
  }

  webSdkPayInController_payInRefund(body: types.WebSdkPayInControllerPayInRefundBodyParam, metadata: types.WebSdkPayInControllerPayInRefundMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerPayInRefundResponse201>> {
    return this.core.fetch('/pay-ins/{authorizationId}/refund', 'post', body, metadata);
  }

  webSdkPayInController_activateAuthorization(metadata: types.WebSdkPayInControllerActivateAuthorizationMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/pay-ins/{authorizationId}/activate', 'post', metadata);
  }

  webSdkPayInController_rescheduledCollection(body: types.WebSdkPayInControllerRescheduledCollectionBodyParam, metadata: types.WebSdkPayInControllerRescheduledCollectionMetadataParam): Promise<FetchResponse<201, types.WebSdkPayInControllerRescheduledCollectionResponse201>> {
    return this.core.fetch('/pay-ins/{authorizationId}/reschedule', 'post', body, metadata);
  }

  vendorPaymentMethodController_getAvailablePaymentMethods(metadata: types.VendorPaymentMethodControllerGetAvailablePaymentMethodsMetadataParam): Promise<FetchResponse<200, types.VendorPaymentMethodControllerGetAvailablePaymentMethodsResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/payment-methods/available', 'get', metadata);
  }

  payoutOptionsController_getPayoutOptions(): Promise<FetchResponse<201, types.PayoutOptionsControllerGetPayoutOptionsResponse201>> {
    return this.core.fetch('/payout-options', 'get');
  }

  webhookController_getWebhooks(): Promise<FetchResponse<200, types.WebhookControllerGetWebhooksResponse200>> {
    return this.core.fetch('/webhooks', 'get');
  }

  webhookController_createWebhook(body: types.WebhookControllerCreateWebhookBodyParam): Promise<FetchResponse<201, types.WebhookControllerCreateWebhookResponse201>> {
    return this.core.fetch('/webhooks', 'post', body);
  }

  webhookController_getWebhook(metadata: types.WebhookControllerGetWebhookMetadataParam): Promise<FetchResponse<200, types.WebhookControllerGetWebhookResponse200>> {
    return this.core.fetch('/webhooks/{webhookId}', 'get', metadata);
  }

  webhookController_updateWebhook(body: types.WebhookControllerUpdateWebhookBodyParam, metadata: types.WebhookControllerUpdateWebhookMetadataParam): Promise<FetchResponse<200, types.WebhookControllerUpdateWebhookResponse200>> {
    return this.core.fetch('/webhooks/{webhookId}', 'patch', body, metadata);
  }

  webhookController_deleteWebhook(metadata: types.WebhookControllerDeleteWebhookMetadataParam): Promise<FetchResponse<200, types.WebhookControllerDeleteWebhookResponse200>> {
    return this.core.fetch('/webhooks/{webhookId}', 'delete', metadata);
  }

  configurationController_getPublicConfiguration(): Promise<FetchResponse<202, types.ConfigurationControllerGetPublicConfigurationResponse202>> {
    return this.core.fetch('/configuration/public-configurations', 'get');
  }

  publicLinkController_getLink(metadata: types.PublicLinkControllerGetLinkMetadataParam): Promise<FetchResponse<200, types.PublicLinkControllerGetLinkResponse200>> {
    return this.core.fetch('/links/{linkId}', 'get', metadata);
  }

  publicLinkController_getTokens(metadata: types.PublicLinkControllerGetTokensMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/links/{linkId}/tokens', 'get', metadata);
  }

  publicLinkController_getLoginToken(metadata: types.PublicLinkControllerGetLoginTokenMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/links/{linkId}/tokens/login', 'get', metadata);
  }

  publicLinkController_sendLink(body: types.PublicLinkControllerSendLinkBodyParam, metadata: types.PublicLinkControllerSendLinkMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/links/{linkId}/send', 'post', body, metadata);
  }

  vendorLinkController_getLinks(metadata: types.VendorLinkControllerGetLinksMetadataParam): Promise<FetchResponse<200, types.VendorLinkControllerGetLinksResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/links', 'get', metadata);
  }

  vendorLinkController_createLink(body: types.VendorLinkControllerCreateLinkBodyParam, metadata: types.VendorLinkControllerCreateLinkMetadataParam): Promise<FetchResponse<201, types.VendorLinkControllerCreateLinkResponse201>> {
    return this.core.fetch('/vendors/{vendorId}/links', 'post', body, metadata);
  }

  vendorLinkController_disableLink(metadata: types.VendorLinkControllerDisableLinkMetadataParam): Promise<FetchResponse<200, types.VendorLinkControllerDisableLinkResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/links/{linkId}', 'delete', metadata);
  }

  reportController_getVolume(metadata: types.ReportControllerGetVolumeMetadataParam): Promise<FetchResponse<200, types.ReportControllerGetVolumeResponse200>> {
    return this.core.fetch('/reports/volume', 'get', metadata);
  }

  reportController_getRevenue(metadata: types.ReportControllerGetRevenueMetadataParam): Promise<FetchResponse<200, types.ReportControllerGetRevenueResponse200>> {
    return this.core.fetch('/reports/revenue', 'get', metadata);
  }

  reportController_getVendorRevenue(metadata: types.ReportControllerGetVendorRevenueMetadataParam): Promise<FetchResponse<200, types.ReportControllerGetVendorRevenueResponse200>> {
    return this.core.fetch('/reports/revenue/vendors', 'get', metadata);
  }

  reportController_getBalance(metadata: types.ReportControllerGetBalanceMetadataParam): Promise<FetchResponse<200, types.ReportControllerGetBalanceResponse200>> {
    return this.core.fetch('/reports/balance', 'get', metadata);
  }

  reportController_getVendorsFunnel(metadata?: types.ReportControllerGetVendorsFunnelMetadataParam): Promise<FetchResponse<200, types.ReportControllerGetVendorsFunnelResponse200>> {
    return this.core.fetch('/reports/vendors-funnel', 'get', metadata);
  }

  transferController_getTransfers(): Promise<FetchResponse<201, types.TransferControllerGetTransfersResponse201>> {
    return this.core.fetch('/transfers', 'get');
  }

  transferController_createTransfer(body: types.TransferControllerCreateTransferBodyParam): Promise<FetchResponse<201, types.TransferControllerCreateTransferResponse201>> {
    return this.core.fetch('/transfers', 'post', body);
  }

  transferController_commitTransfer(metadata: types.TransferControllerCommitTransferMetadataParam): Promise<FetchResponse<201, types.TransferControllerCommitTransferResponse201>> {
    return this.core.fetch('/transfers/{transferId}/commit', 'post', metadata);
  }

  transferController_cancelTransfer(metadata: types.TransferControllerCancelTransferMetadataParam): Promise<FetchResponse<201, types.TransferControllerCancelTransferResponse201>> {
    return this.core.fetch('/transfers/{transferId}/cancel', 'post', metadata);
  }

  transferController_getTransferById(metadata: types.TransferControllerGetTransferByIdMetadataParam): Promise<FetchResponse<201, types.TransferControllerGetTransferByIdResponse201>> {
    return this.core.fetch('/transfers/{transferId}', 'get', metadata);
  }

  vendorSettingsController_uploadVendorLogo(body: types.VendorSettingsControllerUploadVendorLogoBodyParam, metadata: types.VendorSettingsControllerUploadVendorLogoMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/settings/logo', 'post', body, metadata);
  }

  vendorSettingsController_getVendorLogo(metadata: types.VendorSettingsControllerGetVendorLogoMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/settings/logo', 'get', metadata);
  }

  vendorSettingsController_deleteVendorLogo(metadata: types.VendorSettingsControllerDeleteVendorLogoMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/settings/logo', 'delete', metadata);
  }

  openBankingController_link(metadata: types.OpenBankingControllerLinkMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/open-banking/link', 'post', metadata);
  }

  openBankingController_details(metadata: types.OpenBankingControllerDetailsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/open-banking/details', 'get', metadata);
  }

  openBankingController_exchange(): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/open-banking/exchange', 'post');
  }

  paymentController_getPayouts(metadata: types.PaymentControllerGetPayoutsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/embedded/payouts', 'get', metadata);
  }

  paymentController_getPayments(metadata: types.PaymentControllerGetPaymentsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/payments', 'get', metadata);
  }

  notificationController_getVendorNotifications(metadata: types.NotificationControllerGetVendorNotificationsMetadataParam): Promise<FetchResponse<200, types.NotificationControllerGetVendorNotificationsResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/notifications', 'get', metadata);
  }

  notificationController_updateVendorNotificationStatus(body: types.NotificationControllerUpdateVendorNotificationStatusBodyParam, metadata: types.NotificationControllerUpdateVendorNotificationStatusMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/notifications/read', 'post', body, metadata);
  }

  notificationController_getVendorNotificationSettings(metadata: types.NotificationControllerGetVendorNotificationSettingsMetadataParam): Promise<FetchResponse<200, types.NotificationControllerGetVendorNotificationSettingsResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/notifications/settings', 'get', metadata);
  }

  notificationController_updateVendorNotificationSettings(body: types.NotificationControllerUpdateVendorNotificationSettingsBodyParam, metadata: types.NotificationControllerUpdateVendorNotificationSettingsMetadataParam): Promise<FetchResponse<202, types.NotificationControllerUpdateVendorNotificationSettingsResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/notifications/settings', 'post', body, metadata);
  }

  notificationController_getNotificationTemplate(metadata: types.NotificationControllerGetNotificationTemplateMetadataParam): Promise<FetchResponse<202, types.NotificationControllerGetNotificationTemplateResponse202>> {
    return this.core.fetch('/vendors/{vendorId}/notifications/templates', 'get', metadata);
  }

  invoiceController_getListInvoices(metadata: types.InvoiceControllerGetListInvoicesMetadataParam): Promise<FetchResponse<200, types.InvoiceControllerGetListInvoicesResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/invoices', 'get', metadata);
  }

  invoiceController_createInvoice(body: types.InvoiceControllerCreateInvoiceBodyParam, metadata: types.InvoiceControllerCreateInvoiceMetadataParam): Promise<FetchResponse<200, types.InvoiceControllerCreateInvoiceResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/invoices', 'post', body, metadata);
  }

  invoiceController_getInvoice(metadata: types.InvoiceControllerGetInvoiceMetadataParam): Promise<FetchResponse<200, types.InvoiceControllerGetInvoiceResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/invoices/{invoicesId}', 'get', metadata);
  }

  invoiceController_updateInvoice(body: types.InvoiceControllerUpdateInvoiceBodyParam, metadata: types.InvoiceControllerUpdateInvoiceMetadataParam): Promise<FetchResponse<200, types.InvoiceControllerUpdateInvoiceResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/invoices/{invoicesId}', 'patch', body, metadata);
  }

  invoiceController_createInvoiceByReference(body: types.InvoiceControllerCreateInvoiceByReferenceBodyParam, metadata: types.InvoiceControllerCreateInvoiceByReferenceMetadataParam): Promise<FetchResponse<200, types.InvoiceControllerCreateInvoiceByReferenceResponse200>> {
    return this.core.fetch('/vendors/reference/{vendorReference}/invoices', 'post', body, metadata);
  }

  invoiceController_updateInvoiceByReference(body: types.InvoiceControllerUpdateInvoiceByReferenceBodyParam, metadata: types.InvoiceControllerUpdateInvoiceByReferenceMetadataParam): Promise<FetchResponse<200, types.InvoiceControllerUpdateInvoiceByReferenceResponse200>> {
    return this.core.fetch('/vendors/reference/{vendorReference}/invoices/{invoicesId}', 'patch', body, metadata);
  }

  consumerController_deletePaymentOption(metadata: types.ConsumerControllerDeletePaymentOptionMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/consumers/{consumerId}/payment-options/{paymentOptionId}', 'delete', metadata);
  }

  consumerController_createConsumer(body: types.ConsumerControllerCreateConsumerBodyParam): Promise<FetchResponse<201, types.ConsumerControllerCreateConsumerResponse201>> {
    return this.core.fetch('/consumers', 'post', body);
  }

  mandateController_createMandate(body: types.MandateControllerCreateMandateBodyParam, metadata: types.MandateControllerCreateMandateMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/mandates', 'post', body, metadata);
  }

  mandateController_getMandates(metadata: types.MandateControllerGetMandatesMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/mandates', 'get', metadata);
  }

  mandateController_sendMandate(body: types.MandateControllerSendMandateBodyParam, metadata: types.MandateControllerSendMandateMetadataParam): Promise<FetchResponse<200, types.MandateControllerSendMandateResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/mandates/{mandateId}/send', 'post', body, metadata);
  }

  mandateController_commitMandate(body: types.MandateControllerCommitMandateBodyParam, metadata: types.MandateControllerCommitMandateMetadataParam): Promise<FetchResponse<200, types.MandateControllerCommitMandateResponse200>> {
    return this.core.fetch('/vendors/{vendorId}/consumers/{consumerId}/mandates/{mandateId}/commit', 'post', body, metadata);
  }

  mandateController_cancelMandate(metadata: types.MandateControllerCancelMandateMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/mandates/{mandateId}/cancel', 'post', metadata);
  }

  mandateController_getMandateByConsumerId(metadata: types.MandateControllerGetMandateByConsumerIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/consumers/{consumerId}/mandates', 'get', metadata);
  }

  mandateController_getMandatePdfByConsumerId(metadata: types.MandateControllerGetMandatePdfByConsumerIdMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/consumers/{consumerId}/mandates/pdf', 'get', metadata);
  }

  mandateController_getMandateByConsumerReference(metadata: types.MandateControllerGetMandateByConsumerReferenceMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/consumers/reference/{consumerReference}/mandates', 'get', metadata);
  }

  processorController_getWebhooks(metadata: types.ProcessorControllerGetWebhooksMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/processors/{processorId}/webhooks', 'get', metadata);
  }

  processorController_postWebhooks(metadata: types.ProcessorControllerPostWebhooksMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/processors/{processorId}/webhooks', 'post', metadata);
  }

  aiController_getPaymentMethodsRecommendation(metadata: types.AiControllerGetPaymentMethodsRecommendationMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/ai/payment-methods-recommendation/vendor/{vendorId}/customer/{customerReference}', 'get', metadata);
  }

  chargebackController_getVendorChargebacks(metadata: types.ChargebackControllerGetVendorChargebacksMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/vendors/{vendorId}/chargebacks', 'get', metadata);
  }

  campaignController_getCampaignVendors(metadata: types.CampaignControllerGetCampaignVendorsMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/campaigns/vendors', 'get', metadata);
  }

  campaignController_addCampaignVendors(body: types.CampaignControllerAddCampaignVendorsBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/campaigns/vendors', 'post', body);
  }

  campaignController_removeCampaignVendors(body: types.CampaignControllerRemoveCampaignVendorsBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/campaigns/vendors/delete', 'post', body);
  }

  qrCodeController_generate(metadata: types.QrCodeControllerGenerateMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/qr-code/generate', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { AiControllerGetPaymentMethodsRecommendationMetadataParam, AuthControllerAuthorizeBodyParam, AuthControllerAuthorizeResponse201, CampaignControllerAddCampaignVendorsBodyParam, CampaignControllerGetCampaignVendorsMetadataParam, CampaignControllerRemoveCampaignVendorsBodyParam, ChargebackControllerGetVendorChargebacksMetadataParam, ConfigurationControllerGetPublicConfigurationResponse202, ConsumerControllerCreateConsumerBodyParam, ConsumerControllerCreateConsumerResponse201, ConsumerControllerDeletePaymentOptionMetadataParam, EwalletControllerCreateEwalletBodyParam, EwalletControllerCreateEwalletResponse201, EwalletControllerGetEwalletByIdMetadataParam, EwalletControllerGetEwalletByIdResponse202, EwalletControllerGetEwalletResponse202, EwalletControllerGetEwalletTransactionsMetadataParam, EwalletControllerGetEwalletTransactionsResponse202, InvoiceControllerCreateInvoiceBodyParam, InvoiceControllerCreateInvoiceByReferenceBodyParam, InvoiceControllerCreateInvoiceByReferenceMetadataParam, InvoiceControllerCreateInvoiceByReferenceResponse200, InvoiceControllerCreateInvoiceMetadataParam, InvoiceControllerCreateInvoiceResponse200, InvoiceControllerGetInvoiceMetadataParam, InvoiceControllerGetInvoiceResponse200, InvoiceControllerGetListInvoicesMetadataParam, InvoiceControllerGetListInvoicesResponse200, InvoiceControllerUpdateInvoiceBodyParam, InvoiceControllerUpdateInvoiceByReferenceBodyParam, InvoiceControllerUpdateInvoiceByReferenceMetadataParam, InvoiceControllerUpdateInvoiceByReferenceResponse200, InvoiceControllerUpdateInvoiceMetadataParam, InvoiceControllerUpdateInvoiceResponse200, MandateControllerCancelMandateMetadataParam, MandateControllerCommitMandateBodyParam, MandateControllerCommitMandateMetadataParam, MandateControllerCommitMandateResponse200, MandateControllerCreateMandateBodyParam, MandateControllerCreateMandateMetadataParam, MandateControllerGetMandateByConsumerIdMetadataParam, MandateControllerGetMandateByConsumerReferenceMetadataParam, MandateControllerGetMandatePdfByConsumerIdMetadataParam, MandateControllerGetMandatesMetadataParam, MandateControllerSendMandateBodyParam, MandateControllerSendMandateMetadataParam, MandateControllerSendMandateResponse200, NotificationControllerGetNotificationTemplateMetadataParam, NotificationControllerGetNotificationTemplateResponse202, NotificationControllerGetVendorNotificationSettingsMetadataParam, NotificationControllerGetVendorNotificationSettingsResponse200, NotificationControllerGetVendorNotificationsMetadataParam, NotificationControllerGetVendorNotificationsResponse200, NotificationControllerUpdateVendorNotificationSettingsBodyParam, NotificationControllerUpdateVendorNotificationSettingsMetadataParam, NotificationControllerUpdateVendorNotificationSettingsResponse202, NotificationControllerUpdateVendorNotificationStatusBodyParam, NotificationControllerUpdateVendorNotificationStatusMetadataParam, OnboardingControllerGetOnboardingFlatFormsMetadataParam, OnboardingControllerGetOnboardingFlatFormsResponse200, OnboardingControllerGetOnboardingOverviewMetadataParam, OnboardingControllerGetOnboardingOverviewResponse200, OnboardingControllerPostAndSubmitFileBodyParam, OnboardingControllerPostAndSubmitFileMetadataParam, OnboardingControllerPostAndSubmitFileResponse201, OnboardingControllerPostOnboardingFlatFormsBodyParam, OnboardingControllerPostOnboardingFlatFormsMetadataParam, OnboardingControllerPostOnboardingFlatFormsResponse201, OnboardingControllerRequireOnboardingActionBodyParam, OnboardingControllerRequireOnboardingActionMetadataParam, OnboardingControllerRequireOnboardingActionResponse201, OpenBankingControllerDetailsMetadataParam, OpenBankingControllerLinkMetadataParam, PayInPlanControllerCreatePayInPlanBodyParam, PayInPlanControllerCreatePayInPlanResponse201, PayInPlanControllerDeletePayInPlanMetadataParam, PayInPlanControllerGetPayInPlanMetadataParam, PayInPlanControllerGetPayInPlanResponse200, PayInPlanControllerGetPayInPlanSubscriptionByIdMetadataParam, PayInPlanControllerGetPayInPlanSubscriptionByIdResponse200, PayInPlanControllerGetPayInPlanSubscriptionsMetadataParam, PayInPlanControllerGetPayInPlanSubscriptionsResponse200, PayInPlanControllerGetPayInPlansResponse200, PayInPlanControllerPostPayInPlanSubscriptionsBodyParam, PayInPlanControllerPostPayInPlanSubscriptionsMetadataParam, PayInPlanControllerPostPayInPlanSubscriptionsResponse200, PayInPlanControllerUpdatePayInPlanBodyParam, PayInPlanControllerUpdatePayInPlanMetadataParam, PayInPlanControllerUpdatePayInPlanResponse200, PayInPlanControllerUpdatePayInPlanSubscriptionBodyParam, PayInPlanControllerUpdatePayInPlanSubscriptionMetadataParam, PayInPlanControllerUpdatePayInPlanSubscriptionResponse200, PaymentControllerGetPaymentsMetadataParam, PaymentControllerGetPayoutsMetadataParam, PaymentOptionsControllerGetPaymentOptionsResponse201, PayoutControllerCancelPayoutMetadataParam, PayoutControllerCancelPayoutResponse201, PayoutControllerCommitPayoutMetadataParam, PayoutControllerCommitPayoutResponse201, PayoutControllerCreatePayoutBodyParam, PayoutControllerCreatePayoutResponse201, PayoutControllerDeletePayoutConfigurationResponse201, PayoutControllerDrillThroughPayoutMetadataParam, PayoutControllerDrillThroughPayoutResponse201, PayoutControllerGetPayoutByIdMetadataParam, PayoutControllerGetPayoutByIdResponse201, PayoutControllerGetPayoutConfigurationResponse201, PayoutControllerGetPayoutsMetadataParam, PayoutControllerGetPayoutsResponse201, PayoutControllerSetPayoutConfigurationBodyParam, PayoutControllerSetPayoutConfigurationResponse201, PayoutOptionsControllerGetPayoutOptionsResponse201, ProcessorControllerGetWebhooksMetadataParam, ProcessorControllerPostWebhooksMetadataParam, PublicLinkControllerGetLinkMetadataParam, PublicLinkControllerGetLinkResponse200, PublicLinkControllerGetLoginTokenMetadataParam, PublicLinkControllerGetTokensMetadataParam, PublicLinkControllerSendLinkBodyParam, PublicLinkControllerSendLinkMetadataParam, QrCodeControllerGenerateMetadataParam, ReportControllerGetBalanceMetadataParam, ReportControllerGetBalanceResponse200, ReportControllerGetRevenueMetadataParam, ReportControllerGetRevenueResponse200, ReportControllerGetVendorRevenueMetadataParam, ReportControllerGetVendorRevenueResponse200, ReportControllerGetVendorsFunnelMetadataParam, ReportControllerGetVendorsFunnelResponse200, ReportControllerGetVolumeMetadataParam, ReportControllerGetVolumeResponse200, TransferControllerCancelTransferMetadataParam, TransferControllerCancelTransferResponse201, TransferControllerCommitTransferMetadataParam, TransferControllerCommitTransferResponse201, TransferControllerCreateTransferBodyParam, TransferControllerCreateTransferResponse201, TransferControllerGetTransferByIdMetadataParam, TransferControllerGetTransferByIdResponse201, TransferControllerGetTransfersResponse201, VendorControllerCreateVendorBodyParam, VendorControllerCreateVendorResponse201, VendorControllerGetAllVendorResponse202, VendorControllerGetAuthorizationsMetadataParam, VendorControllerGetMarketingConfigurationMetadataParam, VendorControllerGetMarketingConfigurationResponse202, VendorControllerGetMarketingDataMetadataParam, VendorControllerGetMarketingDataResponse202, VendorControllerGetPlatformFeeConfigurationMetadataParam, VendorControllerGetPlatformFeeConfigurationResponse202, VendorControllerGetPublicConfigurationMetadataParam, VendorControllerGetPublicConfigurationResponse202, VendorControllerGetVendorByIdMetadataParam, VendorControllerGetVendorByIdResponse202, VendorControllerUpdateCommunicationEmailBodyParam, VendorControllerUpdateCommunicationEmailMetadataParam, VendorControllerUpdateCommunicationEmailResponse202, VendorControllerUpdateDescriptorBodyParam, VendorControllerUpdateDescriptorMetadataParam, VendorControllerUpdateDescriptorResponse200, VendorEwalletControllerCreateEwalletBodyParam, VendorEwalletControllerCreateEwalletMetadataParam, VendorEwalletControllerCreateEwalletResponse201, VendorEwalletControllerGetEwalletMetadataParam, VendorEwalletControllerGetEwalletResponse202, VendorEwalletControllerGetEwalletTransactionsByVendorIdMetadataParam, VendorEwalletControllerGetEwalletTransactionsByVendorIdResponse202, VendorEwalletControllerGetEwalletTransactionsMetadataParam, VendorEwalletControllerGetEwalletTransactionsResponse202, VendorLinkControllerCreateLinkBodyParam, VendorLinkControllerCreateLinkMetadataParam, VendorLinkControllerCreateLinkResponse201, VendorLinkControllerDisableLinkMetadataParam, VendorLinkControllerDisableLinkResponse200, VendorLinkControllerGetLinksMetadataParam, VendorLinkControllerGetLinksResponse200, VendorPaymentMethodControllerGetAvailablePaymentMethodsMetadataParam, VendorPaymentMethodControllerGetAvailablePaymentMethodsResponse200, VendorPaymentOptionsControllerGetAvailablePaymentOptionsMetadataParam, VendorPaymentOptionsControllerGetPaymentOptionsMetadataParam, VendorPaymentOptionsControllerGetPaymentOptionsResponse201, VendorPayoutControllerCancelPayoutMetadataParam, VendorPayoutControllerCancelPayoutResponse201, VendorPayoutControllerCommitPayoutMetadataParam, VendorPayoutControllerCommitPayoutResponse201, VendorPayoutControllerCreatePayoutBodyParam, VendorPayoutControllerCreatePayoutMetadataParam, VendorPayoutControllerCreatePayoutResponse201, VendorPayoutControllerDeleteVendorPayoutConfigurationMetadataParam, VendorPayoutControllerDeleteVendorPayoutConfigurationResponse201, VendorPayoutControllerDrillThroughPayoutMetadataParam, VendorPayoutControllerDrillThroughPayoutResponse201, VendorPayoutControllerGetPayoutsMetadataParam, VendorPayoutControllerGetPayoutsResponse201, VendorPayoutControllerGetVendorPayoutConfigurationMetadataParam, VendorPayoutControllerGetVendorPayoutConfigurationResponse201, VendorPayoutControllerSetVendorPayoutConfigurationBodyParam, VendorPayoutControllerSetVendorPayoutConfigurationMetadataParam, VendorPayoutControllerSetVendorPayoutConfigurationResponse201, VendorPayoutOptionsControllerGetPayoutOptionsMetadataParam, VendorPayoutOptionsControllerGetPayoutOptionsResponse201, VendorSettingsControllerDeleteVendorLogoMetadataParam, VendorSettingsControllerGetVendorLogoMetadataParam, VendorSettingsControllerUploadVendorLogoBodyParam, VendorSettingsControllerUploadVendorLogoMetadataParam, WebSdkPayInControllerActivateAuthorizationMetadataParam, WebSdkPayInControllerCreateCheckoutBodyParam, WebSdkPayInControllerCreateCheckoutResponse201, WebSdkPayInControllerCreatePayInBodyParam, WebSdkPayInControllerCreatePayInResponse201, WebSdkPayInControllerCreateTokenBodyParam, WebSdkPayInControllerCreateTokenResponse201, WebSdkPayInControllerExpireCheckoutMetadataParam, WebSdkPayInControllerExpireCheckoutResponse201, WebSdkPayInControllerGetBanksMetadataParam, WebSdkPayInControllerGetBanksResponse200, WebSdkPayInControllerGetCheckoutMetadataParam, WebSdkPayInControllerGetCheckoutResponse201, WebSdkPayInControllerGetPayInMetadataParam, WebSdkPayInControllerGetPayInResponse200, WebSdkPayInControllerPayInCaptureBodyParam, WebSdkPayInControllerPayInCaptureMetadataParam, WebSdkPayInControllerPayInCaptureResponse201, WebSdkPayInControllerPayInRefundBodyParam, WebSdkPayInControllerPayInRefundMetadataParam, WebSdkPayInControllerPayInRefundResponse201, WebSdkPayInControllerPayInVoidMetadataParam, WebSdkPayInControllerPayInVoidResponse201, WebSdkPayInControllerRescheduledCollectionBodyParam, WebSdkPayInControllerRescheduledCollectionMetadataParam, WebSdkPayInControllerRescheduledCollectionResponse201, WebSdkPayInControllerUpdateCheckoutBodyParam, WebSdkPayInControllerUpdateCheckoutMetadataParam, WebSdkPayInControllerUpdateCheckoutResponse201, WebhookControllerCreateWebhookBodyParam, WebhookControllerCreateWebhookResponse201, WebhookControllerDeleteWebhookMetadataParam, WebhookControllerDeleteWebhookResponse200, WebhookControllerGetWebhookMetadataParam, WebhookControllerGetWebhookResponse200, WebhookControllerGetWebhooksResponse200, WebhookControllerUpdateWebhookBodyParam, WebhookControllerUpdateWebhookMetadataParam, WebhookControllerUpdateWebhookResponse200 } from './types';
