<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>

<style>
  .m-0 {
    margin: 0;
  }
  .space-y-4 > * + * {
    margin-top: 1rem; /* Adjust spacing between elements */
  }
  .button-primary {
    background-color: #0a6e89;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    text-align: center;
  }
  .button-primary:hover {
    background-color: #084e63;
  }
</style>

<@layout.registrationLayout; section>
  <#if section == "header">
    ${msg("confirmLinkIdpTitle")}
  <#elseif section == "form">
    <form action="${url.loginAction}" class="m-0 space-y-4" method="post">
      <div>
        <@buttonPrimary.kw name="submitAction" type="submit" value="updateProfile" class="button-primary">
          ${msg("confirmLinkIdpReviewProfile")}
        </@buttonPrimary.kw>
      </div>
      <div>
        <@buttonPrimary.kw name="submitAction" type="submit" value="linkAccount" class="button-primary">
          ${msg("confirmLinkIdpContinue", idpDisplayName)}
        </@buttonPrimary.kw>
      </div>
    </form>
  <#elseif>
</@layout.registrationLayout>
