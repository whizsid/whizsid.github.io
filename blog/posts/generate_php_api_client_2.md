# Generate a PHP REST API client for an OpenAPI specification (PART-1)

In the [last post](https://whizsid.github.io/blog/9/generate-a-php-rest-api-client-for-an-openapi-specification-(part-1).html) we initialized our project. In this post we have to
generate models, setters and getters for definitions.

All models are classes. Also we have to add more type of classes in the
future. So we have to define a generic class to generate classes. This
generic class should contains following functionalities.

- Add a property.
- Add a method
- Add a class constant. (To define enum fields)
- Save by resolving namespaces

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
