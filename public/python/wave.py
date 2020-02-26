#!/usr/bin/env python

from mart import wave_indexing 
from mart import db_connection

data_db_info = {
       'host' : '192.168.101.80',   
       'port' : 16033,   
       'user' : 'root',   
       'password' : 'its@1234' ,   
       'database' : 'UYeG_Cloud',  
}

index_db_info = {
       'host' : '192.168.100.225',   
       'port' : 3306,   
       'user' : 'root',   
       'password' : 'its@1234' ,   
       'database' : 'test',
}

df = rawSelect(
    host = data_db_info['host'],   
    port = data_db_info['port'],   
    user = data_db_info['user'],   
    password = data_db_info['password'] ,   
    database = data_db_info['database'],  
    
    server_name = 'S1',   
    table_name = 'HisItemCurr',     
    col_name = 'Item005', 
        
    start_date = '2019-12-20', 
    end_date = '2019-12-20', 
    start_t = '08:00:00', 
    end_t = '08:59:59', 
)

result_index, result_queue = get_index_endcount(list(df['Item005']), 10)

result_df = index_waves(df, result_index, '2019-12-19', 'S1', 'HisItemCurr', 'Item005')
print('result:', result_df)
