var fs = require('fs');
var request = require('request');

module.exports = {
	'pwd' : function(stdIn, done){
		done(global.process.env.PWD);
  	},
	'date' : function(stdIn, done){
  		done(new Date().toString());

  	},
	'ls': function(stdIn, done){ 
		fs.readdir('.', function(err, files) {
			if (err) throw err;
			var output = "";
			files.forEach(function(file) {
				output += file.toString() + "\n";
			});
			done(output);
		});

	},
	'echo' : function(stdIn, done, file){
  		if(file) done(file);
  		else done('\n');
	},
	'cat' : function(stdIn, done) {
		var args = Array.prototype.slice.call(arguments, 2);
		var stringQueue = {};
		args.forEach(function(file) {
			if (file) {
  			fs.readFile(file, function(err, data) {
  				if (err) throw err;
  				stringQueue[file] = data.toString() + '\n';
  				if (Object.keys(stringQueue).length === args.length)
  					whenFinished();
  			});
			}
		});
		var whenFinished = function () {
			var output = args.reduce(function (mem, file) {
				return mem + stringQueue[file];
			}, "");

			done(output);
		};
	},
	'head' : function(stdIn, done, file) {
    var getHead = function(data){
      return data.toString().split('\n').slice(0, 5).join('\n');
    }
    if(stdIn) done(getHead(stdIn));
    else{
  		fs.readFile(file, function(err, data) {
  			if (err) throw err;
  			var output = getHead(data);
  			done(output);
  		});
    }

	},
	'tail' : function(stdIn, done, file) {
    var getTail = function(data){
      return data.toString().split('\n').slice(-5).join('\n');
    }
    if(stdIn) done(getTail(stdIn));
    else {
      fs.readFile(file, function(err, data) {
        if (err) throw err;
        var output = getTail(data);
        done(output);
      });
    }
  },
	'sort' : function(stdIn, done, file) {
    var sort = function(data){
      return data.toString().split('\n').sort().join('\n');
    }
    if(stdIn) done(sort(stdIn));
    else {
      fs.readFile(file, function(err, data) {
        if (err) throw err;
        var output = sort(data);
        done(output);
      });
    }
	},
	'wc' : function(stdIn, done, file) {
		var wcThis = function(data){
      return data.toString().split('\n').length.toString();
    }
    if (stdIn) done(wcThis(stdIn));
    else {
      fs.readFile(file, function(err, data) {
        if (err) throw err;
        var output = wcThis(data);
        done(output);
      });
    }
	},
	'uniq' : function(stdIn, done, file) {
    var uniqIt = function(data){
      var output = "";
      data.toString().split('\n').forEach(function(line) {
        if (prevLine !== line) output += (line + '\n');
        prevLine = line;
      })
      return output;
    }
    if(stdIn) done(uniqIt(stdIn));
    else {
      fs.readFile(file, function(err, data) {
        if (err) throw err;
        var output = uniqIt(data);
        done(output);
      });
    }
  },
	'curl' : function(stdIn, done, url){
		request(url, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    done(body); // Show the HTML for the Google homepage.

	  }
		  if (error) throw error;
		})
	},
	'grep' : function(stdIn, done, matchString){
    if (!stdIn) done("Nothing provided to grep");
    else {

      var output = stdIn.split('\n').reduce(function(mem, line) {
        if (line.search(matchString) !== -1) {
          return mem + line + "\n"
        }
        return mem;
      }, "");
      done(output);
    }


	}
	

}























