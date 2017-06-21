#!/bin/sh
#K.BALEM
#2017
################
cd bin/
#ARGO INDEX
#wget ftp://ftp.ifremer.fr/ifremer/argo/ar_index_global_prof.txt
wget ftp://ftp.ifremer.fr/ifremer/argo/ar_index_this_week_prof.txt
#
#### ARGO7
echo -n "argo 7 last days ... "
./argo_n.csh
echo "ok"
echo ""
### AVISO CURRENTS
echo -n "aviso currents last file : "
#FIND LAST AVISO FILE
latest=`ls -1 /home5/pharos/REFERENCE_DATA/ALTIMETRY/DATA/NRT/madt/all-sat-merged/uv/ | tail -2 | head -1`
echo $latest
#FuLL FILE
flatest="/home5/pharos/REFERENCE_DATA/ALTIMETRY/DATA/NRT/madt/all-sat-merged/uv/$latest"
#DATE OF DATA
dlatest=`echo $latest | awk -F"_" '{print $6}'`
echo -n "... "
./aviso2json.csh $flatest
echo "ok"
echo ""
### ARGO DATE
echo -n "argo $dlatest ... "
./argo_pr.csh $dlatest
echo "ok"
#write date
echo "var WDate = \"$dlatest\";"  > ../data/WDate.js
#clear
rm ar_index_this_week_prof.txt
