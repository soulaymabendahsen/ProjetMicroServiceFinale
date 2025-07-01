<#import "template.ftl" as layout>

<@layout.registrationLayout; section>
    <#if section == "header">
        <h1>${msg("oauth2DeviceVerificationTitle")}</h1>
    </#if>

    <#elseif section == "form">
        <form id="kc-user-verify-device-user-code-form" class="${properties.kcFormClass!}" action="${url.oauth2DeviceVerificationAction}" method="post">
            <div class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcLabelWrapperClass!}">
                    <label for="device-user-code" class="${properties.kcLabelClass!}">${msg("verifyOAuth2DeviceUserCode")}</label>
                </div>

                <div class="${properties.kcInputWrapperClass!}">
                    <input id="device-user-code" name="device_user_code" autocomplete="off" type="text" class="${properties.kcInputClass!}" autofocus placeholder="${msg('enterDeviceCode')}" />
                </div>
            </div>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <div class="${properties.kcFormButtonsWrapperClass!}">
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}"/>
                    </div>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>

<style>
    /* Add some styling to improve form layout */
    form#kc-user-verify-device-user-code-form {
        background-color: #fff;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        max-width: 400px;
        margin: 20px auto;
    }

    .${properties.kcFormGroupClass!} {
        margin-bottom: 15px;
    }

    .${properties.kcLabelWrapperClass!} {
        margin-bottom: 8px;
    }

    .${properties.kcInputWrapperClass!} input {
        width: 100%;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 4px;
        transition: border-color 0.3s ease;
    }

    .${properties.kcInputWrapperClass!} input:focus {
        border-color: #4CAF50;
        outline: none;
    }

    .${properties.kcFormButtonsClass!} {
        text-align: center;
    }

    .${properties.kcButtonClass!} {
        padding: 12px 20px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
    }

    .${properties.kcButtonPrimaryClass!} {
        background-color: #4CAF50;
        color: white;
        border: none;
    }

    .${properties.kcButtonPrimaryClass!}:hover {
        background-color: #45a049;
    }
</style>
