<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');


$filename = 'submit/create-update.json';

echo file_get_contents($filename);

exit();