<#import "template.ftl" as layout>

<style>
    header .logout-title {
        font-size: 24px;
        text-align: center;
        margin-bottom: 20px;
        color: #333; /* Neutral dark color */
    }

    #logout-message {
        max-width: 600px;
        margin: 20px auto;
        text-align: center;
        font-size: 16px;
        color: #555; /* Neutral tone for text */
    }

    .logout-client-list {
        list-style: none;
        padding: 0;
        margin: 20px 0;
        text-align: center;
    }

    .logout-client-item {
        margin: 10px 0;
        color: #007bff; /* Link-like color for client names */
    }

    #logout-redirect {
        text-align: center;
        margin-top: 30px;
    }

    #continue.btn {
        padding: 10px 20px;
        font-size: 16px;
        border-radius: 5px;
        text-decoration: none;
    }
</style>

<@layout.registrationLayout; section>
    
    <#if section == "header">
        <script>
            document.title = "${msg("frontchannel-logout.title")}";
        </script>
        <header>
            <h1 class="logout-title">${msg("frontchannel-logout.title")}</h1>
        </header>
    
    <#elseif section == "form">
        <section id="logout-message">
            <p>${msg("frontchannel-logout.message")}</p>
            <ul class="logout-client-list">
                <#list logout.clients as client>
                    <li class="logout-client-item">
                        ${kcSanitize(client.name)?no_esc}
                        <iframe src="${client.frontChannelLogoutUrl}" style="display:none;" aria-hidden="true"></iframe>
                    </li>
                </#list>
            </ul>
        </section>
        
        <#if logout.logoutRedirectUri?has_content>
            <script>
                document.addEventListener('readystatechange', function(event) {
                    if (document.readyState === 'complete') {
                        window.location.replace('${logout.logoutRedirectUri}');
                    }
                });
            </script>
            <div id="logout-redirect">
                <a id="continue" class="btn btn-primary" href="${logout.logoutRedirectUri}">
                    ${msg("doContinue")}
                </a>
            </div>
        </#if>
    </#if>

</@layout.registrationLayout>
