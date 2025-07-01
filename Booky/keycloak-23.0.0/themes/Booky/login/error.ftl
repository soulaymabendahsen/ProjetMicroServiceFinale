<#import "template.ftl" as layout>

<style>
    header .error-title {
        font-size: 24px;
        color: #d9534f; /* Bootstrap danger red */
        text-align: center;
        margin-bottom: 20px;
    }

    .error-message-container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8d7da; /* Light red background for errors */
        border: 1px solid #f5c6cb;
        border-radius: 8px;
        text-align: center;
    }

    .instruction {
        font-size: 16px;
        color: #721c24; /* Darker red for text */
        margin-bottom: 15px;
    }

    .back-to-app-link {
        display: inline-block;
        font-size: 14px;
        color: #0056b3; /* Bootstrap link blue */
        text-decoration: none;
        margin-top: 10px;
    }

    .back-to-app-link:hover {
        text-decoration: underline;
        color: #004085; /* Darker blue on hover */
    }
</style>

<@layout.registrationLayout displayMessage=false; section>

    <#if section == "header">
        <header>
            <h1 class="error-title">${kcSanitize(msg("errorTitle"))?no_esc}</h1>
        </header>

    <#elseif section == "form">
        <div id="kc-error-message" class="error-message-container">
            <p class="instruction">${kcSanitize(message.summary)?no_esc}</p>
            
            <#if !skipLink??>
                <#if client?? && client.baseUrl?has_content>
                    <p>
                        <a id="backToApplication" class="back-to-app-link" href="${client.baseUrl}">
                            ${kcSanitize(msg("backToApplication"))?no_esc}
                        </a>
                    </p>
                </#if>
            </#if>
        </div>
    </#if>

</@layout.registrationLayout>
