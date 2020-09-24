<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');

$file_suffix = (isset($_GET['id']) ? '-with-value' : '');

$filename = 'list/list-' . rand(1, 2) . '.json';

echo file_get_contents($filename);


exit();