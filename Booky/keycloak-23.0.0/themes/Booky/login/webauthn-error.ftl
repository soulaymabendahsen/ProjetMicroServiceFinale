<#import "template.ftl" as layout>

<style>
    /* General form styling */
    #kc-error-credential-form {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Button styling */
    .${properties.kcButtonClass!} {
        padding: 12px 25px;
        font-size: 1.1em;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s ease;
        margin: 10px 0;
    }

    /* Primary button styling */
    .${properties.kcButtonPrimaryClass!} {
        background-color: #4CAF50;
        color: white;
    }

    /* Default button styling */
    .${properties.kcButtonDefaultClass!} {
        background-color: #f44336;
        color: white;
    }

    /* Large button style */
    .${properties.kcButtonLargeClass!} {
        font-size: 1.2em;
    }

    /* Block button style */
    .${properties.kcButtonBlockClass!} {
        width: 100%;
    }

    /* Button hover effect */
    .${properties.kcButtonPrimaryClass!}:hover {
        background-color: #45a049;
    }

    .${properties.kcButtonDefaultClass!}:hover {
        background-color: #e53935;
    }
</style>

<@layout.registrationLayout displayMessage=true; section>
    <#if section == "header">
        ${kcSanitize(msg("webauthn-error-title"))?no_esc}
    <#elseif section == "form">

        <script type="text/javascript">
            refreshPage = () => {
                document.getElementById('isSetRetry').value = 'retry';
                document.getElementById('executionValue').value = '${execution}';
                document.getElementById('kc-error-credential-form').submit();
            }
        </script>

        <form id="kc-error-credential-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <input type="hidden" id="executionValue" name="authenticationExecution"/>
            <input type="hidden" id="isSetRetry" name="isSetRetry"/>
        </form>

        <input tabindex="4" onclick="refreshPage()" type="button"
               class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
               name="try-again" id="kc-try-again" value="${kcSanitize(msg("doTryAgain"))?no_esc}"
        />

        <#if isAppInitiatedAction??>
            <form action="${url.loginAction}" class="${properties.kcFormClass!}" id="kc-webauthn-settings-form" method="post">
                <button type="submit"
                        class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                        id="cancelWebAuthnAIA" name="cancel-aia" value="true">${msg("doCancel")}
                </button>
            </form>
        </#if>

    </#if>
</@layout.registrationLayout>
