import numpy as np
from netCDF4 import Dataset
import os,sys

my_nc_file = sys.argv[1]
fh = Dataset(my_nc_file, mode='r')

LON=fh.variables['lon'][:]
LAT=fh.variables['lat'][:]
UC=fh.variables['u'][:]
VC=fh.variables['v'][:]
fh.close()

lo1=0
lo2=360
nx=1440
la1=90
la2=-90
ny=720

evelf=[]
nvelf=[]
for i in range(ny) :
    for j in range (nx) :
        evelf.append(UC[0,ny-(i+1),j])
        nvelf.append(VC[0,ny-(i+1),j])

#evelf=np.array(evelf)
#nvelf=np.array(nvelf)

#HEAD 1
print '[{'
print '"header":{'
print '"parameterUnit" : "m.s-1",'
print '"parameterNumber" : 2,'
print '"dx" : 0.25,'
print '"dy" : 0.25,'
print '"parameterNumberName" : "eastward velocity",'
print '"la1" : '+str(la1)+','
print '"lo1" : '+str(lo1)+','
print '"la2" : '+str(la2)+','
print '"lo2" : '+str(lo2)+','
print '"nx" : '+str(nx)+','
print '"ny" : '+str(ny)+','
print '"reftime" : "today",'
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
print '"dx" : 0.25,'
print '"dy" : 0.25,'
print '"parameterNumberName" : "northward velocity",'
print '"la1" : '+str(la1)+','
print '"lo1" : '+str(lo1)+','
print '"la2" : '+str(la2)+','
print '"lo2" : '+str(lo2)+','
print '"nx" : '+str(nx)+','
print '"ny" : '+str(ny)+','
print '"reftime" : "today",'
print '"parameterCategory" : 2'
print '},'
#DATA 1
print '"data":'
print nvelf
print '}]'
