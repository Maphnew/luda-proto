const featurePost =  async (data,feature) => {    
    const params =  Object.assign(data,feature)
    const postJson = await fetch("http://192.168.100.175:5000/features/feature", {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept' : '*/*'
        },
        body : JSON.stringify(params)
    })
    //.then(response => console.log(response))
    .then(response => response.json())
    .then((json) => {          
        const moment = require('moment') 
        const requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';        

        if (feature.table === "WaveIndex"){                    
            JSON.stringify(json.map(function (record)  {           
                record.index_date = moment(record.index_date).format('YYYY-MM-DD');               
                record.startTime = moment(record.startTime).format(requiredPattern);
                record.stopTime = moment(record.stopTime).format(requiredPattern);   
                return record;
            }));
            return json            
        }
        else {                   
            var tempJson = {}
            //console.log(json)
            JSON.stringify(json.map(function (record)  {  
                Object.entries(record.parts).map(([key,value])=>{                            
                    if (tempJson[key]===undefined){
                        tempJson[key] = []
                    }
                    tempJson[key].push(value)        
                    return key                                
                  }) 
                  return record;    
            }));       
            console.log(tempJson)        
            return tempJson                  
        }      
        
    })
    .catch(err => {
        console.log(err)

    })  
    return postJson
}

const featureGet =  async (data) => {
    const statisticsJson = await fetch("http://192.168.100.175:5000/features/feature/statistics", {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept' : '*/*'
        },
        body : JSON.stringify(data)
    })
    //.then(response => console.log(response))
    .then(response => response.json())
    .then((json) => { 
        return json
    })
    .catch(err => {
        console.log(err)
    });      

    const labelsJson = await fetch("http://192.168.100.175:5000/features/feature/labels", {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept' : '*/*'
        },
        body : JSON.stringify(data)
    })
    //.then(response => console.log(response))
    .then(response => response.json())
    .then((json) => { 
        return json
    })
    .catch(err => {
        console.log(err)
    });      

    return [statisticsJson,labelsJson]
}

const labelPost =  async (data,feature) => {    
    const params =  Object.assign(data,feature)
    // console.log(params)
    const postJson = await fetch("http://192.168.100.175:5000/features/feature/labeldata", {
        method: 'POST', 
        headers: { 
            'Content-Type': 'application/json',
            'Accept' : '*/*'
        },
        body : JSON.stringify(params)
    })
    //.then(response => console.log(response))
    .then(response => response.json())
    .then((json) => {          
        if (data.table === "WaveIndex"){
            const moment = require('moment') 
            const requiredPattern = 'YYYY-MM-DD HH:mm:ss.SSS';      
            JSON.stringify(json.map(function (record)  {
                record.index_date = moment(record.index_date).format('YYYY-MM-DD');    
                record.startTime = moment(record.startTime).format(requiredPattern);   
                record.stopTime = moment(record.stopTime).format(requiredPattern);  
                // var val = featureData.find((item, idx) => {
                //     return item.index_date ===  record.index_date && item.index_num ===  record.index_num
                // })              
                // val["labels"] = record.labels
                return record;
            }));
            return json     
        }
        else {
            var tempJson = {}
            //console.log(json)
            JSON.stringify(json.map(function (record)  {  
                Object.entries(record.parts).map(([key,value])=>{                            
                    if (tempJson[key]===undefined){
                        tempJson[key] = []
                    }
                    value["labels"]=record.labels
                    tempJson[key].push(value)        
                    return key                                
                  }) 
                  return record;    
            }));       
            //console.log(tempJson)        
            return tempJson            
        }
    })
    .catch(err => {
        console.log(err)

    })  
    //console.log(postJson)
    return postJson
}

export {featurePost,featureGet, labelPost};



