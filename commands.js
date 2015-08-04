var fs = require('fs');
var request = require('request');

module.exports = {
	'pwd' : function(stdIn, done){
		done(global.process.env.PWD);
  	},
	'date' : function(stdIn, done){
  		done(new Date().toString());

  	},
	'ls': function(stdIn, done, dir){ 
		fs.readdir(dir || '.', function(err, files) {
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
    var texts = [];
    var count = 0;
    args.forEach(function (filename, index) {
      fs.readFile(filename, { encoding: 'utf8' }, function(err, text) {
        if (err) throw err;
        texts[index] = text;
        count++;
        if (count === args.length) {
          done(texts.join('\n'));
        }
      });
    });
		// var args = Array.prototype.slice.call(arguments, 2);
		// var stringQueue = [];
		// args.forEach(function(file, index) {
		// 	if (file) {
  // 			fs.readFile(file, function(err, data) {
  // 				if (err) throw err;
  // 				stringQueue[index] = data.toString() + '\n';
  // 				if (Object.keys(stringQueue).length === args.length)
  // 					whenFinished();
  // 			});
		// 	}
		// });
		// var whenFinished = function () {
		// 	var output = args.reduce(function (mem, file) {
		// 		return mem + stringQueue[file];
		// 	}, "");

		// 	done(output);
		// };
	},
	'head' : function(stdIn, done, file) {
    var getHead = function(data){
      return data.toString().split('\n').slice(0, 5).join('\n');
    };
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
    };
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
    };
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
    };
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
      });
      return output;
    };
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
		});
	},
	'grep' : function(stdIn, done, matchString){
    if (!stdIn) done("Nothing provided to grep");
    else {

      var output = stdIn.split('\n').reduce(function(mem, line) {
        if (line.search(matchString) !== -1) {
          return mem + line + "\n";
        }
        return mem;
      }, "");
      done(output);
    }


	},

  'find': function(stdIn, done, dir) {
    // var totalFiles = 0;
    // var output = [];
    // var getAllFiles = function (path) {
    //   var filenames = fs.readdirSync(path);
    //   filenames.forEach(function(file) {
    //     file = path + file;
    //     output.push(file);
    //     if (fs.lstatSync(file).isDirectory()) {
    //       getAllFiles(file + '/');
    //     }
    //   });
    // };
    // getAllFiles(dir + '/');
    // done(output.join('\n'));

    var output = "";  
    var totalFiles = 0;    

    var getAllFiles = function(dir, parentArray) {
      fs.readdir(dir || '.', function (err, files) {
        if (err) throw err;
        totalFiles += files.length;
        files.forEach(function (file, index) {
          fs.lstat(dir + file, function (err, stats) {
            if (err) throw err;
            output += dir + file + '\n';
            totalFiles--;
            if (stats.isDirectory()) {
              getAllFiles(dir + file + '/');
            }
            if (totalFiles === 0)
              done(output);
          });
        });
      });
    };
    getAllFiles(dir + '/');

    // var getAllFiles = function (dir) {

    //   fs.readdir(dir || '.', function(err, files) {
    //     totalFiles += files.length;
    //     if (err) throw err;
    //     var output = "";
    //     files.forEach(function(file) {
    //       console.log(totalFiles);
    //       fs.lstat(file, function (err, stats) {
    //         if (err) throw err;
    //         if (stats.isDirectory()) {
    //           filenameHolder.push(file);
    //           totalFiles--;
    //           getAllFiles(dir + file.toString());
    //         } else {
    //           filenameHolder.push(file);
    //           totalFiles--;
    //         }
    //         if (totalFiles == 0) {
    //           done(whenFinished(filenameHolder));
    //         }
    //       });
    //     });
    //   });
    // };

    // var whenFinished = function (filenameArray) {
    //   return filenameArray.reduce(function (mem, item) {
    //     return mem + item + '\n';
    //   }, "")
    // }

    // getAllFiles(dir);
  }
	

}























