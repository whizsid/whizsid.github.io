# Converting a Doctrine 2 entity to an array

Doctrine 2 is a powerful and popular PHP ORM engine. When using ORM
engines you have to deal with objects as entities. But in real-world
complex scenarios, you have to convert entities to arrays
for processing. The doctrine documentation not mentioning a way to convert
entities to arrays. But you can achieve this by using `UnitOfWork` API.
`UnitOfWork` API is a bridge to use Doctrine's internal processes.

## Recommended way

As a backend engineer I am recommending to obtain the results as arrays
when fetching from the query. To fetch results as array, you can pass
`HYDRATE_ARRAY` as a parameter to `getResult` method. Or you can use 
the `getArrayResult` alias.

```php

$arrResult= $this->createQueryBuilder('u')
    ->where('u.image IS NULL')
    ->getQuery()
    ->getArrayResult();

```

Because doctrine deep level APIs are more unstable. If you used these
APIs, you will have to change your code when upgrading.

## Using Doctrine 2 `UnitOfWork`

By using `UnitOfWork` API, you can easily convert your entity to an
array. Actually it is not a conversion. `UnitOfWork` is internally storing
the fetched entities as arrays. You can easily get these data by calling the
`getOriginalEntityData` method.

```php
$entity = $this->find($id);

$arr = $this->getEntityManager()
    ->getUnitOfWork()
    ->getOriginalEntityData($entity);
```

> WARNING: getOriginalEntityData is only returning the data that you
fetched from the database. And it will not be automatically synchronized
with your entity model. It will be syncronized only if you called the
`flush` method.

## Converting an doctrine entity to array after persisted

The data returned from the `getOriginalEntityData` is not synchronized
with your model even if you called `persist`. But `UnitOfWork` is also
storing the changes that you made to entities. These changes will be
only synchronized after you called `persist` method. You can retrieve
these changed data by calling `getEntityChangeSet` method. After merge
the change set with the original data.

```php

$entity = $this->find($id);

$uow = $this->getEntityManager()->getUnitOfWork();

$changeSet = $uow->getEntityChangeSet($entity);
var_dump($changeSet); // [ 'name' => [ 0 => 'Old Name', 1 => 'New Name' ]]

$originalData = $uow->getOriginalEntityData($entity);
var_dump($originalData); // [ 'name' => 'Old Name' , 'username'=> 'oldusername']

$newData = array_map(function($i){return $i[1];}, $changeSet);
var_dump($newData); // ['name' => 'New Name']

$data = array_merge($originalData, $newData);
var_dump($data); // [ 'name' => 'New Name', 'username' => 'oldusername' ]

```
