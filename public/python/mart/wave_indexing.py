#!/usr/bin/env python3

import pandas as pd
import pymysql
import math
import numpy as np
import matplotlib.pyplot as plt
import db_connection

def get_index_endcount(queue, endcount):
    result_index = []
    result_queue = []
    tmp = []
    tmp_queue = []
    
    len_queue = len(queue)
    listofzeros = [np.nan] * endcount
    new_queue = queue + listofzeros
    print('len_queue: ', len_queue)
    print('listofzeros: ', listofzeros)
    # print('queue: ', queue)
    # print('new_queue: ', new_queue)
    
    for i in range(len_queue):
        scanner = new_queue[:endcount]
        scanner = np.nan_to_num(scanner)
        sum_scanner = sum(scanner)
        e = new_queue.pop(0)
        # print('e: ',e, 'scanner: ', scanner, sum_scanner)
        if ~np.isnan(e) and sum_scanner != 0:
            tmp.append(i)
            tmp_queue.append(e)
        elif len(tmp)>0 and sum_scanner == 0:
            result_index.append(tmp)
            result_queue.append(tmp_queue)
            tmp = []
            tmp_queue = []
        else:
            continue
   
    return result_index, result_queue

def index_waves(df, index_list, index_date, defServer, defTable, defColumn):
    index_number = index_num(
                                       index_date = index_date,   
    )
    print('index_number: ', index_number)
    columns = ['index_date', 'index_num', 'defServer', 'defTable', 'defColumn','startTime','stopTime',
                   'length','timeTaken','basicFeatures','additionalFeatures']
    index_number_list = []
    startTime_list = []
    stopTime_list = []
    timeTaken_list = []
    length_list = []
    features_list = []
    
    index_len = len(index_list)
    
    for i in range(index_len):
        print('index_number:',index_number)
        
        a = index_list[i]
        
        stti = a[0]
        stpi = a[-1]
        
        tmp_df = df.iloc[stti:stpi+1].fillna(0)
        startTime = tmp_df['DataSavedTime'].iloc[0]
        stopTime = tmp_df['DataSavedTime'].iloc[-1]
        timeTaken = stopTime - startTime
        print(type(timeTaken))
        length = len(a)
        max_value = max(list(tmp_df[defColumn]))
        min_value = min(list(tmp_df[defColumn]))
        average_value = float(round(np.mean(list(tmp_df[defColumn])), 2))
        area_value = round(sum(list(tmp_df[defColumn])), 2)
        median_value = round(float(np.median(list(tmp_df[defColumn]))), 2)
        
#         print(type(max_value))
#         print(type(min_value))
#         print(type(average_value))
#         print(type(area_value))
#         print(type(median_value))
        
        features = {
            'max': max_value,
            'min': min_value,
            'average': average_value,
            'area': area_value,
            'median': median_value
        }
        features = str(features)
        index_number_list.append(index_number)
        startTime_list.append(startTime)
        stopTime_list.append(stopTime)
        timeTaken_list.append(timeTaken)
        length_list.append(length)
        features_list.append(features)
        
        index_number += 1

    
    tmp_dict = {
        'index_date': [index_date]*index_len, 
        'index_num': index_number_list, 
        'defServer': [defServer]*index_len, 
        'defTable': [defTable]*index_len, 
        'defColumn': [defColumn]*index_len,
        'startTime': startTime_list,
        'stopTime': stopTime_list,
        'length': length_list,
        'timeTaken': timeTaken_list,
        'basicFeatures': features_list,
#         'additionalFeatures'
    }
    
    result_df = pd.DataFrame(data=tmp_dict, columns=columns)
    result_df['timeTaken'] = pd.to_datetime(result_df['timeTaken'], infer_datetime_format=True).dt.time
    
    return result_df