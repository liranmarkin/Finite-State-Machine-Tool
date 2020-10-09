function run_fsm(){
    compileFSM();
    execute_program();
}

$('#input').bind("input change", run_fsm);
$('#canvas').on('mouseup', run_fsm);
$(window).on("load", run_fsm)