<?php

require('../vendor/autoload.php');
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

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

$app->post('/sendemail', function (Request $request) use($app) {	
    $message = $request->get('message');
    // heroku does not support send email
    mail('phongle2512@gmail.com', '[YourSite] Feedback', $message);    

    return new Response('Thank you for your feedback! ', 201);
});


$app->run();
