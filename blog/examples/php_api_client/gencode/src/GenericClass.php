<?php

namespace Arimac\Sigfox\Gencode;

use PhpParser\Builder\Class_;
use PhpParser\Builder\Namespace_;
use PhpParser\BuilderFactory;
use PhpParser\BuilderHelpers;
use PhpParser\Node\Const_;
use PhpParser\Node\Stmt\Class_ as StmtClass_;
use PhpParser\Node\Stmt\ClassConst;
use PhpParser\PrettyPrinter;

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

    public function save()
    {
        $this->namespace->addStmt($this->class);
        $node = $this->namespace->getNode();
        $stmts = array($node);
        $prettyPrinter = new PrettyPrinter\Standard();
        $contents = $prettyPrinter->prettyPrintFile($stmts);

        $namespaceSlices = explode("\\", $this->namespaceName);
        array_shift($namespaceSlices);
        array_shift($namespaceSlices);
        $dir = dirname(__DIR__) . "/../src/";
        foreach ($namespaceSlices as $folder) {
            $dir .= $folder . "/";
            @mkdir($dir);
        }
        file_put_contents($dir . $this->name . ".php", $contents);
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
