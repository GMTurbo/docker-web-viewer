#!/bin/bash

cd site/images && mkdir thumbs

for f in *.jpg *.JPG *.png; do convert -thumbnail 150 $f thumbs/$f ; done

cd -

rm -f site/images/*_original

node api_secure.js &

while true; do tail logs/web_viewer*.log; sleep 10; done
