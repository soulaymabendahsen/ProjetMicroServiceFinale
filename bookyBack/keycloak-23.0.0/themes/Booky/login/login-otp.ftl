<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>
<#import "components/input/primary.ftl" as inputPrimary>
<#import "components/label/totp.ftl" as labelTotp>
<#import "components/link/secondary.ftl" as linkSecondary>
<#import "components/radio/primary.ftl" as radioPrimary>

<@layout.registrationLayout
  displayMessage=!messagesPerField.existsError("totp")
  ;
  section
>
  <#if section=="header">
    <h1 class="text-3xl font-semibold text-center text-gray-800 mb-6">${msg("doLogIn")}</h1>
  </#if>

  <#elseif section=="form">
    <form action="${url.loginAction}" class="space-y-6" method="post">
      
      <#if otpLogin.userOtpCredentials?size gt 1>
        <div class="space-y-4">
          <#list otpLogin.userOtpCredentials as otpCredential>
            <@radioPrimary.kw
              checked=(otpCredential.id == otpLogin.selectedCredentialId)
              id="kw-otp-credential-${otpCredential?index}"
              name="selectedCredentialId"
              tabIndex="${otpCredential?index}"
              value="${otpCredential.id}"
              class="flex items-center space-x-2 text-lg"
            >
              <span class="text-gray-700">${otpCredential.userLabel}</span>
            </@radioPrimary.kw>
          </#list>
        </div>
      </#if>

      <div class="space-y-3">
        <@inputPrimary.kw
          autocomplete="off"
          autofocus=true
          invalid=["totp"]
          name="otp"
          type="text"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <@labelTotp.kw class="text-lg text-gray-700" />
        </@inputPrimary.kw>
      </div>

      <div class="pt-4 flex justify-center items-center">
        <@buttonPrimary.kw name="submitAction" type="submit" class="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
          ${msg("doLogIn")}
        </@buttonPrimary.kw>
      </div>
    </form>
  </#if>
</@layout.registrationLayout>
