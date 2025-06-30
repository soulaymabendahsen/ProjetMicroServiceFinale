<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('recoveryCodeInput'); section>

<#if section == "header">
    <h1 class="text-2xl font-semibold text-center text-gray-800 mb-6">${msg("auth-recovery-code-header")}</h1>
<#elseif section == "form">
    <form id="kc-recovery-code-login-form" class="${properties.kcFormClass!} p-6 rounded-lg shadow-lg bg-white" action="${url.loginAction}" method="post">

        <!-- Recovery Code Input Field -->
        <div class="${properties.kcFormGroupClass!} mb-6">
            <div class="${properties.kcLabelWrapperClass!}">
                <label for="recoveryCodeInput" class="${properties.kcLabelClass!} block text-lg font-medium text-gray-700">
                    ${msg("auth-recovery-code-prompt", recoveryAuthnCodesInputBean.codeNumber?c)}
                </label>
            </div>

            <div class="${properties.kcInputWrapperClass!} mt-2">
                <input tabindex="1" id="recoveryCodeInput"
                       name="recoveryCodeInput"
                       aria-invalid="<#if messagesPerField.existsError('recoveryCodeInput')>true</#if>"
                       autocomplete="off"
                       type="text"
                       class="${properties.kcInputClass!} w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                       autofocus />

                <#if messagesPerField.existsError('recoveryCodeInput')>
                    <span id="input-error" class="${properties.kcInputErrorMessageClass!} mt-2 text-sm text-red-600" aria-live="polite">
                        ${kcSanitize(messagesPerField.get('recoveryCodeInput'))?no_esc}
                    </span>
                </#if>
            </div>
        </div>

        <!-- Form Options (Empty in this case) -->
        <div class="${properties.kcFormGroupClass!} mb-6">
            <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                <div class="${properties.kcFormOptionsWrapperClass!}">
                    <!-- Add any additional options here if needed -->
                </div>
            </div>
        </div>

        <!-- Submit Button -->
        <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
            <input
                    class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!} w-full py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                    name="login" id="kc-login" type="submit" value="${msg("doLogIn")}" />
        </div>

    </form>
</#if>

</@layout.registrationLayout>

<!-- Styling Improvements -->
<style>
    /* General form styles */
    #kc-recovery-code-login-form {
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        background-color: #ffffff;
    }

    /* Label Styling */
    label {
        display: block;
        font-size: 1rem;
        font-weight: 500;
        color: #4a4a4a;
        margin-bottom: 8px;
    }

    /* Input field styles */
    input[type="text"] {
        width: 100%;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        font-size: 1rem;
        color: #333;
    }

    /* Input field focus state */
    input[type="text"]:focus {
        outline: none;
        border-color: #4f46e5;
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
    }

    /* Error message styling */
    #input-error {
        margin-top: 8px;
        font-size: 0.875rem;
        color: #ef4444;
    }

    /* Submit Button styles */
    input[type="submit"] {
        width: 100%;
        padding: 12px;
        border-radius: 8px;
        background-color: #3b82f6;
        color: white;
        font-size: 1rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
    }

    /* Submit Button hover and focus states */
    input[type="submit"]:hover {
        background-color: #2563eb;
    }

    input[type="submit"]:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }

    /* Spacing between form elements */
    .mb-6 {
        margin-bottom: 24px;
    }

    .mt-2 {
        margin-top: 8px;
    }

    /* Form group wrappers */
    .block {
        display: block;
    }
</style>
