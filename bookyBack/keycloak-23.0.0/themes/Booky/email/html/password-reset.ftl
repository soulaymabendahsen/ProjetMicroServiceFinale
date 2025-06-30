<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation de mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f9f9f9;
            color: #333;
        }
        table {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            border-collapse: collapse;
            background-color: #ffffff;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        td {
            padding: 20px;
        }
        .header {
            background-color: #f9f9f9;
            text-align: center;
            padding: 30px 20px;
        }
        .header img {
            max-width: 200px;
            height: auto;
        }
        .content {
            text-align: left;
        }
        .content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        .content p {
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .button-container {
            text-align: center;
        }
        .button-container a {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .button-container a:hover {
            background-color: #0056b3;
        }
        .footer {
            text-align: center;
            font-size: 14px;
            color: #666;
            padding: 10px 20px;
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    <table>
        <!-- Header Section -->
        <tr>
            <td class="header">
                <h1>Réinitialisation de votre mot de passe</h1>
            </td>
        </tr>
        <!-- Content Section -->
        <tr>
            <td class="content">
                
                <p>Bonjour,</p>
                <p>
                    Vous avez demandé la réinitialisation de votre mot de passe. Veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe.
                </p>
                <div class="button-container">
                    ${kcSanitize(msg("passwordResetBodyHtml2",link))?no_esc}  
                </div>
                <p>
                    Si vous n'avez pas demandé cette action, veuillez ignorer cet email. Votre mot de passe restera inchangé.
                </p>
            </td>
        </tr>
        <!-- Footer Section -->
        <tr>
            <td class="footer">
                Cet email a été généré automatiquement. Veuillez ne pas y répondre.
            </td>
        </tr>
    </table>
</body>
</html>
