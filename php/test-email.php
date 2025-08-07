<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $name = "Test SYCEBNL";
    $email = "test@sycebnl.com";
    $subject = "Test d'envoi d'email automatique";
    $message = "Ceci est un test de l'envoi automatique d'emails depuis SYCEBNL Academy. Si vous recevez cet email, cela signifie que la configuration email fonctionne correctement.";

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                     // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'sycebnlacademy@gmail.com';             // SMTP username
        $mail->Password   = 'amhfwzdpwtfofsda';                     // SMTP password (use App Password for Gmail)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            // Enable implicit TLS encryption
        $mail->Port       = 465;                                    // TCP port to connect to; use 587 if you added `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('sycebnlacademy@gmail.com', 'SYCEBNL Academy');
        $mail->addAddress('sycebnlacademy@gmail.com');              // Add a recipient
        $mail->addReplyTo($email, $name);

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

        $mail->send();
        echo json_encode([
            "status" => "success", 
            "message" => "Email de test envoyé avec succès! Vérifiez votre boîte de réception.",
            "details" => [
                "from" => "sycebnlacademy@gmail.com",
                "to" => "sycebnlacademy@gmail.com",
                "subject" => "Test: " . $subject
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "status" => "error", 
            "message" => "L'envoi du test a échoué.", 
            "error" => $mail->ErrorInfo
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Méthode de requête non autorisée."]);
}

?> 