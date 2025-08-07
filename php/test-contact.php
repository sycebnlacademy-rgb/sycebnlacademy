<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

echo "Test du formulaire de contact...\n";

// Simuler les données du formulaire
$_POST["name"] = "Test Contact";
$_POST["email"] = "test@contact.com";
$_POST["subject"] = "Test Formulaire";
$_POST["message"] = "Ceci est un test du formulaire de contact.";

$name = htmlspecialchars($_POST["name"]);
$email = htmlspecialchars($_POST["email"]);
$subject = htmlspecialchars($_POST["subject"]);
$message = htmlspecialchars($_POST["message"]);

echo "Données du formulaire:\n";
echo "- Nom: $name\n";
echo "- Email: $email\n";
echo "- Sujet: $subject\n";
echo "- Message: $message\n\n";

$mail = new PHPMailer(true);

try {
    echo "Configuration du serveur SMTP...\n";
    
    //Server settings
    $mail->isSMTP();                                            // Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'sycebnlacademy@gmail.com';             // SMTP username
    $mail->Password   = 'amhfwzdpwtfofsda';                     // SMTP password (use App Password for Gmail)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            // Enable implicit TLS encryption
    $mail->Port       = 465;                                    // TCP port to connect to; use 587 if you added `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    echo "Configuration des destinataires...\n";
    
    //Recipients
    $mail->setFrom($email, $name);
    $mail->addAddress('sycebnlacademy@gmail.com');              // Add a recipient
    $mail->addReplyTo($email, $name);

    echo "Configuration du contenu...\n";
    
    // Content
    $mail->isHTML(true);                                        // Set email format to HTML
    $mail->Subject = 'Nouvelle demande de contact: ' . $subject;
    $mail->Body    = "Nom: $name<br>Email: $email<br>Sujet: $subject<br>Message:<br>$message";
    $mail->AltBody = "Nom: $name\nEmail: $email\nSujet: $subject\nMessage:\n$message";

    echo "Envoi de l'email...\n";
    
    $mail->send();
    
    echo "SUCCÈS: Email du formulaire envoyé avec succès!\n";
    echo "Détails:\n";
    echo "- De: $email\n";
    echo "- À: sycebnlacademy@gmail.com\n";
    echo "- Sujet: Nouvelle demande de contact: $subject\n";
    echo "\nLe formulaire de contact fonctionne correctement!\n";
    
} catch (Exception $e) {
    echo "ERREUR: L'envoi du formulaire a échoué.\n";
    echo "Erreur: " . $mail->ErrorInfo . "\n";
}

?> 