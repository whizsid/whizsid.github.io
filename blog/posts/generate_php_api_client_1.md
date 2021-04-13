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


