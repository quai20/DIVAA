#!/bin/sh
#K.BALEM
#2017
################
wget ftp://ftp.ifremer.fr/ifremer/argo/ar_index_this_week_prof.txt
LA='ar_index_this_week_prof.txt'
################
#repertoire temporaire unique
tempdir="temp_"`date +%H%M%S`
mkdir $tempdir
#
DATE='.nc,'$1 #CLAIREMENT PAS TOP
echo $DATE
NAME='ARGO'
echo -n $BIGR ':' $NAME '...'
outf=$NAME.js
outf2=WDate.js
###### GLOBAL ########
#Selection du type de données dans le fichier source
grep "/profiles/" $LA | grep -E $DATE > $tempdir/temp1

#On recupere lat,lon, le nom de la platform, date de la data, institution
awk -F"," '{print $3","$4","substr($1,match($1,"/profiles/")-7,7)","$2","$7}' $tempdir/temp1 > $tempdir/temp2
#On trie fonction du temps
sort $tempdir/temp2 -k4 -t, > $tempdir/temp3
#On commence le .js
echo "var Data_$NAME = [" > $outf
#On vire les quotes
sed -i 's/"//g' $tempdir/temp3
#On construit les variables .js (la dernière ligne peut contenir une virgule c'est pas génant)
awk -v SELEC=$NAME -F"," '{
printf("{\"latitude\":%f,\"longitude\":%f,\"mtype\":\"%s\",\"Platform\":\"%s\",\"Institution\":\"%s\",\"Time\":\"%s\"}, \n",$1,$2,SELEC,$3,$5,$4)
}' $tempdir/temp3 >> $outf
#fermeture du .js
echo "];" >> $outf
#write date
echo "var WDate = \"$1\";"  >> $outf2
#supression du repertoire temporaire
rm -r $tempdir
#move to final destination
mv $outf data/
mv $outf2 data/
echo 'ok'
#remove index file
rm $LA
