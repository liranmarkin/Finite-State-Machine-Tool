var fin,input,output,input_ind,OP_GOTO,OP_PRINT,OP_ON,op_map,ip,code,labels;
function kill(){
    $('#output').val(output);
    throw new Error('This is not an error. This is just to abort javascript');
}
function send_error(err){
    console.log("ERROR: "+err);
    output = err;
    kill();
}

function get_input(){
    if(input_ind >= input.length){
        kill();
    }
    return input[input_ind];
}

function print(str){
    console.log(str);
    output = str;
}

function execute_step(){
    if(ip >= code.length)
        return false;
    var op_code = code[ip].op_code,parm1 = code[ip].parm1, parm2 = code[ip].parm2;
    var jumped = false;
    if(op_code == OP_PRINT){
        print(parm1);
    }
    else if(op_code == OP_GOTO){
        ip = parm1;
        jumped = true;
    }
    else if(op_code == OP_ON){
        if(get_input() == parm1){
            ip = parm2;
            jumped = true;
        }
    }
    if(jumped == false) {
        ip++;
    }
    else{
        input_ind++;
    }
    return true;
}

function preprocess() {
    for(var line_num=0;line_num<fin.length;line_num++) {
        var line=fin[line_num];
        if(line == "")
            continue;
        //label declaration
        if (line.slice(-1) == ":") {
            var label = line.substr(0, line.length - 1);
            if (labels[label] != undefined) {
                send_error("Label " + label + " declared twice");
            }
            else {
                labels[label] = code.length;
            }
        }
        //action
        else {
            console.log(line);
            var act = line.split(' ');
            if (op_map[act[0]] == undefined) {
                console.log(act);
                send_error("Action " + act[0] + " is not in dictionary");
            }
            else {
                code.push({
                    op_code: op_map[act[0]],
                    parm1: act[1],
                    parm2: act[2]
                });
            }
        }
    }
    //convert labels to line numbers
    for(var i = 0;i<code.length;i++){
        if(code[i].op_code == OP_ON){
            if(labels[code[i].parm2] == undefined){
                send_error("No declaration for label "+code[i].parm2);
            }
            else{
                code[i].parm2 = labels[code[i].parm2];
            }
            if(code[i].parm1.length > 1){
                send_error(code[i].parm1 + " is more than one character");
            }
        }
        else if(code[i].op_code == OP_GOTO){
            if(labels[code[i].parm1] == undefined){
                send_error("No declaration for label "+code[i].parm1);
            }
            else{
                code[i].parm1 = labels[code[i].parm1];
            }
        }
    }
}
//run the program
function execute_program() {
    fin = $('#code').val().split('\n');
    input = $('#input').val();
    output = "";
    input_ind = 0;
    console.log(fin);
    OP_GOTO = 0;
    OP_PRINT = 1;
    OP_ON = 2;
    op_map = {
        goto: OP_GOTO,
        print: OP_PRINT,
        on: OP_ON,
        GOTO: OP_GOTO,
        PRINT: OP_PRINT,
        ON: OP_ON
    };
    ip = 0; //instruction_pointer
    code = [];
    labels = [];
    var operations = 0;
    preprocess();
    while (execute_step()) {
        operations++;
        if(operations >= 1000)
        kill();
    }
    kill();
}