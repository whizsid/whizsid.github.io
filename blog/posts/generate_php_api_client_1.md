# Generate a PHP REST API client for an OpenAPI specification (PART-1)

Nowadays most of Software Developers developing API clients by manual
methods. Such as copy-paste and coding. It wasting more useful time. 
Imagine if an API has more than 100 endpoints. Sometimes they have to 
spend month or two to complete the whole API client.

But this post contains a different approach than copy & pasting. You can
finish the API client in 2-5 days by using this approach. We are
developing this API client by code generating.

## How to generate code

There are two different approaches to generate codes.

1. Using predefined templates and render them
2. Using an AST builder and pretty printer

### Why we shouldn't use predefined templates

1. Code formatting issues

Sometimes we have to define long function names and class names. At such
cases We can not generate our code by following code standards.

Example:-
```php
# What template method returns:-
public function myLongLongLongLongLongLongFunc(MyLongLongLongLongLongLongLongType $myLongLongLongLongParam): MyLongLongLongLongLongLongLongType {

}

# What pretty printer returns:-
public function myLongLongLongLongLongLongFunc(
    MyLongLongLongLongLongLongLongType $myLongLongLongLongParam
): MyLongLongLongLongLongLongLongType {

}

```

2. Code Validation

By using templates we can not garantee our code syntaxes correct. But AST
builder will always validate our code while generating.

3. Builder

When we using templates we need to implement builder classes to store 
our class properties and function statements. But there are pre-built 
builder classes in AST builder. So we do not need to re-implement a
builder class to store properties, functions and etc. 

### What AST builder we should use?

There are several php AST builders and pretty printers in the github. 
Some of these does not have more features. I am choosing the 
[nikic/PHP-Parser](https://github.com/nikic/PHP-Parser) for this post. 
Because it is a very up-to-date and stable project.

## Starting The Project

First of all create a github repository and clone it. Then create a 
gitignore file with these contents:-

```
# .gitignore
/vendor/
composer.lock
/gencode/vendor/
/gencode/composer.lock
```

### Folder Structure

Make folders as in below structure.

```
/gencode
----/src # Contains the source codes of the code generator
/src# Contains the source codes of the API client
```

### Install dependencies
Create `composer.json` file in the root folder and the `gencode` folder.

```
$ composer init
$ cd gencode
$ composer init
$ cd ../
```

`composer init` commands will ask you for project details. Provide
details as you want.

Install the `nikic/PHP-Parser` in the `gencode` folder as the next step.

```
$ cd gencode
$ composer require nikic/php-parser
$ cd ../
```

Next add following contents to the `gencode/composer.json` file to setup
class autoloader.

```json
# gencode/composer.json
{
    // ..
    "autoload": {
        "psr-4": {
            "My\\FooClient\\GenCode\\": "src/"
        }
    }
}

```

Change `My\\FooClient` as you need.

## Start Coding

### Making a PHP executable file

First we should create a executable file as the entry point of our
program. I am creating a file named `gencode` (without `.php` extension)
in `gencode/bin` folder. And giving executable permissions.

```
$ mkdir gencode/bin
$ touch gencode/bin/gencode
$ chmod +x gencode/bin/gencode
```
At the moment our terminal know this file can be executed. But it don't 
know how it should execute. So we need to tell the terminal to execute 
it as a php script. So we will add `#!/usr/bin/env php` on top of the 
file as a new line.

```php
# gencode/bin/gencode
#!/usr/bin/env php
<?php

```

Next add the composer autoloader file to autoload our classes.

```php
# gencode/bin/gencode

$dir = dirname(__DIR__);

require_once $dir . "/vendor/autoload.php";
```

## Download OpenAPI Specification

As the next step, we must download the openapi specification before all
works. Because our whole client is depending on
this file. And we have to access it very often through
our code generator. So we should store it in our local storage. At this
project I am storing the specification file in a directory named `tmp`
and using the Sigfox API specification file. Because my company is
frequently using this Sigfox API and I am planning to move to a high
level API client insteed of calling the API directly.

```php
# gencode/bin/gencode

// Local path for the openapi specification
$openapiFileLocation = $dir . "/tmp/openapi.json";
// Downloading the file if it not exist in local storage
if (!file_exists($openapiFileLocation)) {

    // Creating the tmp directory if not exists.
    if(!is_dir($dir."/tmp")){
        mkdir($dir."/tmp");
    }

    // Remote path for the openapi specification
    $openapiUrl = "https://support.sigfox.com/api/apidocs";
    // Downloading directly to the local storage
    file_put_contents($openapiFileLocation, fopen($openapiUrl, 'r'));
}

// Reading the json content from the downloaded file
$openapi = json_decode( file_get_contents($openapiFileLocation) , true);
```

And we do not need this specification file in our VCS. Because this file
is always live in their site. So I am ignoring the file for VCS.

```
# .gitignore
/gencode/tmp/
```

I completed the creation of project structure at this post. At the next 
post I will discuss about models, setters and getters creation for
definitions.
