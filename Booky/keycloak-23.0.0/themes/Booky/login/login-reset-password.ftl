<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>
<#import "components/input/primary.ftl" as inputPrimary>
<#import "components/label/username.ftl" as labelUsername>
<#import "components/link/secondary.ftl" as linkSecondary>

<@layout.registrationLayout
  displayInfo=true
  displayMessage=!messagesPerField.existsError("username")
  ;
  section
>

  <#if section == "header">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">${msg("emailForgotTitle")}</h1>
  <#elseif section == "form">
    <form action="${url.loginAction}" class="m-0 space-y-6 p-6 bg-white rounded-lg" method="post">
      <div class="space-y-4">
        <div>
          <@inputPrimary.kw
            autocomplete=realm.loginWithEmailAllowed?string("email", "username")
            autofocus=true
            invalid=["username"]
            name="username"
            type="text"
            value=(auth?has_content && auth.showUsername())?then(auth.attemptedUsername, '')
          >
            <@labelUsername.kw />
          </@inputPrimary.kw>
        </div>
        <div>
          <@buttonPrimary.kw type="submit" class="w-full py-3">
            ${msg("doSubmit")}
          </@buttonPrimary.kw>
        </div>
      </div>
    </form>
  <#elseif section == "info">
    <!-- Add info content here if required -->
  <#elseif section == "nav">
    <div class="text-center mt-4">
      <@linkSecondary.kw href=url.loginUrl>
        <span class="text-sm text-blue-600 hover:text-blue-700">${kcSanitize(msg("backToLogin"))?no_esc}</span>
      </@linkSecondary.kw>
    </div>
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

  .text-sm {
    font-size: 0.875rem;
  }

  .text-blue-600 {
    color: #2563eb;
  }

  .text-blue-600:hover {
    color: #1d4ed8;
  }

  .w-full {
    width: 100%;
  }

  .py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

  /* Additional spacing for label */
  .label-username {
    font-size: 1rem;
    color: #4a4a4a;
  }

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
