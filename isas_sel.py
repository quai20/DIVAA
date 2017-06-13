#READING
from netCDF4 import Dataset
import numpy as np

my_nc_file = '/home/lpo4/ISAS_LPO/ANA_ISAS13/field/2012/ISAS13_20120615_fld_TEMP.nc'
fh = Dataset(my_nc_file, mode='r')

LON=fh.variables['longitude'][:]
LAT=fh.variables['latitude'][:]
TEMP=fh.variables['TEMP'][:]
TEMP=TEMP[0,0,:,:]
fh.close()

print "isas_data ="
print "["
for i in range(0, len(LON)-1, 2):
    for j in range(0, len(LAT)-2, 2):
        #data=np.vstack([data,[LAT[j],LON[i],TEMP[j,i]]])
        print "["+str(LAT[j])+", "+str(LON[i])+", "+str(TEMP[j,i])+"],"
print "["+str(LAT[len(LAT)-1])+", "+str(LON[len(LON)-1])+", "+str(TEMP[len(LAT)-1,len(LON)-1])+"]" #write last line without comma
print "];"
