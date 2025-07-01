<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('totp'); section>

<#if section == "header">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">${msg("doLogIn")}</h1>
<#elseif section == "form">
    <form id="kc-otp-reset-form" class="${properties.kcFormClass!} p-6 rounded-lg shadow-lg bg-white" action="${url.loginAction}" method="post">

        <!-- OTP Reset Description -->
        <div class="${properties.kcFormGroupClass!} mb-6">
            <p id="kc-otp-reset-form-description" class="text-lg text-gray-700">
                ${msg("otp-reset-description")}
            </p>
        </div>

        <!-- OTP Credential List -->
        <div class="${properties.kcInputWrapperClass!} mb-6">
            <#list configuredOtpCredentials.userOtpCredentials as otpCredential>
                <div class="flex items-center space-x-3">
                    <input id="kc-otp-credential-${otpCredential?index}" 
                           class="${properties.kcLoginOTPListInputClass!} hidden" 
                           type="radio" 
                           name="selectedCredentialId" 
                           value="${otpCredential.id}" 
                           <#if otpCredential.id == configuredOtpCredentials.selectedCredentialId>checked="checked"</#if> />
                    <label for="kc-otp-credential-${otpCredential?index}" class="${properties.kcLoginOTPListClass!} flex items-center cursor-pointer" tabindex="${otpCredential?index}">
                        <span class="${properties.kcLoginOTPListItemHeaderClass!} flex items-center space-x-2">
                            <span class="${properties.kcLoginOTPListItemIconBodyClass!}">
                                <i class="${properties.kcLoginOTPListItemIconClass!}" aria-hidden="true"></i>
                            </span>
                            <span class="${properties.kcLoginOTPListItemTitleClass!} text-gray-800 font-medium">${otpCredential.userLabel}</span>
                        </span>
                    </label>
                </div>
            </#list>
        </div>

        <!-- Submit Button -->
        <div class="${properties.kcFormGroupClass!} mb-6">
            <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                <input id="kc-otp-reset-form-submit" 
                       class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!} w-full py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500" 
                       type="submit" 
                       value="${msg("doSubmit")}" />
            </div>
        </div>

    </form>
</#if>

</@layout.registrationLayout>

<!-- Styling Improvements -->
<style>
    /* General form styles */
    #kc-otp-reset-form {
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
    }

    /* Description text */
    #kc-otp-reset-form-description {
        font-size: 1.125rem;
        color: #4a4a4a;
        margin-bottom: 16px;
    }

    /* OTP Credential radio buttons */
    input[type="radio"] {
        display: none;
    }

    label {
        display: flex;
        align-items: center;
        padding: 12px;
        margin-bottom: 8px;
        background-color: #f3f4f6;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    label:hover {
        background-color: #e5e7eb;
    }

    /* OTP Credential icon styling */
    .${properties.kcLoginOTPListItemHeaderClass!} {
        display: flex;
        align-items: center;
        space-x-2;
    }

    .${properties.kcLoginOTPListItemIconBodyClass!} {
        display: inline-block;
        margin-right: 8px;
    }

    .${properties.kcLoginOTPListItemIconClass!} {
        font-size: 1.25rem;
        color: #4a4a4a;
    }

    .${properties.kcLoginOTPListItemTitleClass!} {
        font-size: 1rem;
        color: #4a4a4a;
    }

    /* Submit button styles */
    #kc-otp-reset-form-submit {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        background-color: #3b82f6;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s, transform 0.2s;
    }

    #kc-otp-reset-form-submit:hover {
        background-color: #2563eb;
    }

    #kc-otp-reset-form-submit:focus {
        outline: none;
        transform: translateY(-2px);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }

    /* Spacing for form groups */
    .mb-6 {
        margin-bottom: 24px;
    }

    .space-x-3 {
        margin-right: 12px;
    }
</style>
