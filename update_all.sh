#!/bin/sh
#K.BALEM
#2017
################
cd bin/
#ARGO INDEX
wget ftp://ftp.ifremer.fr/ifremer/argo/ar_index_global_prof.txt
#wget ftp://usgodae.org/pub/outgoing/argo/ar_index_global_prof.txt
#
#### ARGO7
echo -n "argo 7 last days ... "
./argo_n.sh
#IF FILE EMPTY, ERROR
if [ `cat ../data/ARGO7.js | wc -l` -eq 2 ]
then
   echo "error" 
   exit 113
else
echo "ok"
fi
echo ""
#### ARGO30 DEEP
echo -n "argo 30 last days, deep only ..."
./argo_ndeep.sh
#IF FILE EMPTY, ERROR
if [ `cat ../data/ARGO30DEEP.js | wc -l` -eq 2 ]
then
   echo "error" 
   exit 113
else
echo "ok"
fi
echo ""
### AVISO CURRENTS
echo -n "aviso currents last file : "
#FIND LAST AVISO FILE
latest=`ls -1 /home5/pharos/REFERENCE_DATA/ALTIMETRY/DATA/NRT/dataset-duacs-nrt-global-merged-allsat-phy-l4-v3/*.nc | tail -4 | head -1`
echo $latest
#FuLL FILE
flatest=$latest #"/home5/pharos/REFERENCE_DATA/ALTIMETRY/DATA/NRT/dataset-duacs-nrt-global-merged-allsat-phy-l4-v3/$latest"
#DATE OF DATA
dlatest=`basename $latest | awk -F"_" '{print $6}'`
echo -n "... "
./aviso2json.sh $flatest
echo "ok"
echo ""
### ARGO DATE
echo -n "argo $dlatest ... "
./argo_pr.sh $dlatest
echo "ok"
#write date
echo "var WDate = \"$dlatest\";"  > ../data/WDate.js
#clear
rm ar_index_*
#cp to webspace
echo " "
echo "copy to triagoz web app..."
cp ../data/ARGO7.js /home/triagoz/webapp/kbalem/data
cp ../data/ARGO30DEEP.js /home/triagoz/webapp/kbalem/data
cp ../data/ARGO.js /home/triagoz/webapp/kbalem/data
cp ../data/WDate.js /home/triagoz/webapp/kbalem/data
cp ../data/aviso.json /home/triagoz/webapp/kbalem/data
