
rm -r ./release/$1/
# preRelease php_api_client 9 29ef34
mkdir -p ./release/$1/$2/

git archive --format zip --output ./release/$1/$2/all.zip $3:blog/examples/$1
git archive --format zip --output ./release/$1/$2/changed.zip $3:blog/examples/$1 $(git diff --name-only $3~1 $3 -- blog/examples/$1 | cut -d'/' -f4- )
