<#import "template.ftl" as layout>

<@layout.registrationLayout displayInfo=false; section>

    <#if section == "header" || section == "show-username">
        <script type="text/javascript">
            function fillAndSubmit(authExecId) {
                document.getElementById('authexec-hidden-input').value = authExecId;
                document.getElementById('kc-select-credential-form').submit();
            }
        </script>

        <#if section == "header">
            <h2 class="text-3xl font-semibold text-center text-gray-800 mb-6">
                ${msg("loginChooseAuthenticator")}
            </h2>
        </#if>
    <#elseif section == "form">

        <form id="kc-select-credential-form" class="max-w-2xl mx-auto ${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div class="space-y-4 ${properties.kcSelectAuthListClass!}">

                <#list auth.authenticationSelections as authenticationSelection>
                    <div class="flex items-center p-4 rounded-lg border border-gray-300 hover:bg-gray-50 cursor-pointer transition-all ${properties.kcSelectAuthListItemClass!}" onclick="fillAndSubmit('${authenticationSelection.authExecId}')">
                        
                        <!-- Icon Section -->
                        <div class="mr-4 ${properties.kcSelectAuthListItemIconClass!}">
                            <i class="${properties['${authenticationSelection.iconCssClass}']!authenticationSelection.iconCssClass} ${properties.kcSelectAuthListItemIconPropertyClass!}"></i>
                        </div>

                        <!-- Description Section -->
                        <div class="flex-1">
                            <div class="text-xl font-medium text-gray-800 ${properties.kcSelectAuthListItemHeadingClass!}">
                                ${msg('${authenticationSelection.displayName}')}
                            </div>
                            <div class="text-sm text-gray-500 ${properties.kcSelectAuthListItemDescriptionClass!}">
                                ${msg('${authenticationSelection.helpText}')}
                            </div>
                        </div>

                        <!-- Arrow Icon -->
                        <div class="${properties.kcSelectAuthListItemArrowClass!}">
                            <i class="${properties.kcSelectAuthListItemArrowIconClass!} text-gray-400"></i>
                        </div>
                    </div>
                </#list>

                <!-- Hidden Input for Authentication Execution -->
                <input type="hidden" id="authexec-hidden-input" name="authenticationExecution" />
            </div>
        </form>

    </#if>

</@layout.registrationLayout>

<style>
    /* General form styling */
    #kc-select-credential-form {
        max-width: 800px;
        margin: 0 auto;
    }

    /* Hover effect for authentication list items */
    .${properties.kcSelectAuthListItemClass!}:hover {
        background-color: #f9fafb;
    }

    /* Space between authentication items */
    .${properties.kcSelectAuthListClass!} {
        margin-top: 20px;
    }

    /* Styling for icons in the authentication selection */
    .${properties.kcSelectAuthListItemIconClass!} {
        font-size: 24px;
        color: #4B5563; /* Adjust this to your brand color */
    }

    /* Arrow icon style */
    .${properties.kcSelectAuthListItemArrowClass!} {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    /* Text styling for the authentication options */
    .${properties.kcSelectAuthListItemHeadingClass!} {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1F2937;
    }

    .${properties.kcSelectAuthListItemDescriptionClass!} {
        color: #6B7280;
    }
</style>
