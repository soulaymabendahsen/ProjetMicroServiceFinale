<#import "template.ftl" as layout>
<#import "user-profile-commons.ftl" as userProfileCommons>

<style>
    /* General form styling */
    #kc-update-profile-form {
        max-width: 700px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Form group styling */
    .${properties.kcFormGroupClass!} {
        margin-bottom: 20px;
    }

    /* Label styling */
    .${properties.kcLabelWrapperClass!} label {
        font-size: 1.1em;
        color: #333;
        display: block;
        margin-bottom: 8px;
    }

    /* Input field styling */
    .${properties.kcInputWrapperClass!} input {
        width: 100%;
        padding: 12px;
        font-size: 1em;
        border-radius: 4px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        margin-bottom: 10px;
    }

    /* Error message styling */
    .${properties.kcInputErrorMessageClass!} {
        color: red;
        font-size: 0.9em;
        margin-top: 5px;
        display: block;
    }

    /* Form buttons container */
    #kc-form-buttons {
        text-align: center;
        margin-top: 20px;
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

<@layout.registrationLayout displayMessage=messagesPerField.exists('global') displayRequiredFields=true; section>
    <#if section == "header">
        ${msg("loginProfileTitle")}
    <#elseif section == "form">
        <form id="kc-update-profile-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">

            <@userProfileCommons.userProfileFormFields/>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <!-- Additional options can go here -->
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <#if isAppInitiatedAction??>
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}" />
                        <button class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}" type="submit" name="cancel-aia" value="true" formnovalidate/>${msg("doCancel")}</button>
                    <#else>
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}" />
                    </#if>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
