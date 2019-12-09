#!/bin/sh
#MIT License
#Copyright (c) 2019 K.BALEM
################
python aviso2json.py $1 > temp
sed -i 's/masked/0.0/g' temp
cat temp | json_reformat > ../data/aviso.json

#rm temp
