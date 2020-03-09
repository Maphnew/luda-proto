#!/usr/bin/env python3.7
import mart.db_connection as db_connection
from scipy.stats import skew, kurtosis, iqr, trim_mean
import json
import sys
import numpy as np

startTime = sys.argv[1]
stopTime = sys.argv[2]
index_date = sys.argv[3]
index_num = sys.argv[4]
defServer = sys.argv[5]
defTable = sys.argv[6]
defColumn = sys.argv[7]

data_db_info = {
   "host" : "192.168.101.50",   
   "port" : 16033,   
   "user" : "root",   
   "password" : "its@1234" ,   
   "database" : "UYeG_Cloud",  
}

_server_name = defServer
_table_name = defTable
_col_name = defColumn

_start_date = startTime[:10]
_end_date = stopTime[:10]
_start_t = startTime[10:]
_end_t = stopTime[10:]
# print(_start_date, _start_t)
# print(_end_date, _end_t)
###########################################

df = db_connection.rawSelect(
       host = data_db_info["host"],   
       port = data_db_info["port"],   
       user = data_db_info["user"],   
       password = data_db_info["password"] ,   
       database = data_db_info["database"],  

       server_name = _server_name,   
       table_name = _table_name,     
       col_name = _col_name, 

       start_date = _start_date, 
       end_date = _end_date, 
       start_t = _start_t, 
       end_t = _end_t, 
    )

# print(df)

max_value = max(list(df[_col_name]))
average_value = float(round(np.mean(list(df[_col_name])), 2))
area_value = round(sum(list(df[_col_name])), 2)
median_value = round(float(np.median(list(df[_col_name]))), 2)
var_value = round( np.var(list(df[_col_name])), 2)
std_value = round( np.std(list(df[_col_name])), 2)
skew_value = round( skew(list(df[_col_name])), 2)
kurtosis_value = round( kurtosis(list(df[_col_name])), 2)
q1 = round( np.quantile(list(df[_col_name]), .25), 2)
q3 = round( np.quantile(list(df[_col_name]), .75), 2)
iqr_value = round( iqr(list(df[_col_name])), 2)
percentile10 = round( np.percentile(list(df[_col_name]), 10), 2)
percentile40 = round( np.percentile(list(df[_col_name]), 40), 2)
percentile60 = round( np.percentile(list(df[_col_name]), 60), 2)
percentile90 = round( np.percentile(list(df[_col_name]), 90), 2)
trim_mean10 = round( trim_mean(list(df[_col_name]), 0.1), 2)
trim_mean20 = round( trim_mean(list(df[_col_name]), 0.2), 2)

features = {
    'max': max_value,
    'average': average_value,
    'area': area_value,
    'median': median_value,
    'var': var_value,
    'std': std_value,
    'skew': skew_value,
    'kurtosis': kurtosis_value,
    'Q1': q1,
    'Q3': q3,
    'IQR': iqr_value,
    'percentile10': percentile10,
    'percentile40': percentile40,
    'percentile60': percentile60,
    'percentile90': percentile90,
    'trim_mean10': trim_mean10,
    'trim_mean20': trim_mean20
}
f = json.dumps(features)

print(f)