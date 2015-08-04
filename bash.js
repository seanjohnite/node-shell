var command = require('./commands.js');

// Output a prompt
process.stdout.write('prompt > ');

// The stdin 'data' event fires after a user types in a line
process.stdin.on('data', function(data) {
  var cmdString = data.toString().trim(); // remove the newline
  command.cmdList = cmdString.split(/\s*\|\s*/g);
  runCommand(command.cmdList.shift());


});

var runCommand = function(cmd, stdin){
  var cmdArray = cmd.split(" ");
  cmd = cmdArray.shift();
  cmdArray.unshift(done);
  cmdArray.unshift(stdin);


  if(command[cmd]) command[cmd].apply(this, cmdArray);
  else process.stdout.write(cmd + ' is not valid \nprompt > ');
  
}

var done = function(output){
  if(command.cmdList.length !== 0) runCommand(command.cmdList.shift(), output);
  else process.stdout.write(output + '\nprompt > ');
}