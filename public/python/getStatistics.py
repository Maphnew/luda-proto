#!/usr/bin/env python3
import mart.db_connection as db_connection
import json
import sys
import numpy as np

indexDate = sys.argv[1]
indexNum = sys.argv[2]
parts = sys.argv[3]

print(indexDate)
print(indexNum)
print(parts)

startTime = ''
stopTime = ''
index_date = ''
index_num = ''

data_db_info = {
   "host" : "192.168.101.50",   
   "port" : 16033,   
   "user" : "root",   
   "password" : "its@1234" ,   
   "database" : "UYeG_Cloud",  
}

# defServer, defTable , defColumn = db_connection.getDefThings(data_db_info, index_date, index_num)

# _server_name = defServer
# _table_name = defTable
# _col_name = defColumn

# _start_date = startTime[:10]
# _end_date = stopTime[:10]
# _start_t = startTime[10:]
# _end_t = stopTime[10:]
# # print(_start_date, _start_t)
# # print(_end_date, _end_t)
# ###########################################

# df = db_connection.rawSelect(
#        host = data_db_info["host"],   
#        port = data_db_info["port"],   
#        user = data_db_info["user"],   
#        password = data_db_info["password"] ,   
#        database = data_db_info["database"],  

#        server_name = _server_name,   
#        table_name = _table_name,     
#        col_name = _col_name, 

#        start_date = _start_date, 
#        end_date = _end_date, 
#        start_t = _start_t, 
#        end_t = _end_t, 
#     )

# # print(df)


# max_value = max(list(df[_col_name]))
# average_value = float(round(np.mean(list(df[_col_name])), 2))
# area_value = round(sum(list(df[_col_name])), 2)
# median_value = round(float(np.median(list(df[_col_name]))), 2)

# features = {
#     'max': max_value,
#     'average': average_value,
#     'area': area_value,
#     'median': median_value
# }
# f = json.dumps(features)

# print(features)