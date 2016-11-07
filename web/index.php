<?php

require('../vendor/autoload.php');

$app = new Silex\Application();
$app['debug'] = true;

// Register the monolog logging service
$app->register(new Silex\Provider\MonologServiceProvider(), array(
  'monolog.logfile' => 'php://stderr',
));

// Register view rendering
$app->register(new Silex\Provider\TwigServiceProvider(), array(
    'twig.path' => __DIR__.'/views',
));

// Our web handlers

$app->get('/', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('home.twig');
});

$app->get('/sendemail.php', function() use($app) {
  $app['monolog']->addDebug('logging output.');
  return $app['twig']->render('sendemail.php');
});

$app->post('/sendemail', function(Request $request) use($app) {
	$login = $request->get('name');
  	echo "Begin send email..."
  	echo "name:" . $login
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
});

$app->run();
