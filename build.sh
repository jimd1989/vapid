#!/bin/sh

path="'$PWD/src/vue.js';"
import="import Vue from $path"
tail -n+2 "src/items.ts" > "/tmp/tmp-items.ts"
echo $import > "src/items.ts"
cat "/tmp/tmp-items.ts" >> "src/items.ts"
rm "/tmp/tmp-items.ts"
cat "src/items.ts" > annealing.ts
cat "src/constraints-parsing.ts" >> annealing.ts
cat "src/constraints.ts" >> annealing.ts
cat "src/solving.ts" >> annealing.ts
cat "src/solving-parsing.ts" >> annealing.ts
cat "src/items-parsing.ts" >> annealing.ts
cat "src/constraints-groups-parsing.ts" >> annealing.ts
cat "src/save-load.ts" >> annealing.ts
cat "src/tips.ts" >> annealing.ts
cat "src/main-frontend.ts" >> annealing.ts
tsc --target ES6 --removeComments annealing.ts
rm annealing.ts
cat "src/vue.js" > new.js
sed 1d "annealing.js" >> new.js
mv new.js annealing.js
