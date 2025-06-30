<#import "template.ftl" as layout>

<style>
    .centered-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        max-width: 600px; /* Adjust as needed for desired text width */
        margin: 0 auto;
        padding-top: 20px; /* Add padding to space out from other content */
    }
    .custom-link {
        color: #0a6e89;
        text-decoration: none;
        transition: color 0.3s, text-decoration 0.3s; /* Smooth transition */
    }
    .custom-link:hover {
        color: #064e66;
        text-decoration: underline;
    }
    .instruction {
        margin-top: 10px;
    }
    @media (max-width: 768px) {
        .centered-text {
            max-width: 90%; /* Adjust for smaller screens */
        }
    }
</style>

<@layout.registrationLayout displayMessage=false; section>
    <#if section == "header">
        <div class="centered-text">
            <#if messageHeader??>
                ${kcSanitize(messageHeader)?no_esc}
            <#else>
                ${kcSanitize(message.summary)?no_esc}
            </#if>
        </div>
    <#elseif section == "form">
        <div id="kc-info-message" class="centered-text">
            <p class="instruction">
                <#if message.summary??>
                    ${kcSanitize(message.summary)?no_esc}
                <#else>
                    ${kcSanitize(msg("defaultInfoMessage"))?no_esc} <!-- Fallback message -->
                </#if>
                <#if requiredActions??>
                    <#list requiredActions as reqActionItem>
                        <b>${kcSanitize(msg("requiredAction.${reqActionItem}"))?no_esc}</b><#sep>, </#sep>
                    </#list>
                </#if>
            </p>
            <#if !skipLink??>
                <#if pageRedirectUri?has_content>
                    <p><a class="custom-link" href="${pageRedirectUri}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                <#elseif actionUri?has_content>
                    <p><a class="custom-link" href="${actionUri}">${kcSanitize(msg("proceedWithAction"))?no_esc}</a></p>
                <#elseif (client.baseUrl)?has_content>
                    <p><a class="custom-link" href="${client.baseUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
                <#else>
                    <p>${kcSanitize(msg("noRedirectAvailable"))?no_esc}</p> <!-- Default link message -->
                </#if>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
