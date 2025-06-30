<#macro termsAcceptance>
    <#if termsAcceptanceRequired??>
        <div class="form-group">
            <div class="${properties.kcInputWrapperClass!}">
                <p class="terms-title">${msg("termsTitle")}</p>
                <div id="kc-registration-terms-text" class="terms-text">
                    ${kcSanitize(msg("termsText"))?no_esc}
                </div>
            </div>
        </div>
        
        <div class="form-group">
            <div class="${properties.kcLabelWrapperClass!}">
                <input type="checkbox" id="termsAccepted" name="termsAccepted" class="${properties.kcCheckboxInputClass!}"
                       aria-invalid="<#if messagesPerField.existsError('termsAccepted')>true</#if>"
                />
                <label for="termsAccepted" class="${properties.kcLabelClass!}">${msg("acceptTerms")}</label>
            </div>

            <#if messagesPerField.existsError('termsAccepted')>
                <div class="${properties.kcLabelWrapperClass!}">
                    <span id="input-error-terms-accepted" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
                        ${kcSanitize(messagesPerField.get('termsAccepted'))?no_esc}
                    </span>
                </div>
            </#if>
        </div>
    </#if>
</#macro>

<style>
    /* Styling for the terms section */
    .terms-title {
        font-size: 1.2rem;
        font-weight: bold;
        color: #333;
        margin-bottom: 10px;
    }

    .terms-text {
        font-size: 1rem;
        color: #555;
        margin-bottom: 20px;
        line-height: 1.5;
    }

    /* Styling for checkbox and label */
    .${properties.kcLabelWrapperClass!} {
        display: flex;
        align-items: center;
        font-size: 1rem;
        color: #333;
        margin-bottom: 15px;
    }

    .${properties.kcCheckboxInputClass!} {
        margin-right: 10px;
        transform: scale(1.2);
        cursor: pointer;
    }

    /* Styling for error message */
    .${properties.kcInputErrorMessageClass!} {
        color: red;
        font-size: 0.875rem;
        margin-top: 5px;
    }

    /* Adjusting the form-group to have space between sections */
    .form-group {
        margin-bottom: 20px;
    }
</style>
