<#import "template.ftl" as layout>
<style>
    /* Centered container for better readability */
    .centered-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        max-width: 600px; /* Adjust as needed for desired text width */
        margin: 0 auto;
        padding-top: 20px;
    }

    /* Custom link styling */
    .custom-link {
        color: #0a6e89;
        text-decoration: none;
        font-weight: bold; /* Make links stand out more */
    }

    /* Hover effect for the custom link */
    .custom-link:hover {
        text-decoration: underline;
        color: #065a6e; /* Slightly darker shade for hover effect */
    }

    /* Additional spacing for paragraph */
    .instruction {
        font-size: 1.1rem;
        line-height: 1.6;
        margin-bottom: 20px; /* Add some space between paragraphs */
    }
</style>

<@layout.registrationLayout section>
    <#if section?? && section == "header">
        <h1>${msg("pageExpiredTitle")}</h1>
    <#elseif section?? && section == "form">
        <div class="centered-text">
            <p id="instruction1" class="instruction">
                ${msg("pageExpiredMsg1")} 
                <a id="loginRestartLink" class="custom-link" href="${url.loginRestartFlowUrl}">
                    ${msg("doClickHere")}
                </a>.<br/>
                ${msg("pageExpiredMsg2")} 
                <a id="loginContinueLink" class="custom-link" href="${url.loginAction}">
                    ${msg("doClickHere")}
                </a>.
            </p>
        </div>
    <#else>
        <p>Section is missing or invalid.</p>
    </#if>
</@layout.registrationLayout>

