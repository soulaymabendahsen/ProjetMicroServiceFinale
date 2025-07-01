<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>
<#import "components/input/primary.ftl" as inputPrimary>

<@layout.registrationLayout
  displayMessage=!messagesPerField.existsError("password", "password-confirm")
  ;
  section
>

  <#if section == "header">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">${msg("updatePasswordTitle")}</h1>
  <#elseif section == "form">
    <form action="${url.loginAction}" class="m-0 space-y-6 p-6 bg-white rounded-lg" method="post">
      <input
        autocomplete="username"
        name="username"
        type="hidden"
        value="${username}"
      >
      <input autocomplete="current-password" name="password" type="hidden">

      <!-- New Password Input -->
      <div class="space-y-4">
        <div>
          <@inputPrimary.kw
            autocomplete="new-password"
            autofocus=true
            invalid=["password", "password-confirm"]
            message=false
            name="password-new"
            type="password"
          >
            ${msg("passwordNew")}
          </@inputPrimary.kw>
        </div>

        <!-- Confirm Password Input -->
        <div>
          <@inputPrimary.kw
            autocomplete="new-password"
            invalid=["password-confirm"]
            name="password-confirm"
            type="password"
          >
            ${msg("passwordConfirm")}
          </@inputPrimary.kw>
        </div>
      </div>

      <!-- Submit Button -->
      <div>
        <@buttonPrimary.kw type="submit" class="w-full py-3">
          ${msg("doSubmit")}
        </@buttonPrimary.kw>
      </div>
    </form>
  </#if>

</@layout.registrationLayout>

<!-- Styling Improvements -->
<style>
  /* General Form Styles */
  .space-y-6 {
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .p-6 {
    padding: 1.5rem;
  }

  .bg-white {
    background-color: #ffffff;
  }

  .rounded-lg {
    border-radius: 8px;
  }

  .text-gray-800 {
    color: #333;
  }

  .text-center {
    text-align: center;
  }

  .mb-6 {
    margin-bottom: 1.5rem;
  }

  .w-full {
    width: 100%;
  }

  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  /* Additional spacing for label */
  .input-primary {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    width: 100%;
  }

  .input-primary:focus {
    border-color: #2563eb;
    outline: none;
  }
</style>
