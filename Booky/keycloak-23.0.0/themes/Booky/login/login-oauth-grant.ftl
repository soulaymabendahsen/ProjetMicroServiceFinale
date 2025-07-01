<#import "template.ftl" as layout>

<style>
    /* Example of inline CSS styling */
    body.oauth {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
    }

    #kc-oauth {
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .content-area h3 {
        color: #333;
        font-size: 24px;
        margin-bottom: 10px;
    }

    .form-actions input[type="submit"] {
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        border: none;
        cursor: pointer;
        width: 100%;
        margin-top: 10px;
    }

    .form-actions input[type="submit"]:hover {
        background-color: #45a049;
    }

    .form-actions .form-button {
        display: flex;
        gap: 10px;
    }

    .clearfix {
        clear: both;
    }
</style>

<@layout.registrationLayout bodyClass="oauth"; section>
    <#if section == "header">
        <#if client.attributes.logoUri??>
            <img src="${client.attributes.logoUri}" alt="Client Logo"/>
        </#if>
        <p>
            <#if client.name?has_content>
                ${msg("oauthGrantTitle", advancedMsg(client.name))}
            <#else>
                ${msg("oauthGrantTitle", client.clientId)}
            </#if>
        </p>
    </#if>

    <#if section == "form">
        <div id="kc-oauth" class="content-area">
            <h3>${msg("oauthGrantRequest")}</h3>
            <ul>
                <#if oauth.clientScopesRequested??>
                    <#list oauth.clientScopesRequested as clientScope>
                        <li>
                            <span>
                                <#if !clientScope.dynamicScopeParameter??>
                                    ${advancedMsg(clientScope.consentScreenText)}
                                <#else>
                                    ${advancedMsg(clientScope.consentScreenText)}: <b>${clientScope.dynamicScopeParameter}</b>
                                </#if>
                            </span>
                        </li>
                    </#list>
                </#if>
            </ul>

            <#if client.attributes.policyUri?? || client.attributes.tosUri??>
                <h3>
                    <#if client.name?has_content>
                        ${msg("oauthGrantInformation", advancedMsg(client.name))}
                    <#else>
                        ${msg("oauthGrantInformation", client.clientId)}
                    </#if>
                    <#if client.attributes.tosUri??>
                        ${msg("oauthGrantReview")}
                        <a href="${client.attributes.tosUri}" target="_blank">${msg("oauthGrantTos")}</a>
                    </#if>
                    <#if client.attributes.policyUri??>
                        ${msg("oauthGrantReview")}
                        <a href="${client.attributes.policyUri}" target="_blank">${msg("oauthGrantPolicy")}</a>
                    </#if>
                </h3>
            </#if>

            <form class="form-actions" action="${url.oauthAction}" method="POST">
                <input type="hidden" name="code" value="${oauth.code}">
                <div class="${properties.kcFormGroupClass!}">
                    <div id="kc-form-options">
                        <div class="${properties.kcFormOptionsWrapperClass!}">
                        </div>
                    </div>

                    <div id="kc-form-buttons">
                        <div class="${properties.kcFormButtonsWrapperClass!}">
                            <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" name="accept" id="kc-login" type="submit" value="${msg("doYes")}"/>
                            <input class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}" name="cancel" id="kc-cancel" type="submit" value="${msg("doNo")}"/>
                        </div>
                    </div>
                </div>
            </form>
            <div class="clearfix"></div>
        </div>
    </#if>
</@layout.registrationLayout>
