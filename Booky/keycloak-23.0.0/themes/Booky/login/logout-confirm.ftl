<#import "template.ftl" as layout>

<@layout.registrationLayout section>
    <#if section == "header">
        ${msg("logoutConfirmTitle")}
    <#elseif section == "form">
        <div id="kc-logout-confirm" class="content-area">
            <p class="instruction">${msg("logoutConfirmHeader")}</p>

            <form class="form-actions" action="${url.logoutConfirmAction}" method="POST">
                <input type="hidden" name="session_code" value="${logoutConfirm.code}">
                
                <div class="${properties.kcFormGroupClass!}">
                    <div id="kc-form-options">
                        <div class="${properties.kcFormOptionsWrapperClass!}">
                            <!-- Form options go here, if necessary -->
                        </div>
                    </div>

                    <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                        <input tabindex="4"
                               class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                               name="confirmLogout" id="kc-logout" type="submit" value="${msg("doLogout")}"/>
                    </div>
                </div>
            </form>

            <div id="kc-info-message">
                <#if logoutConfirm.skipLink??>
                    <!-- If skipLink is set, no back link is shown -->
                <#else>
                    <#if client.baseUrl??>
                        <p><a href="${client.baseUrl}" class="kc-back-link">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                    </#if>
                </#if>
            </div>

            <div class="clearfix"></div>
        </div>
    </#if>
</@layout.registrationLayout>

<style>
    /* General content area styling */
    #kc-logout-confirm {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    /* Instruction text styling */
    .instruction {
        font-size: 1.2rem;
        color: #333;
        margin-bottom: 20px;
    }

    /* Form group styling */
    .${properties.kcFormGroupClass!} {
        margin-bottom: 20px;
    }

    /* Form buttons section */
    #kc-form-buttons {
        display: flex;
        justify-content: center;
    }

    /* Styling for the submit button */
    #kc-logout {
        width: 100%;
        padding: 10px;
        font-size: 1rem;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    #kc-logout:hover {
        background-color: #0056b3;
    }

    /* Info message link styling */
    .kc-back-link {
        color: #007bff;
        text-decoration: none;
        font-size: 1rem;
    }

    .kc-back-link:hover {
        text-decoration: underline;
    }

    /* clearfix for clearing floated elements */
    .clearfix::after {
        content: "";
        display: block;
        clear: both;
    }
</style>
