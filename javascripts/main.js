console.log('This would be the main JS file.');
$('#code').bind("input change",function(){
    execute_program();
    console.log("changed");
});
$('#input').bind("input change",function(){
    execute_program();
    console.log("changed");
});