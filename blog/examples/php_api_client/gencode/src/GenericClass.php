<?php

namespace Arimac\Sigfox\Gencode;

use PhpParser\Builder\Class_;
use PhpParser\Builder\Namespace_;
use PhpParser\BuilderFactory;

class GenericClass
{

    protected string $namespaceName;

    protected string $name;

    protected BuilderFactory $factory;

    protected Class_ $class;

    protected Namespace_ $namespace;

    public function __constructor(string $namespaceName, string $name)
    {
        $this->namespaceName = $namespaceName;
        $this->name = $name;

        $this->factory = new BuilderFactory;
        $this->class = $this->factory->class($name);
        $this->namespace = $this->factory->namespace($namespaceName);
    }

    public function addProperty(
        string $name,
        string $type,
        ?string $docComment = null
    ) {
        $property = $this->factory->property($name);
        $property->makeProtected();
        $property->setType($this->formatType($type));
        if ($docComment) {
            $property->setDocComment($docComment);
        }
        $this->class->addStmt($property);
    }

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
}
