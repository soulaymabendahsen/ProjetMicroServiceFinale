<#import "components/document.ftl" as document>
<#import "components/layout/alerts.ftl" as alerts>
<#import "components/layout/another-way.ftl" as anotherWay>
<#import "components/layout/card.ftl" as card>
<#import "components/layout/card-footer.ftl" as cardFooter>
<#import "components/layout/card-header.ftl" as cardHeader>
<#import "components/layout/card-main.ftl" as cardMain>
<#import "components/layout/container.ftl" as container>
<#import "components/layout/locales.ftl" as locales>
<#import "components/layout/nav.ftl" as nav>
<#import "components/layout/required-fields.ftl" as requiredFields>
<#import "components/layout/title.ftl" as title>
<#import "components/layout/subtitle.ftl" as subtitle>
<#import "components/layout/username.ftl" as username>

<#macro registrationLayout
  displayInfo=false
  displayMessage=true
  displayRequiredFields=false
  showAnotherWayIfPresent=true
>
  <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <link rel="icon" href="${url.resourcesPath}/img/ORDS.AE_LOGO.png"/>
      <@document.kw />
      
      <style>
        /* Basic page reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          background-color: #f4f4f4;
          color: #333;
        }

        /* Container for content */
        @container.kw {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        /* Card Styling */
        @card.kw {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 500px;
          padding: 20px;
        }

        /* Card Header */
        @cardHeader.kw {
          margin-bottom: 20px;
        }

        /* Title Styling */
        @title.kw {
          font-size: 24px;
          font-weight: bold;
          color: #4CAF50;
          text-align: center;
        }

        /* Subtitle Styling */
        @subtitle.kw {
          font-size: 16px;
          color: #555;
          text-align: center;
          margin-top: 10px;
        }

        /* Form Styling */
        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        /* Input fields and buttons */
        input[type="submit"],
        button {
          background-color: #4CAF50;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        input[type="submit"]:hover,
        button:hover {
          background-color: #45a049;
        }

        /* Required Fields Section */
        @requiredFields.kw {
          margin-top: 20px;
          font-size: 14px;
          color: #d9534f;
        }

        /* Alerts (Error/Success Messages) */
        @alerts.kw {
          padding: 10px;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        /* Footer for extra information */
        @cardFooter.kw {
          margin-top: 20px;
          background-color: #f1f1f1;
          padding: 10px;
          border-radius: 4px;
          text-align: center;
        }

        /* Navigation Styling */
        @nav.kw {
          background-color: #4CAF50;
          padding: 10px 0;
          text-align: center;
        }

        /* Locale switcher */
        @locales.kw {
          margin-top: 10px;
          font-size: 14px;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
          body {
            padding: 10px;
          }
          @card.kw {
            width: 100%;
            padding: 15px;
          }
        }
      </style>
    </head>
    <body>
      <@container.kw>
        <@card.kw>
          <@cardHeader.kw>
            <@title.kw />

            <!-- Header Section with conditional content based on authentication -->
            <#if !(auth?has_content && auth.showUsername() && !auth.showResetCredentials())>
              <@subtitle.kw>
                <#nested "header">
              </@subtitle.kw>
            <#else>
              <@username.kw />
            </#if>
          </@cardHeader.kw>

          <@cardMain.kw>
            <!-- Display messages/alerts if present -->
            <#if displayMessage && message?has_content && (message.type != "warning" || !isAppInitiatedAction??)>
              <@alerts.kw />
            </#if>

            <!-- Dynamic form section -->
            <#nested "form">

            <!-- Display required fields notice -->
            <#if displayRequiredFields>
              <@requiredFields.kw />
            </#if>

            <!-- Display "Try Another Way" link if applicable -->
            <#if auth?has_content && auth.showTryAnotherWayLink() && showAnotherWayIfPresent>
              <@anotherWay.kw />
            </#if>
          </@cardMain.kw>

          <!-- Optional footer information -->
          <#if displayInfo>
            <@cardFooter.kw>
              <#nested "info">
            </@cardFooter.kw>
          </#if>
        </@card.kw>

        <!-- Navigation bar with locale switcher -->
        <@nav.kw>
          <#nested "nav">
          
          <!-- Locale switcher (only show if multiple languages are available) -->
          <#if realm.internationalizationEnabled && locale.supported?size gt 1>
            <@locales.kw />
          </#if>
        </@nav.kw>
      </@container.kw>
    </body>
  </html>
</#macro>
