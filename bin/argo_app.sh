#!/bin/sh
#MIT License
#Copyright (c) 2020 K.BALEM
################
for dys in 1 2 3 4 5 6 7 8 9 10
do

year=`date --date="$dys days ago" +"%Y"`
month=`date --date="$dys days ago" +"%m"`
day=`date --date="$dys days ago" +"%d"`

urll="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?platform_number%2Cpi_name%2Ccycle_number%2Cplatform_type%2Ctime%2Clatitude%2Clongitude&time%3E=${year}-${month}-${day}T00%3A00%3A00Z&time%3C=${year}-${month}-${day}T23%3A59%3A59Z"

echo $urll

curl -g $urll -o ../data/json/"$year-$month-$day.json"

done


#WMO LIST
LA='ar_index_global_prof.txt'
yesterday=`date --date="0 days ago" +"%Y%m%d"`
#echo $yesterday

echo '{"wmolist" : [' > ../data/json/wmolist.json
awk -F',' -v YE=$yesterday '{if(($2<YE"000000")&&(NR>8)) print $1}' $LA | awk -F"/" '{print "\""$2"\","}' | sort | uniq >> ../data/json/wmolist.json
echo '"0"' >> ../data/json/wmolist.json
echo ']}' >> ../data/json/wmolist.json
