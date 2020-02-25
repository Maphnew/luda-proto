#!/usr/bin/env python3

# 라이브러리 사용
import pymysql
import os
import pandas as pd
from numpy import array
from string import Template

def rawSelect(
       host,   
       port,   
       user,   
       password,   
       database,  
       
       server_name,   
       table_name,     
       col_name, 
          
       start_date,      
       end_date,      
       start_t,    
       end_t,  
    ):
    
    sql_query = """ SELECT DataSavedTime, """ + col_name + """
    FROM """+table_name+"""
    WHERE DataSavedTime between '"""+start_date+' '+start_t+"""' and '"""+end_date+' '+end_t+"""'
    ORDER BY DataSavedTime ASC """
    # print(sql_query)
    conn = pymysql.connect(host=host, 
                           user=user,
                           password=password, 
                           database=database, 
                           charset='utf8',
                           port = port)
    curs = conn.cursor()
    curs.execute(sql_query)
    rows = curs.fetchall()
    list_for_data = list(rows)
    # print(type(list_for_data), 'list_for_data: ',list_for_data, 'length:',list_for_data)
    if len(list_for_data) == 0:
        return pd.DataFrame([])
    df = pd.DataFrame(list_for_data)
#     df = pd.DataFrame(list_for_data).fillna(0)
    df.columns=['DataSavedTime', col_name]
    # print(df.head())    
    conn.close()
    return df

def index_num(
               index_date,    # '2020-01-31'
):
    
    host = index_db_info['host']
    port = index_db_info['port']
    user = index_db_info['user']   
    password = index_db_info['password']   
    database = index_db_info['database']  
    
    sql_query = """
                    SELECT index_date, index_num 
                    FROM waveIndex
                    WHERE index_date = '"""+index_date+"""' 
                    ORDER BY startTime DESC
                    LIMIT 1;
    
    """
    print(sql_query)
    conn = pymysql.connect(host=host, 
                           user=user,
                           password=password, 
                           database=database, 
                           charset='utf8',
                           port = port)
    try:
        with conn.cursor(pymysql.cursors.DictCursor) as curs:
            curs.execute(sql_query)
            rows = curs.fetchall()
            print(rows)
            print(len(rows))
    finally:
        conn.close()
    
    if len(rows) == 0:
        return_index_number = 0
    else:
        return_index_number = rows[0]['index_num']
    
    return return_index_number+1

    # DF to DB
def df2db_save(
       dataframe,   
       host,   
       port,   
       user,   
       password,   
       database,   
):
    engine = create_engine("mysql+mysqldb://root:"+"its@1234"+"@192.168.100.225:3306/test", encoding='utf-8')
    conn = engine.connect()

    dataframe.to_sql(
        name='waveIndex', 
        con=engine, 
        dtype={
                'startTime': DATETIME(fsp=3),
                'stopTime': DATETIME(fsp=3),
                'timeTaken': TIME(fsp=3)
        }, 
        if_exists='replace', 
        index=False
    )
    conn.close()



def getDefThings(index_date, index_num):
    data_db_info = {
       'host' : '192.168.101.50',   
       'port' : 16033,   
       'user' : 'root',   
       'password' : 'its@1234' ,   
       'database' : 'UYeG_Cloud',  
    }

    query = """
        SELECT defServer, defTable, defColumn
        FROM WaveIndex
        WHERE index_date = '{index_date}' AND index_num = {index_num};
    """.format(index_date=index_date, index_num=index_num)
    # print(query)

    conn = pymysql.connect(
                                host = data_db_info['host'],   
                                port = data_db_info['port'],   
                                user = data_db_info['user'],   
                                password = data_db_info['password'] ,   
                                database = data_db_info['database'],  
                                charset='utf8',

    )
    curs = conn.cursor()
    curs.execute(query)
    rows = curs.fetchall()
    tuple_for_data = list(rows)[0]
    list_for_data = list(tuple_for_data)

    conn.close()
    
    return list_for_data