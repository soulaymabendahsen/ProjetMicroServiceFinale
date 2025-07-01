<#import "template.ftl" as layout>
<#import "password-commons.ftl" as passwordCommons>

<@layout.registrationLayout section>

<#if section == "header">
    <h1 class="text-center text-2xl font-bold mb-6 text-gray-800">${msg("recovery-code-config-header")}</h1>
<#elseif section == "form">
    <!-- Warning Alert -->
    <div class="pf-c-alert pf-m-warning pf-m-inline ${properties.kcRecoveryCodesWarning}" role="alert">
        <div class="pf-c-alert__icon">
            <i class="pficon-warning-triangle-o text-yellow-600" aria-hidden="true"></i>
        </div>
        <div class="pf-c-alert__content">
            <h4 class="pf-c-alert__title text-lg font-semibold text-yellow-800">
                <span class="pf-screen-reader">Warning alert:</span>
                ${msg("recovery-code-config-warning-title")}
            </h4>
            <div class="pf-c-alert__description">
                <p class="text-sm text-gray-700">${msg("recovery-code-config-warning-message")}</p>
            </div>
        </div>
    </div>

    <!-- Recovery Codes List -->
    <ol id="kc-recovery-codes-list" class="mt-6 space-y-2 text-sm text-gray-700">
        <#list recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesList as code>
            <li class="flex items-center space-x-2">
                <span class="font-medium text-gray-800">${code?counter}:</span> 
                <span class="text-gray-600">${code[0..3]}-${code[4..7]}-${code[8..]}</span>
            </li>
        </#list>
    </ol>

    <!-- Action Buttons -->
    <div class="mt-8 space-x-6 flex justify-center">
        <button id="printRecoveryCodes" class="pf-c-button pf-m-link text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out" type="button">
            <i class="pficon-print mr-2"></i>${msg("recovery-codes-print")}
        </button>
        <button id="downloadRecoveryCodes" class="pf-c-button pf-m-link text-green-600 hover:text-green-800 transition duration-200 ease-in-out" type="button">
            <i class="pficon-save mr-2"></i>${msg("recovery-codes-download")}
        </button>
        <button id="copyRecoveryCodes" class="pf-c-button pf-m-link text-purple-600 hover:text-purple-800 transition duration-200 ease-in-out" type="button">
            <i class="pficon-blueprint mr-2"></i>${msg("recovery-codes-copy")}
        </button>
    </div>

    <!-- Confirmation Checkbox -->
    <div class="mt-6 flex items-center justify-center space-x-3">
        <input class="${properties.kcCheckInputClass} text-indigo-600" type="checkbox" id="kcRecoveryCodesConfirmationCheck" name="kcRecoveryCodesConfirmationCheck" 
        onchange="document.getElementById('saveRecoveryAuthnCodesBtn').disabled = !this.checked;" />
        <label for="kcRecoveryCodesConfirmationCheck" class="text-sm text-gray-600">${msg("recovery-codes-confirmation-message")}</label>
    </div>

    <!-- Form for Saving Recovery Codes -->
    <form action="${url.loginAction}" class="${properties.kcFormGroupClass!} mt-8" id="kc-recovery-codes-settings-form" method="post">
        <input type="hidden" name="generatedRecoveryAuthnCodes" value="${recoveryAuthnCodesConfigBean.generatedRecoveryAuthnCodesAsString}" />
        <input type="hidden" name="generatedAt" value="${recoveryAuthnCodesConfigBean.generatedAt?c}" />
        <input type="hidden" id="userLabel" name="userLabel" value="${msg("recovery-codes-label-default")}" />
        <@passwordCommons.logoutOtherSessions/>

        <#if isAppInitiatedAction??>
            <input type="submit" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonLargeClass!} w-full mt-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            id="saveRecoveryAuthnCodesBtn" value="${msg("recovery-codes-action-complete")}" disabled />
            <button type="submit" class="${properties.kcButtonClass!} ${properties.kcButtonDefaultClass!} ${properties.kcButtonLargeClass!} w-full mt-4 py-3 rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:outline-none"
            id="cancelRecoveryAuthnCodesBtn" name="cancel-aia" value="true">${msg("recovery-codes-action-cancel")}</button>
        <#else>
            <input type="submit" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!} w-full mt-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" 
            id="saveRecoveryAuthnCodesBtn" value="${msg("recovery-codes-action-complete")}" disabled />
        </#if>
    </form>

    <script>
        /* copy recovery codes  */
        function copyRecoveryCodes() {
            var tmpTextarea = document.createElement("textarea");
            var codes = document.getElementById("kc-recovery-codes-list").getElementsByTagName("li");
            for (i = 0; i < codes.length; i++) {
                tmpTextarea.value = tmpTextarea.value + codes[i].innerText + "\n";
            }
            document.body.appendChild(tmpTextarea);
            tmpTextarea.select();
            document.execCommand("copy");
            document.body.removeChild(tmpTextarea);
        }

        var copyButton = document.getElementById("copyRecoveryCodes");
        copyButton && copyButton.addEventListener("click", function () {
            copyRecoveryCodes();
        });

        /* download recovery codes  */
        function formatCurrentDateTime() {
            var dt = new Date();
            var options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short'
            };

            return dt.toLocaleString('en-US', options);
        }

        function parseRecoveryCodeList() {
            var recoveryCodes = document.querySelectorAll(".kc-recovery-codes-list li");
            var recoveryCodeList = "";

            for (var i = 0; i < recoveryCodes.length; i++) {
                var recoveryCodeLiElement = recoveryCodes[i].innerText;
                recoveryCodeList += recoveryCodeLiElement + "\r\n";
            }

            return recoveryCodeList;
        }

        function buildDownloadContent() {
            var recoveryCodeList = parseRecoveryCodeList();
            var dt = new Date();
            var options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                timeZoneName: 'short'
            };

            return fileBodyContent =
                "${msg("recovery-codes-download-file-header")}\n\n" +
                recoveryCodeList + "\n" +
                "${msg("recovery-codes-download-file-description")}\n\n" +
                "${msg("recovery-codes-download-file-date")} " + formatCurrentDateTime();
        }

        function setUpDownloadLinkAndDownload(filename, text) {
            var el = document.createElement('a');
            el.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            el.setAttribute('download', filename);
            el.style.display = 'none';
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);
        }

        function downloadRecoveryCodes() {
            setUpDownloadLinkAndDownload('kc-download-recovery-codes.txt', buildDownloadContent());
        }

        var downloadButton = document.getElementById("downloadRecoveryCodes");
        downloadButton && downloadButton.addEventListener("click", downloadRecoveryCodes);

        /* print recovery codes */
        function buildPrintContent() {
            var recoveryCodeListHTML = document.getElementById('kc-recovery-codes-list').innerHTML;
            var styles =
                `@page { size: auto;  margin-top: 0; }
                body { width: 480px; }
                div { list-style-type: none; font-family: monospace }
                p:first-of-type { margin-top: 48px }`;

            return printFileContent =
                "<html><style>" + styles + "</style><body>" +
                "<title>kc-download-recovery-codes</title>" +
                "<p>${msg("recovery-codes-download-file-header")}</p>" +
                "<div>" + recoveryCodeListHTML + "</div>" +
                "<p>${msg("recovery-codes-download-file-description")}</p>" +
                "<p>${msg("recovery-codes-download-file-date")} " + formatCurrentDateTime() + "</p>" +
                "</body></html>";
        }

        function printRecoveryCodes() {
            var w = window.open();
            w.document.write(buildPrintContent());
            w.print();
            w.close();
        }

        var printButton = document.getElementById("printRecoveryCodes");
        printButton && printButton.addEventListener("click", printRecoveryCodes);
    </script>
</#if>
</@layout.registrationLayout>
