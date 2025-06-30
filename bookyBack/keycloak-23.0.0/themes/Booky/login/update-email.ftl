<#import "template.ftl" as layout>
<#import "password-commons.ftl" as passwordCommons>

<style>
    /* General form styling */
    #kc-update-email-form {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
    }

    /* Form group styling */
    .${properties.kcFormGroupClass!} {
        margin-bottom: 20px;
    }

    /* Label styling */
    .${properties.kcLabelWrapperClass!} label {
        font-size: 1.1em;
        color: #333;
    }

    /* Input field styling */
    .${properties.kcInputWrapperClass!} input {
        width: 100%;
        padding: 10px;
        font-size: 1em;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
    }

    /* Error message styling */
    .${properties.kcInputErrorMessageClass!} {
        color: red;
        font-size: 0.9em;
        margin-top: 5px;
        display: block;
    }

    /* Form button styling */
    #kc-form-buttons {
        text-align: center;
        margin-top: 20px;
    }

    .${properties.kcButtonClass!} {
        padding: 10px 20px;
        font-size: 1.1em;
        border: none;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s;
    }

    .${properties.kcButtonPrimaryClass!} {
        background-color: #4CAF50;
        color: white;
    }

    .${properties.kcButtonDefaultClass!} {
        background-color: #f44336;
        color: white;
    }

    .${properties.kcButtonLargeClass!} {
        font-size: 1.2em;
    }

    .${properties.kcButtonBlockClass!} {
        width: 100%;
    }

    /* Additional button hover effects */
    .${properties.kcButtonPrimaryClass!}:hover {
        background-color: #45a049;
    }

    .${properties.kcButtonDefaultClass!}:hover {
        background-color: #e53935;
    }
</style>

<@layout.registrationLayout displayMessage=!messagesPerField.existsError('email'); section>
    <#if section == "header">
        ${msg("updateEmailTitle")}
    <#elseif section == "form">
        <form id="kc-update-email-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="email" class="${properties.kcLabelClass!}">${msg("email")}</label>
                </div>
                <div class="${properties.kcInputWrapperClass!}">
                    <input type="text" id="email" name="email" value="${(email.value!'')}"
                           class="${properties.kcInputClass!}" 
                           aria-invalid="<#if messagesPerField.existsError('email')>true</#if>"
                    />

                    <#if messagesPerField.existsError('email')>
                        <span id="input-error-email" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                            ${kcSanitize(messagesPerField.get('email'))?no_esc}
                        </span>
                    </#if>
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <!-- Additional options can go here -->
                    </div>
                </div>

                <@passwordCommons.logoutOtherSessions/>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <#if isAppInitiatedAction??>
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}" />
                        <button class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}" type="submit" name="cancel-aia" value="true" />${msg("doCancel")}</button>
                    <#else>
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}" />
                    </#if>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
