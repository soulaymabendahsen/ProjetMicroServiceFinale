<#import "template.ftl" as layout>

<style>
    header .page-title {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 20px;
    }

    .delete-account-form {
        max-width: 500px;
        margin: 0 auto;
        padding: 20px;
        background: #f9f9f9;
        border: 1px solid #ddd;
        border-radius: 8px;
    }

    .alert-warning {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #856404;
        background: #fff3cd;
        border: 1px solid #ffeeba;
        padding: 15px;
        border-radius: 4px;
    }

    .deletion-details {
        color: #72767b;
        margin-top: 15px;
        margin-bottom: 15px;
        padding-left: 20px;
        list-style-type: disc;
        list-style-position: inside;
    }

    #kc-form-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
    }

    .btn-confirm {
        background-color: #d9534f; /* Red button */
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
    }

    .btn-cancel {
        background-color: #6c757d; /* Grey button */
        color: #fff;
        border: none;
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 4px;
        cursor: pointer;
    }
</style>

<@layout.registrationLayout section>

    <#if section == "header">
        <header>
            <h1 class="page-title">${msg("deleteAccountConfirm")}</h1>
        </header>

    <#elseif section == "form">
        <form action="${url.loginAction}" class="form-vertical delete-account-form" method="post">
            <div class="alert alert-warning" style="margin-top: 0 !important; margin-bottom: 30px !important;">
                <span class="pficon pficon-warning-triangle-o"></span>
                ${msg("irreversibleAction")}
            </div>

            <p>${msg("deletingImplies")}</p>
            <ul class="deletion-details">
                <li>${msg("loggingOutImmediately")}</li>
                <li>${msg("erasingData")}</li>
            </ul>

            <p class="delete-account-text">${msg("finalDeletionConfirmation")}</p>

            <div id="kc-form-buttons">
                <input 
                    class="btn-confirm ${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!}" 
                    type="submit" 
                    value="${msg("doConfirmDelete")}" 
                />
                <#if triggered_from_aia>
                    <button 
                        class="btn-cancel ${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!}" 
                        type="submit" 
                        name="cancel-aia" 
                        value="true"
                    >
                        ${msg("doCancel")}
                    </button>
                </#if>
            </div>
        </form>
    </#if>

</@layout.registrationLayout>
