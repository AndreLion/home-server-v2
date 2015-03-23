require('shelljs/global');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

console.log('Time: ',(new Date()).toLocaleString());

fs.readFile('/home/pi/home-server-v2/.gitinfo', function (err, data) {
    if (err) throw err;
    var decoder = new StringDecoder('utf8');
    var json = JSON.parse(decoder.write(data) || '{}');
    var latest_commit = exec('git ls-remote https://github.com/andrelion/home-server-v2 | grep HEAD').output.split('\t')[0];
    console.log('git repo latest_commit:',latest_commit);
    if(!json.latest_commit || json.latest_commit !== latest_commit){
        console.log('rebuild');
        rm('-rf','/home/pi/home-server');
        exec('git clone https://github.com/AndreLion/home-server',{async:true,silent:true},function(code,output){
            console.log(output);
            exec('forever stop 0',{async:true,silent:true},function(code,output){
                exec('forever start --minUptime 5000 --spinSleepTime 6000 -m 5 /home/pi/home-server/index.js',{async:true,silent:true},function(code,output){
                    console.log(output);
                    json.latest_commit = latest_commit;
                    fs.writeFile("/home/pi/home-server.json", JSON.stringify(json), function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("home-server.json updated.");
                        }
                    }); 
                });
            });
        });
    }else{
        console.log('no update');
    }
});
