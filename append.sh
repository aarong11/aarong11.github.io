#!/bin/bash

echo "___" > appended.txt
> appended.txt && find src -type f -exec sh -c 'echo "File: $1"; cat "$1"; echo -e "\n____\n"' _ {} \; >> appended.txt

for file in .babelrc package.json *.js *.json; do
  if [ -f "$file" ]; then
    echo "File: $file" >> appended.txt
    cat "$file" >> appended.txt
    echo -e "\n____\n" >> appended.txt
  fi
done