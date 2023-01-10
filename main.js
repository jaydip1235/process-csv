const csv = require('csvtojson');
const fs = require('fs');
const json2csv = require('json2csv').parse;

csv()
  .fromFile('selected.csv')
  .then((jsonObj) => {
   
    let finalData = [];
    for(let i=0;i<jsonObj.length;i++) {
        let user={};
        for (const [key, value] of Object.entries(jsonObj[i])) {
            if(key=="email"){
                user.email = value;
            }else{
               
                if(value==""){
                    user[key]="Not attempted";
                    continue;
                }
                let best_score=0
                let best_runtime=Number.MAX_SAFE_INTEGER;
                let best_memory=Number.MAX_SAFE_INTEGER;
                let allsub = JSON.parse(value); // all submission for a question
                
                for(let j=0;j<allsub.length;j++) {
                    //  check whether output is empty
                if(allsub[j]["M"]["output"]["L"].length==0)continue;

                let targetArray = allsub[j]["M"]["output"]["L"]
                let score=0,runtime=0,memory=0;
                for (let l=0;l<targetArray.length;l++){
                    if(targetArray[l]["M"]["status"]["M"]["id"]["N"]=="3"){
                        memory+= parseInt(targetArray[l]["M"]["memory"]["N"]);
                        runtime+=parseFloat(targetArray[l]["M"]["time"]["S"]);
                        score+=1;
                    }
                   // console.log(JSON.stringify(targetArray[l]["M"]["status"]["M"]["id"]["N"]))
                }
                if(score==best_score){
                    best_score=Math.max(score,best_score);
                    best_runtime=Math.min(runtime.toFixed(2),best_runtime);
                    best_memory=Math.min(memory,best_memory);
            }
                else if(score>best_score){
                    best_score=Math.max(score,best_score);
                    best_runtime=runtime.toFixed(2)
                    best_memory=memory;
            }
        }
        if(best_score==0){
            best_runtime="NA";
            best_memory="NA";
        }
        let qobj={
            best_score:best_score,
            best_runtime:best_runtime,
            best_memory : best_memory
        };
        // user[key]=JSON.stringify(qobj);
         user[key]=qobj;
       // console.log(best_score+" "+best_runtime+" "+best_memory);
        }
}
    //console.log(JSON.stringify(user))
    finalData.push(user);
    }
    // console.log(finalData)
    const csv = json2csv(finalData);

    console.log(csv);

   

 fs.writeFileSync('output1.csv', csv);
  });

