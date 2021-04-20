<?php

namespace Arimac\Sigfox\Gencode;

use PhpParser\Node\Expr\Assign;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\NullableType;
use PhpParser\Node\Stmt\Return_;

class Definition extends GenericClass {
    public function addSetter(
        string $type,
        string $propertyName,
        bool $optional,
        ?string $docComment=null
    )
    {
        $assignment = new Assign(new Variable("this->$propertyName"), new Variable("$propertyName"));

        $type = $this->formatType($type);
        $param = $this->factory->param($propertyName);
        $param->setType($optional ? new NullableType($type) : $type);

        $this->addMethod("set".ucfirst($propertyName),[$param],[$assignment], null, $docComment);
    } 

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
}
