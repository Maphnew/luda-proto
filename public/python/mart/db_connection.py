#!/usr/bin/env python3

# 라이브러리 사용
import pymysql
import math
import os
import pandas as pd
import csv
import numpy as np
from numpy import array
from matplotlib import pyplot as plt
# df to db
from sqlalchemy import create_engine
from sqlalchemy import event
from sqlalchemy.dialects.mysql import DATETIME
from sqlalchemy.dialects.mysql import TIME
pymysql.install_as_MySQLdb()
import MySQLdb

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
    print(sql_query)
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
    df = pd.DataFrame(list_for_data)
#     df = pd.DataFrame(list_for_data).fillna(0)
    df.columns=['DataSavedTime', col_name]
    print(df.head())    
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