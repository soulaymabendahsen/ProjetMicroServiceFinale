<#import "template.ftl" as layout>

<style>
    header {
        text-align: center;
        margin-bottom: 20px;
    }

    .success-title {
        color: #4CAF50; /* Green for success */
    }

    .error-title {
        color: #F44336; /* Red for errors */
    }

    #kc-code {
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
    }

    .instruction {
        font-size: 14px;
        margin-bottom: 10px;
    }

    .code-input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 3px;
        background-color: #fff;
    }

    .error-message {
        color: #F44336;
        font-weight: bold;
        margin-top: 10px;
    }
</style>

<@layout.registrationLayout section>
    <#if section == "header">
        <header>
            <#if code.success>
                <h1 class="success-title">${msg("codeSuccessTitle")}</h1>
            <#else>
                <h1 class="error-title">${kcSanitize(msg("codeErrorTitle", code.error))}</h1>
            </#if>
        </header>
    <#elseif section == "form">
        <div id="kc-code" class="form-section">
            <#if code.success>
                <p class="instruction">${msg("copyCodeInstruction")}</p>
                <input 
                    id="code" 
                    class="code-input ${properties.kcTextareaClass!}" 
                    value="${code.code}" 
                    readonly
                />
            <#else>
                <p id="error" class="error-message">${kcSanitize(code.error)}</p>
            </#if>
        </div>
    </#if>
</@layout.registrationLayout>
