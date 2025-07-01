<#import "template.ftl" as layout>
<#import "components/provider.ftl" as provider>
<#import "components/button/primary.ftl" as buttonPrimary>
<#import "components/checkbox/primary.ftl" as checkboxPrimary>
<#import "components/input/primary.ftl" as inputPrimary>
<#import "components/label/username.ftl" as labelUsername>
<#import "components/link/primary.ftl" as linkPrimary>

<style>
  .loader {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    display: none;
  }

  .loader .dot {
    width: 20px;
    height: 20px;
    margin: 0 5px;
    background-color: red;
    border-radius: 50%;
    animation: jiggle 0.6s infinite alternate;
  }

  .loader .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loader .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes jiggle {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-10px);
    }
  }
</style>

<@layout.registrationLayout
  displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??
  displayMessage=!messagesPerField.existsError("username", "password")
  ;
  section
>
  <#if section="header">
    ${msg("loginAccountTitle")}
  <#elseif section="form">
    <#if realm.password>
      <form
        id="kc-login-form"
        style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
        action="${url.loginAction}"
        class="m-0 space-y-2"
        method="post"
        onsubmit="showLoader()"
      >
        <input
          name="credentialId"
          type="hidden"
          value="<#if auth.selectedCredential?has_content>${auth.selectedCredential}</#if>"
        >
        <div>
          <@inputPrimary.kw
            autocomplete=realm.loginWithEmailAllowed?string("email", "username")
            autofocus=true
            disabled=usernameEditDisabled??
            invalid=["username", "password"]
            name="username"
            type="text"
            value=(login.username)!'' 
          >
            <@labelUsername.kw />
          </@inputPrimary.kw>
        </div>
        <div>
          <@inputPrimary.kw
            invalid=["username", "password"]
            message=false
            name="password"
            type="password"
          >
            ${msg("password")}
          </@inputPrimary.kw>
        </div>
        <div class="pt-2">
          <@buttonPrimary.kw name="login" type="submit">
            ${msg("doLogIn")}
          </@buttonPrimary.kw>
        </div>
        <div class="flex justify-center">
          <#if realm.rememberMe && !usernameEditDisabled??>
            <@checkboxPrimary.kw checked=login.rememberMe?? name="rememberMe">
              ${msg("rememberMe")}
            </@checkboxPrimary.kw>
          </#if>
        </div>
        <!-- Flex container for Forgot Password and Sign Up links -->
        <div class="flex justify-between w-full pt-4">
          <#if realm.resetPasswordAllowed >
            <@linkPrimary.kw href=url.loginResetCredentialsUrl>
              <span class="text-sm">${msg("doForgotPassword")}</span>
            </@linkPrimary.kw>
          </#if>
          <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
            <@linkPrimary.kw href=url.registrationUrl>
              <span class="text-sm">${msg("doRegister")}</span>
            </@linkPrimary.kw>
          </#if>
        </div>  
      </form>
      <div class="loader" id="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </#if>
  <#elseif section="info">
    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
    </#if>
  </#if>
</@layout.registrationLayout>

<script>
  function showLoader() {
    document.getElementById('kc-login-form').style.display = 'none';
    document.getElementById('loader').style.display = 'flex';
  }
</script>

