<#import "template.ftl" as layout>

<style>
    .centered-text {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        max-width: 450px; /* Adjust as needed for desired text width */
        margin: 0 auto;
    }
    .custom-link {
        color: #0a6e89;
        text-decoration: none;
        font-weight: bold;
    }
    .custom-link:hover {
        text-decoration: underline;
    }
</style>

<@layout.registrationLayout displayInfo=true; section>

    <#if section == "header">
        <div class="centered-text">
            <h1>${msg("emailVerifyTitle")}</h1>
        </div>
    <#elseif section == "form">
        <div class="centered-text">
            <p class="instruction">${msg("emailVerifyInstruction1", user.email)}</p>
        </div>
    <#elseif section == "info">
        <div class="centered-text">
            <p class="instruction">
                ${msg("emailVerifyInstruction2")}
                <br/>
                <a href="${url.loginAction}" class="custom-link">${msg("doClickHere")}</a> ${msg("emailVerifyInstruction3")}
            </p>
        </div>
    </#if>

</@layout.registrationLayout>
