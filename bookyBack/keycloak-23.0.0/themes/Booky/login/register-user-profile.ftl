<#import "template.ftl" as layout>
<#import "user-profile-commons.ftl" as userProfileCommons>
<#import "register-commons.ftl" as registerCommons>

<style>
	/* Styling for password visibility toggle button */
	.pf-c-button.pf-m-control {
		background-color: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	.pf-c-button.pf-m-control i {
		font-size: 1.2rem;
		color: #007bff;
	}

	/* Styling for form input fields */
	.${properties.kcInputClass!} {
		width: 100%;
		padding: 10px;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-bottom: 10px;
	}

	.${properties.kcInputGroup!} {
		position: relative;
	}

	/* Error messages */
	.${properties.kcInputErrorMessageClass!} {
		color: #e74c3c;
		font-size: 0.875rem;
		margin-top: 5px;
	}

	/* Styling for terms acceptance checkbox */
	.${properties.kcCheckboxInputClass!} {
		margin-right: 10px;
		transform: scale(1.2);
		cursor: pointer;
	}

	/* Form button styling */
	.${properties.kcButtonClass!} {
		padding: 10px 20px;
		font-size: 1.1rem;
		background-color: #007bff;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
	}

	.${properties.kcButtonClass!}:hover {
		background-color: #0056b3;
	}

	/* Adjustments for reCAPTCHA */
	.g-recaptcha {
		margin-top: 20px;
	}
</style>
<@layout.registrationLayout displayMessage=messagesPerField.exists('global') displayRequiredFields=true; section>
    <#if section = "header">
        ${msg("registerTitle")}
    <#elseif section = "form">
        <form id="kc-register-form" class="${properties.kcFormClass!}" action="${url.registrationAction}" method="post">
        
            <@userProfileCommons.userProfileFormFields; callback, attribute>
                <#if callback = "afterField">
	                <#-- render password fields just under the username or email (if used as username) -->
		            <#if passwordRequired?? && (attribute.name == 'username' || (attribute.name == 'email' && realm.registrationEmailAsUsername))>
		                <div class="${properties.kcFormGroupClass!}">
		                    <div class="${properties.kcLabelWrapperClass!}">
		                        <label for="password" class="${properties.kcLabelClass!}">${msg("password")}</label> *
		                    </div>
		                    <div class="${properties.kcInputWrapperClass!}">
								<div class="${properties.kcInputGroup!}">
									<input type="password" id="password" class="${properties.kcInputClass!}" name="password"
										   autocomplete="new-password"
										   aria-invalid="<#if messagesPerField.existsError('password','password-confirm')>true</#if>"
									/>
									<button class="pf-c-button pf-m-control" type="button" aria-label="${msg('showPassword')}"
											aria-controls="password"  data-password-toggle
											data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}">
										<i class="fa fa-eye" aria-hidden="true"></i>
									</button>
								</div>
		
		                        <#if messagesPerField.existsError('password')>
		                            <span id="input-error-password" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
		                                ${kcSanitize(messagesPerField.get('password'))?no_esc}
		                            </span>
		                        </#if>
		                    </div>
		                </div>
		
		                <div class="${properties.kcFormGroupClass!}">
		                    <div class="${properties.kcLabelWrapperClass!}">
		                        <label for="password-confirm"
		                               class="${properties.kcLabelClass!}">${msg("passwordConfirm")}</label> *
		                    </div>
		                    <div class="${properties.kcInputWrapperClass!}">
								<div class="${properties.kcInputGroup!}">
									<input type="password" id="password-confirm" class="${properties.kcInputClass!}"
										   name="password-confirm"
										   aria-invalid="<#if messagesPerField.existsError('password-confirm')>true</#if>"
									/>
									<button class="pf-c-button pf-m-control" type="button" aria-label="${msg('showPassword')}"
											aria-controls="password-confirm"  data-password-toggle
											data-label-show="${msg('showPassword')}" data-label-hide="${msg('hidePassword')}">
										<i class="fa fa-eye" aria-hidden="true"></i>
									</button>
								</div>
		
		                        <#if messagesPerField.existsError('password-confirm')>
		                            <span id="input-error-password-confirm" class="${properties.kcInputErrorMessageClass!}" aria-live="polite">
		                                ${kcSanitize(messagesPerField.get('password-confirm'))?no_esc}
		                            </span>
		                        </#if>
		                    </div>
		                </div>
		            </#if>
                </#if>  
            </@userProfileCommons.userProfileFormFields>

            <@registerCommons.termsAcceptance/>
            
            <#if recaptchaRequired??>
                <div class="form-group">
                    <div class="${properties.kcInputWrapperClass!}">
                        <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
                    </div>
                </div>
            </#if>

            <div class="${properties.kcFormGroupClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <span><a href="${url.loginUrl}">${kcSanitize(msg("backToLogin"))?no_esc}</a></span>
                    </div>
                </div>

                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegister")}"/>
                </div>
            </div>
        </form>
		<script type="module" src="${url.resourcesPath}/js/passwordVisibility.js"></script>
    </#if>
</@layout.registrationLayout>
