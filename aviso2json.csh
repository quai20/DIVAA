#!/bin/sh
#K.BALEM
#2017
################
python aviso2json.py $1 > temp
sed -i 's/masked/0.0/g' temp
cat temp | json_reformat > data/aviso_mdt.json

rm temp
