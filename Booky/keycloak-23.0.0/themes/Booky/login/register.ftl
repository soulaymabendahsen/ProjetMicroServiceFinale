<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>
<#import "components/input/primary.ftl" as inputPrimary>
<#import "components/link/secondary.ftl" as linkSecondary>

<@layout.registrationLayout
  displayMessage=!messagesPerField.existsError("firstName", "lastName", "email", "username", "password", "password-confirm", "user.attributes.mobile_number")
  ; section
>
  <#if section="header">
    <h1 class="text-2xl font-semibold text-center mb-6">${msg("registerTitle")}</h1>
  <#elseif section="form">
    <form action="${url.registrationAction}" class="m-0 space-y-6" method="post">
      <!-- Grid for form fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- First Name -->
        <div>
          <@inputPrimary.kw
            autocomplete="given-name"
            autofocus=true
            invalid=["firstName"]
            name="firstName"
            type="text"
            value=(register.formData.firstName)!'' 
          >
            ${msg("firstName")}
          </@inputPrimary.kw>
        </div>
        
        <!-- Last Name -->
        <div>
          <@inputPrimary.kw
            autocomplete="family-name"
            invalid=["lastName"]
            name="lastName"
            type="text"
            value=(register.formData.lastName)!'' 
          >
            ${msg("lastName")}
          </@inputPrimary.kw>
        </div>

        <!-- Email -->
        <div>
          <@inputPrimary.kw
            autocomplete="email"
            invalid=["email"]
            name="email"
            type="email"
            value=(register.formData.email)!'' 
          >
            ${msg("email")}
          </@inputPrimary.kw>
        </div>

        <#if !realm.registrationEmailAsUsername>
          <!-- Username -->
          <div>
            <@inputPrimary.kw
              autocomplete="username"
              invalid=["username"]
              name="username"
              type="text"
              value=(register.formData.username)!'' 
            >
              ${msg("username")}
            </@inputPrimary.kw>
          </div>

          <!-- Mobile Number -->
          <div>
            <input type="tel" 
                   class="block w-full mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-200"
                   name="user.attributes.mobile_number" 
                   value="${(register.formData['user.attributes.mobile_number']!'')}"
                   placeholder="${msg('phoneNumber')}" 
                   pattern="\d{8}" 
                   title="Phone number must be exactly 8 digits" 
                   required/>
          </div>
        </#if>

        <#if passwordRequired??>
          <!-- Password -->
          <div>
            <@inputPrimary.kw
              autocomplete="new-password"
              invalid=["password", "password-confirm"]
              message=false
              name="password"
              type="password"
            >
              ${msg("password")}
            </@inputPrimary.kw>
          </div>

          <!-- Password Confirmation -->
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
        </#if>

        <#if recaptchaRequired??>
          <!-- ReCaptcha -->
          <div>
            <div class="g-recaptcha" data-sitekey="${recaptchaSiteKey}" data-size="compact"></div>
          </div>
        </#if>
      </div>

      <!-- Submit Button -->
      <div class="mt-4">
        <@buttonPrimary.kw type="submit" class="w-full py-3 text-lg">
          ${msg("doRegister")}
        </@buttonPrimary.kw>
      </div>
    </form>

  <#elseif section="nav">
    <div class="mt-4 text-center">
      <@linkSecondary.kw href=url.loginUrl>
        <span class="text-sm text-gray-600">${kcSanitize(msg("backToLogin"))?no_esc}</span>
      </@linkSecondary.kw>
    </div>
  </#if>
</@layout.registrationLayout>
