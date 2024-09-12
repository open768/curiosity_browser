<?php
if (!headers_sent()) {
    header("Access-Control-Allow-Headers: newrelic, traceparent, tracestate");
    header("Access-Control-Allow-Origin: *");
}
?>
<!DOCTYPE html>
<html>