<?php

echo "Begin send email..."
$mail = mail('phongle2512@gmail.com', 'My Subject', 'Order...');
if ($mail) {
	echo "Message sent!"
} else {
	echo "Message delivery failed..."
}
$mail = mail('hai_phong2512@yahoo.com', 'My Subject', 'Order...');
if ($mail) {
	echo "Message sent!"
} else {
	echo "Message delivery failed..."
}

// $name       = @trim(stripslashes($_POST['name'])); 
// $from       = @trim(stripslashes($_POST['email']));
// $phone 		= @trim(stripslashes($_POST['phone']));
// $subject    = @trim(stripslashes($_POST['subject'])); 
// $message    = @trim(stripslashes($_POST['message'])); 
// $to   		= 'phongle2512@gmail.com';//replace with your email

// $headers   = array();
// $headers[] = "MIME-Version: 1.0";
// $headers[] = "Content-type: text/plain; charset=iso-8859-1";
// $headers[] = "From: {$name}-{$phone} <{$from}>";
// $headers[] = "Reply-To: <{$from}>";
// $headers[] = "Subject: {$subject}";
// $headers[] = "X-Mailer: PHP/".phpversion();

//mail($to, $subject, $message, $headers);
//echo "Thank you for contacting us!";

die;
?>