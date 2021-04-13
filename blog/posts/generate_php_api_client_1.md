# Generate a PHP REST API client for a OpenAPI specification (PART-1)

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
# What template method provides:-
public function myLongLongLongLongLongLongFunc(MyLongLongLongLongLongLongLongType $myLongLongLongLongParam): MyLongLongLongLongLongLongLongType {

}

# What pretty printer provides:-
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
our class properties and function statements. But there are pre-built builder 
classes in AST builder. So we do not need to re-implement a builder class 
to store properties, functions and etc. 

### What AST builder we should use?

There are several php AST builders and pretty printers in the github. Some of
these does not have more features. I am choosing the [nikic/PHP-Parser](https://github.com/nikic/PHP-Parser) for this post. Because
it is a very up-to-date and stable project.

## Starting The Project

First of all crrete a github repository and clone it. Then create a gitignore with these contents:-

```
# .gitignore
/vendor/
composer.lock
/gencode/vendor/
/gencode/composer.lock
```

### Folder Structure

```
/gencode
----/src # Contains the source codes of the code generator
/src# Contains the source codes of the API client
```

### Install dependencies
Initial `composer.json` file in the root folder and the `gencode` folder.

```
$ composer init
$ cd gencode
$ composer init
```

`composer init` commands will ask you for project details.

 Install the `nikic/PHP-Parser` in the `gencode` folder as the next step.

```
composer require nikic/php-parser
```
