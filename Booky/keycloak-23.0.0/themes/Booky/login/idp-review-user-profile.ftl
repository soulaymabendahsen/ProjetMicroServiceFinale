<#import "template.ftl" as layout>
<#import "user-profile-commons.ftl" as userProfileCommons>

<style>
    header .idp-review-profile-title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
        color: #333; /* Neutral dark color */
    }

    #kc-idp-review-profile-form {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .form-group {
        margin-bottom: 20px;
    }

    #kc-form-buttons .btn-submit {
        width: 100%;
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s;
    }

    #kc-form-buttons .btn-submit:hover {
        background-color: #0056b3;
    }
</style>
<@layout.registrationLayout displayMessage=messagesPerField.exists('global') displayRequiredFields=true; section>

    <#if section == "header">
        <header>
            <h1 class="idp-review-profile-title">${msg("loginIdpReviewProfileTitle")}</h1>
        </header>

    <#elseif section == "form">
        <form id="kc-idp-review-profile-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            
            <!-- Render user profile form fields -->
            <@userProfileCommons.userProfileFormFields/>

            <div class="form-group ${properties.kcFormGroupClass!}">
                
                <!-- Form options container -->
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                    <div class="${properties.kcFormOptionsWrapperClass!}">
                        <!-- Additional options can be added here in the future -->
                    </div>
                </div>

                <!-- Form buttons -->
                <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                    <input 
                        class="btn-submit ${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" 
                        type="submit" 
                        value="${msg("doSubmit")}" 
                    />
                </div>
            </div>
        </form>
    </#if>

</@layout.registrationLayout>
