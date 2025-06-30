<html>
	<body>
		<table style="width: 100%; max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; background-color: #f9f9f9; text-align: center;">
                <h2 style="margin-bottom: 20px;">Vérification à deux facteurs</h2>
                <p>Veuillez utiliser le code suivant pour vérifier votre identité :</p>
                <div style="background-color: #ffffff; border: 1px solid #cccccc; padding: 10px; font-size: 24px; margin-top: 20px;">
                    <!-- Insérez le code de vérification ici -->
                   <strong>${kcSanitize(msg("emailCodeBody", code))?no_esc}</strong>
                </div>
                <p style="margin-top: 20px;">Ce code expirera dans 5 minutes.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #eeeeee; text-align: center;">
                <p style="margin-bottom: 0;">Si vous n'avez pas demandé ce code, veuillez ignorer cet e-mail.</p>
            </td>
        </tr>
    </table>
	</body>
</html>

