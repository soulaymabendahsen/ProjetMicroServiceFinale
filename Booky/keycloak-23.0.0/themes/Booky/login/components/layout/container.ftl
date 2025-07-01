<#macro kw>
  <div class="min-h-screen sm:py-16 flex items-center justify-center items-center full-page-background">
    <div class="w-fit flex justify-center items-center w-full p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white" style="border-radius: 30px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2); width: auto;">
      <div class="items-center justify-center flex space-between" style="position: relative; display: flex; height: 100%; padding: 2%;">
        <div class="text-center hide-on-mobile" style="display: flex; justify-content: center;">
          <img src="${url.resourcesPath}/img/ORDS.AE_BIG.png" 
          alt="login illustration" style="border-radius:30px">
        </div>
        <div class="space-y-6 w-full">
          <div class="text-center" style="display: flex; justify-content: center; padding-bottom:5%">
            <img src="${url.resourcesPath}/img/ORDS.AE.png">
          </div>
          <#nested>
        </div>
      </div>
    </div>
  </div>
  <style>
    .full-page-background {
      background-image: url('${url.resourcesPath}/img/BackGround.jpg');
      background-size: cover;
      background-position: center;
      min-height: 100vh;
      padding:5rem 15rem 5rem 15rem;
    }
    @media (max-width: 1100px) {
      .hide-on-mobile {
        display: none !important;
      }
    }
    .w-fit {
      padding: 20px 20px 10px 20px;
    }
  </style>
</#macro>
