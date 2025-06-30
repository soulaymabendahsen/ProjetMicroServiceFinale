<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>
<#import "components/input/primary.ftl" as inputPrimary>

<@layout.registrationLayout
  displayMessage=!messagesPerField.existsError("email", "firstName", "lastName", "username")
  ;
  section
>

  <#if section == "header">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">${msg("loginProfileTitle")}</h1>
  <#elseif section == "form">
    <form action="${url.loginAction}" class="m-0 space-y-6 p-6 bg-white rounded-lg" method="post">
      
      <!-- Username Field -->
      <#if user.editUsernameAllowed>
        <div>
          <@inputPrimary.kw
            autocomplete="username"
            autofocus=true
            invalid=["username"]
            name="username"
            type="text"
            value=(user.username)!'' 
          >
            ${msg("username")}
          </@inputPrimary.kw>
        </div>
      </#if>

      <!-- Email Field -->
      <div>
        <@inputPrimary.kw
          autocomplete="email"
          invalid=["email"]
          name="email"
          type="email"
          value=(user.email)!'' 
        >
          ${msg("email")}
        </@inputPrimary.kw>
      </div>

      <!-- First Name Field -->
      <div>
        <@inputPrimary.kw
          autocomplete="given-name"
          invalid=["firstName"]
          name="firstName"
          type="text"
          value=(user.firstName)!'' 
        >
          ${msg("firstName")}
        </@inputPrimary.kw>
      </div>

      <!-- Last Name Field -->
      <div>
        <@inputPrimary.kw
          autocomplete="family-name"
          invalid=["lastName"]
          name="lastName"
          type="text"
          value=(user.lastName)!'' 
        >
          ${msg("lastName")}
        </@inputPrimary.kw>
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

<!-- Additional Styling Improvements -->
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

  /* Input Styling */
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
