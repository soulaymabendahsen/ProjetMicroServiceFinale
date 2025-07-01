<#import "template.ftl" as layout>

<@layout.registrationLayout; section>

    <#if section == "header">
        <h1 class="text-2xl font-semibold text-center mb-6 text-gray-800">
            ${msg("saml.post-form.title")}
        </h1>
    <#elseif section == "form">
        <!-- Auto-submit form via JS -->
        <script>
            window.onload = function() {
                document.forms[0].submit();
            };
        </script>

        <!-- Information message -->
        <p class="text-center text-lg mb-4 text-gray-600">
            ${msg("saml.post-form.message")}
        </p>

        <!-- SAML POST Form -->
        <form name="saml-post-binding" method="post" action="${samlPost.url}" class="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg">
            <#if samlPost.SAMLRequest??>
                <input type="hidden" name="SAMLRequest" value="${samlPost.SAMLRequest}"/>
            </#if>
            <#if samlPost.SAMLResponse??>
                <input type="hidden" name="SAMLResponse" value="${samlPost.SAMLResponse}"/>
            </#if>
            <#if samlPost.relayState??>
                <input type="hidden" name="RelayState" value="${samlPost.relayState}"/>
            </#if>

            <!-- NoScript message -->
            <noscript>
                <div class="text-center text-red-500 font-medium">
                    <p>${msg("saml.post-form.js-disabled")}</p>
                    <input type="submit" value="${msg("doContinue")}" class="mt-4 px-6 py-2 bg-primary-500 text-white rounded-md shadow hover:bg-primary-600 transition-colors duration-300"/>
                </div>
            </noscript>

            <!-- Submit button (for JS-enabled browsers) -->
            <div class="flex justify-center">
                <input type="submit" value="${msg("doContinue")}" class="px-6 py-2 bg-primary-500 text-white rounded-md shadow hover:bg-primary-600 transition-colors duration-300"/>
            </div>
        </form>
    </#if>

</@layout.registrationLayout>
