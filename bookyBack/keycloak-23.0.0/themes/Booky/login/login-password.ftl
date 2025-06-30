<#import "template.ftl" as layout>
<style>
    .kc-form-wrapper {
        max-width: 400px;  /* Limit max width for better alignment */
        margin: 0 auto; /* Center the form horizontally */
        padding: 20px;  /* Add some padding around the form */
    }

    .kc-form-group {
        margin-bottom: 20px; /* Space between form groups */
    }

    .kc-form-group label {
        display: block;
        margin-bottom: 8px; /* Add space between label and input */
        font-size: 1rem;
        color: #333;
    }

    .kc-input-group {
        display: flex;
        align-items: center;
        position: relative;
    }

    .kc-input-group input {
        flex: 1;
        padding: 12px;
        font-size: 1rem;
        border-radius: 4px;
        border: 1px solid #ccc;
    }

    .kc-input-group button {
        position: absolute;
        right: 10px;
        background: transparent;
        border: none;
        cursor: pointer;
    }

    .kc-input-group button i {
        font-size: 1.2rem;
        color: #666;
    }

    .kc-form-options {
        margin-top: 12px;
        text-align: center;
    }

    .kc-form-options a {
        color: #007bff;
        text-decoration: none;
    }

    .kc-form-options a:hover {
        text-decoration: underline;
    }

    .kc-form-buttons input {
        width: 100%;
        padding: 14px;
        font-size: 1rem;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .kc-form-buttons input:hover {
        background-color: #0056b3;
    }

    .kc-input-error-message {
        font-size: 0.875rem;
        color: #d9534f;
        margin-top: 8px;
    }

    /* Responsive styles */
    @media (max-width: 600px) {
        .kc-form-wrapper {
            padding: 15px;
            width: 90%;
        }
    }
</style>

<@layout.registrationLayout displayMessage=!messagesPerField.existsError('password'); section>
    <#if section = "header">
        <h1>${msg("doLogIn")}</h1>
    <#elseif section = "form">
        <div id="kc-form">
            <div id="kc-form-wrapper">
                <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                    <div class="${properties.kcFormGroupClass!} kc-form-group">
                        <hr/>
                        <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label>
                        <div class="kc-input-group">
                            <input tabindex="2" id="password" class="${properties.kcInputClass!}" name="password"
                                   type="password" autocomplete="on" autofocus
                                   aria-invalid="<#if messagesPerField.existsError('password')>true</#if>"
                            />
                            <button class="pf-c-button pf-m-control" type="button" aria-label="${msg('showPassword')}"
                                    aria-controls="password" data-password-toggle
                                    data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}">
                                <i class="fa fa-eye" aria-hidden="true"></i>
                            </button>
                        </div>
                        <#if messagesPerField.existsError('password')>
                            <span id="input-error-password" class="kc-input-error-message" aria-live="polite">
                                ${kcSanitize(messagesPerField.get('password'))?no_esc}
                            </span>
                        </#if>
                    </div>

                    <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                        <div id="kc-form-options" class="kc-form-options">
                            <#if realm.resetPasswordAllowed>
                                <span><a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                            </#if>
                        </div>
                    </div>

                    <div id="kc-form-buttons" class="${properties.kcFormGroupClass!} kc-form-buttons">
                        <input tabindex="4" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
                    </div>
                </form>
            </div>
        </div>
        <script type="module" src="${url.resourcesPath}/js/passwordVisibility.js"></script>
    </#if>
</@layout.registrationLayout>
