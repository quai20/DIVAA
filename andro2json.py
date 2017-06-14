import numpy as np
from scipy.interpolate import griddata
import matplotlib.pyplot as plt

date=[]
lati=[]
longi=[]
evel=[]
nvel=[]
datemin=0000 #DAYS SINCE 01/01/2000-00:00:00
datemax=6000 #to be sure we take all
mfile='/home5/pharos/REFERENCE_DATA/ANDRO/DATA/andro_last'
with open(mfile) as f:
    for line in f:
        data = line.split()
        date=float(data[5])
        if date > datemin :
            if date < datemax :
                lati.append(float(data[1]))
                longi.append(float(data[0]))
                evel.append(float(data[6]))
                nvel.append(float(data[7]))

lo1=-30
lo2=10
nx=40
la1=40
la2=60
ny=20

#IL FAUT INTERPOLER SUR LA GRILLE OCEAN evel et nvel

# !!!! LES 1ERES VALEURS DOIVENT ETRE CELLES EN HAUT A GAUCHE POUR LEAFLET-VELOCITY
evelf = []
nvelf = []
for i in range(evelv.shape[0]) :
    for j in range(evelv.shape[1]) :
        evelf.append(evelv[i,evelv.shape[1]-j-1])
        nvelf.append(nvelv[i,nvelv.shape[1]-j-1])
#HEAD 1
print '[{'
print '"header":{'
print '"parameterUnit" : "m.s-1",'
print '"parameterNumber" : 2,'
print '"dx" : '+str((lo2-lo1+1)/nx)+','
print '"dy" : '+str((la2-la1+1)/ny)+','
print '"parameterNumberName" : "eastward velocity",'
print '"la1" : '+str(la2)+','
print '"lo1" : '+str(lo1)+','
print '"la2" : '+str(la1)+','
print '"lo2" : '+str(lo2)+','
print '"nx" : '+str(nx)+','
print '"ny" : '+str(ny)+','
print '"reftime" : "2010-01-01 00:00:00",'
print '"parameterCategory" : 2'
print '},'
#DATA 1
print '"data":'
print evelf
print '},'
#HEAD 2
print '{'
print '"header":{'
print '"parameterUnit" : "m.s-1",'
print '"parameterNumber" : 3,'
print '"dx" : '+str((lo2-lo1+1)/nx)+','
print '"dy" : '+str((la2-la1+1)/ny)+','
print '"parameterNumberName" : "northward velocity",'
print '"la1" : '+str(la2)+','
print '"lo1" : '+str(lo1)+','
print '"la2" : '+str(la1)+','
print '"lo2" : '+str(lo2)+','
print '"nx" : '+str(nx)+','
print '"ny" : '+str(ny)+','
print '"reftime" : "2010-01-01 00:00:00",'
print '"parameterCategory" : 2'
print '},'
#DATA 1
print '"data":'
print nvelf
print '}]'
