<?php

class BaseController

{

    public function __call($name, $arguments)

    {

        $this->sendOutput('', array('HTTP/1.1 404 Not Found'));

    }

    protected function getUriSegments()

    {

        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        $uri = explode( '/', $uri );

        return $uri;

    }

    protected function getQueryStringParams()

    // returns associative array of field-value pairs
    // also, if there are multiple values for one field, convert them to array using explode

    {

        $params = array();
        parse_str($_SERVER['QUERY_STRING'], $params);

        foreach ($params as $field => $value) {

            if (strpos($value, ',') !== false) {
                $params[$field] = explode(',', $value);
            }
        }

        return $params;

    }

    protected function setHeaders($httpHeaders) {

        header_remove('Set-Cookie');

        if (is_array($httpHeaders) && count($httpHeaders)) {

            foreach ($httpHeaders as $httpHeader) {

                header($httpHeader);

            }

        }

    }

    protected function sendOutput($data, $httpHeaders=array())

    {

        $this->setHeaders($httpHeaders);

        echo $data;

        exit;

    }

    protected function sendErrorOutput($error)

    {

        error_log($error);

        $this->sendOutput(
            json_encode(array('error' => $error->getMessage())), 
            array('Content-Type: application/json', 'HTTP/1.1 500 Internal Server Error')
        );

    }

}