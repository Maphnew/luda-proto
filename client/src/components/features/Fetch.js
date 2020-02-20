const featurePost =  async (data,feature) => {
    const params =  Object.assign(data,feature)
    const postJson = await fetch("http://192.168.100.99:5000/features/feature", {
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

        if (feature.Table === "WaveIndex"){                    
            JSON.stringify(json.map(function (record)  {                      
                record.startTime = moment(record.startTime).format(requiredPattern);
                record.stopTime = moment(record.stopTime).format(requiredPattern);                          
                return record;
            }));
            return json            
        }
        else {                   
            var tempJson = {}
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
            return tempJson 
            //console.log(tempJson)        
        }      
        
    })
    .catch(err => {
        console.log(err)

    })  

    return postJson
}

const featureGet =  async (data) => {
    const GetJson = await fetch("http://192.168.100.99:5000/features/feature/statistics", {
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
    return GetJson
}

export {featurePost,featureGet};



