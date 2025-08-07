<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

echo "Test d'envoi d'email vers une adresse différente...\n";

$name = "Test SYCEBNL";
$email = "test@sycebnl.com";
$subject = "Test d'envoi d'email automatique";
$message = "Ceci est un test de l'envoi automatique d'emails depuis SYCEBNL Academy. Si vous recevez cet email, cela signifie que la configuration email fonctionne correctement.";

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
    $mail->setFrom('sycebnlacademy@gmail.com', 'SYCEBNL Academy');
    $mail->addAddress('pdgcavenro@sycebnl.com');              // Test avec votre email personnel
    $mail->addReplyTo($email, $name);

    echo "Configuration du contenu...\n";
    
    // Content
    $mail->isHTML(true);                                        // Set email format to HTML
    $mail->Subject = 'Test: ' . $subject;
    $mail->Body    = "
    <h2>Test d'envoi d'email SYCEBNL Academy</h2>
    <p><strong>Nom:</strong> $name</p>
    <p><strong>Email:</strong> $email</p>
    <p><strong>Sujet:</strong> $subject</p>
    <p><strong>Message:</strong></p>
    <p>$message</p>
    <hr>
    <p><em>Cet email a été envoyé automatiquement pour tester la configuration email de SYCEBNL Academy.</em></p>
    ";
    $mail->AltBody = "Test d'envoi d'email SYCEBNL Academy\n\nNom: $name\nEmail: $email\nSujet: $subject\nMessage:\n$message";

    echo "Envoi de l'email...\n";
    
    $mail->send();
    
    echo "SUCCÈS: Email envoyé avec succès!\n";
    echo "Détails:\n";
    echo "- De: sycebnlacademy@gmail.com\n";
    echo "- À: pdgcavenro@sycebnl.com\n";
    echo "- Sujet: Test: $subject\n";
    echo "\nVérifiez votre boîte de réception pdgcavenro@sycebnl.com\n";
    
} catch (Exception $e) {
    echo "ERREUR: L'envoi du test a échoué.\n";
    echo "Erreur: " . $mail->ErrorInfo . "\n";
}

?> 