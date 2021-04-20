# Generate a PHP REST API client for an OpenAPI specification (PART-2)

In the [last post](https://whizsid.github.io/blog/9/generate-a-php-rest-api-client-for-an-openapi-specification-(part-1).html) we initialized our project. In this post we have to
generate models, setters and getters for definitions.

All models are classes. Also we have to add more type of classes in the
future. So we have to define a generic class to generate classes. This
generic class should contains following functionalities.

- Add a property.
- Add a method
- Add a class constant. (To define enum fields)
- Save by resolving namespaces

## A generic class to extend all class generators

As the start create an empty class to implement our generic class.

```php
# gencode/src/GenericClass.php

namespace Arimac\Sigfox\Gencode;

class GenericClass {

}
```

And we need to parse the namespace and the class name as initial
values. So we have to take these values as parameters in the
constructor function.

```php
# gencode/src/GenericClass.php

namespace Arimac\Sigfox\Gencode;

class GenericClass {

    /** @var string **/
    protected $namespaceName;

    /** @var string **/
    protected $name;

    public function __constructor(string $namespaceName, string $name)
    {
        $this->namespaceName = $namespaceName;
        $this->name = $name;
    }
}
```

When adding methods and parameters we want wrapped the ast class builder
inside of our `GenericClass`. Because all methods and properties storing
in this builder.

```php
# gencode/src/GenericClass.php

// ..
use PhpParser\Builder\Class_;
use PhpParser\BuilderFactory;

class GenericClass {
    // ...

    /** @var BuilderFactory **/
    protected $factory;

    /** @var Class_ **/
    protected $class;

    /** @var Namespace_ **/
    protected $namespace;

    public function __constructor(string $namespaceName, string $name)
    {
        // ...

        $this->factory = new BuilderFactory;
        $this->class = $this->factory->class($name);
        $this->namespace = $this->factory->namespace($namespaceName);
    }
}

```

`BuilderFactory` is the statements wizard. We can create any statements
by using human readable syntaxes with the `BuilderFactory`. `Class_` is
our class builder. It will holding our parameters and methods till
render. And `Namespace_` will hold our all `use` statements.

## A common method to add properties to classes

Next step is adding a method to add properties. Define a function to add
properties and it will take the property type, visibility, property name
and an optional doc comment as parameters. But in this project we don't
want to pass the visibility as a parameter. Because all we will
implement getters and setters to access properties. So we do not want to
give rights to direct access properties.

```php
# gencode/src/GenericClass.php

// ...
public function addProperty(
    string $name, 
    string $type, 
    ?string $docComment = null
)
{
    $property = $this->factory->property($name);
    $property->makeProtected();
    $property->setType($type);
    if($docComment){
        $property->setDocComment($docComment);
    }
    $this->class->addStmt($property);
}
// ...
```

As we discussed earlier all properties are not visible to
outside (protected).

And we can do a small nit to the property types. Imagine if we passed a
long property type like
`Arimac\Sigfox\Definition\FooBarFoo\FooBarFoo\FooBarFoo`. Then the code
readability will slightly decreasing. We can add this as a `use`
statement and use only the class name as the type.

Define a new method to format types. It should add the type as a `use`
statement if the type has a namespace. And should return only the class
name. Otherwise it should return the passed value without doing anything.

```php
# gencode/src/GenericClass.php

// ...
protected function formatType(string $type): string
{
    $slices = explode("\\", $type);
    // has a namespace
    if (count($slices) > 1) {
        $className = array_pop($slices);

        $namespace = implode("\\", $slices);

        // the type is not a sibiling. So give a warm 
        // welcome to this guest type
        if ($namespace !== $this->namespaceName) {
            $this->namespace->addStmt(
                $this->factory->use($namespace . "\\" . $className)
            );
        }

        return $className;
    } else {
        return $type;
    }
}
// ...
```

And also use this method in the `addProperty` method.

```php
# gencode/src/GenericClass.php

// ...
public function addProperty(
    string $name,
    string $type,
    ?string $docComment = null
) {
    // ...
    $this->setType($this->formatType($type));
    // ...
}

```

## A common method to add class constants

Adding a function to add class constants is most likely the previous
function. But we can not define a type to the constant. Because it is a
static one. And all constants must have a value. And users should have
access all constants directly. Because we are using them as enum fields.

```php
# gencode/src/GenericClass.php

// ...
use PhpParser\BuilderHelpers;
use PhpParser\Node\Stmt\Class_ as StmtClass_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\Node\Const_;

// ...
public function addConst(string $name, $value, ?string $docComment = null)
{
    $attributes = [];
    if ($docComment) {
        $attributes["comments"] = [BuilderHelpers::normalizeDocComment($docComment)];
    }
    $const = new Const_($name, BuilderHelpers::normalizeValue($value));
    $classConst = new ClassConst(
        [$const],
        StmtClass_::MODIFIER_PUBLIC,
        $attributes
    );
    $this->class->addStmt($classConst);
}
// ...
```
At the moment `PHP-Parser` doesn't have a easy to use factory method to
create class constants. It will add by [this](https://github.com/nikic/PHP-Parser/pull/765) PR. So we have to use
raw method to add class constants till it release.

## A common method to add class methods

We do not need to define `protected` and `private` methods. Because we
can extend these classes to a common class and define them in a generic
way. So we do not need to pass the visibility as a parameter to create a
method. We need method name, parameters, return type and statements.

```php
# gencode/src/GenericClass.php

// ...
public function addMethod(
    string $name,
    array $params,
    $stmts,
    ?string $returnType=null,
    ?string $docComment=null
)
{
    $method = $this->factory->method($name);
    $method->makePublic();
    $method->addParams($params);
    if($returnType){
        $method->setReturnType($this->formatType($returnType));
    }
    $method->addStmts($stmts);
    if($docComment){
        $method->setDocComment($docComment);
    }
    $this->class->addStmt($method);
}
// ...
```

And we can use the previous `formatType` function to format the return
type.

```php
# gencode/src/GenericClass.php

// ...
$method->setReturnType($this->formatType($returnType));
// ...
```

## A common method to save classes

We need to define a method to save all classes by resolving their
namespaces. This function should get a string representation of codes by
a pretty printer and save that contents in the file.

First we will implement a new function to save contents and save an
empty file by resolving namespace.

```php
# gencode/src/GenericClass.php

// ...
public function save()
{
    $contents = "";
    $namespaceSlices = explode("\\", $this->namespaceName);
    array_shift($namespaceSlices);
    array_shift($namespaceSlices);
    $dir = dirname(__DIR__) . "/../src/";
    foreach ($namespaceSlices as $folder) {
        $dir .= $folder . "/";
        @mkdir($dir);
    }
    file_put_contents($dir . $this->getClassName() . ".php", $contents);
}
// ...
```

I removed the `Arimac\Sigfox` part from the namespace. Because this part
is not necessary to create folders. And I recursively
made folders for the remaining namespace part. I used a leading `@`
character to avoid already exists errors.

Now we have to convert our AST nodes to code segments.

```php
# gencode/src/GenericClass.php

use PhpParser\PrettyPrinter;

// ...
public function save()
{
    $this->namespace->addStmt($this->class);
    $node = $this->namespace->getNode();
    $stmts = array($node);
    $prettyPrinter = new PrettyPrinter\Standard();
    $contents = $prettyPrinter->prettyPrintFile($stmts);

    // ...
}
// ...
```

## Implementing a class generator to generate definitions

Previously we implemented a generic class to implement all generators.
Now we have to implement our generators and extend these generators to
that class. As the start we will implement model classes for definitions.
Because all functionalities depends on the definitions.

Define an empty class to implement definitions generator.

```php
# gencode/src/Definition.php

<?php

namespace Arimac\Sigfox\Gencode;

class Definition extends GenericClass {
    

}
```

All definitions are model classes. So we should implement setters and
getters for all properties to access them from outside. We should
implement new methods in the `Definition` class to add getters and
setters.

Define a function to add a setter to the class.

```php
# gencode/src/Definition.php

public function addSetter(string $propertyName, ?string $docComment=null)
{
}
```

We can use the `addMethod` function to add the setter.

```php
# gencode/src/Definition.php

use PhpParser\Node\Expr\Assign;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\NullableType;

// ...
public function addSetter(
    string $type,
    string $propertyName,
    bool $optional,
    ?string $docComment=null
)
{
    $assignment = new Assign(new Variable("this->$propertyName"), new Variable("$propertyName"));

    $param = $this->factory->param($propertyName);
    $param->setType($optional ? new NullableType($type) : $type);

    $this->addMethod("set".ucfirst($propertyName),[$param],[$assignment], null, $docComment);
}
// ...

```

We can use the `formatType` method to format the parameter type.

```php
# gencode/src/Definition.php

// ...
$type = $this->formatType($type);
$param = $this->factory->param($propertyName);
// ...

```

The add getter function is same as the `addSetter` function. Only
difference is it not taking any parameter and it returning a value.

```php
# gencode/src/Definition.php

// ...
public function addGetter(
    string $type,
    string $propertyName,
    bool $optional,
    ?string $docComment=null
)
{
    $ret = new Return_(new Variable("this->$propertyName"));

    $type = $this->formatType($type);
    $type = $optional ? new NullableType($type) : $type;

    $this->addMethod("get".ucfirst($propertyName),[],[$ret], $type, $docComment);
}
// ...
```
