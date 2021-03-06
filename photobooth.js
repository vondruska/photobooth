var io = require('socket.io');
var express = require('express');
var app = express();
var server = require('http').createServer(app)
  , io = io.listen(server);


// attempt to spawn the ruby button process
// makes for automated start up
var spawn = require('child_process').spawn,
    ruby    = spawn('ruby', [__dirname + '/ruby/button.rb']);

ruby.on('error', function(err) {
  console.warn("Something went wrong while trying to spin up the ruby process. The button probably won't work.", err);
});

// output things from the ruby process, mostly so we can keep track of things as they happen
ruby.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});

ruby.stderr.on('data', function (data) {
  console.log('stderr: ' + data);
});

// let the world know it quit!
ruby.on('exit', function (code) {
  console.log('child process exited with code ' + code);
});


// start listening
server.listen(8080);

app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true,
  limit: '50mb'
}));

// display the UI to the browser
app.get('/', function(req,res) {
  res.sendfile('public/index.html');
});


// someone has pushed the button per the ruby script!
// in turn tells the photobooth UI in the browser to start the picture countdown
app.get('/buttonpush', function(req,res) {
  io.sockets.emit('photobooth', { take: 'picture' });
  res.status(200).send("OK");  // tell the ruby script things are okay
});

// the browser/flash script would like us to save a photo
app.post('/upload', function(req,res) {
	console.log('taking picture');
  var img = req.body.image;  // the flash uploader uses the param "image"
  img = img.replace('data:image/png;base64,', '');
	var decodedImage = new Buffer(img, 'base64'); // the image comes over base64 encoded, so we need to decode it
	var fs = require("fs");
	var ts = Date.now() / 1000;
  fs.writeFile(__dirname + '/photos/'+ts+'.png', decodedImage, function(err) {
    if(err) {
    console.error('something went wrong while saving the photo!!!', err);
    }
  }); // save the photo using the timestamp


  res.status(200).send("OK");  // tell the flash uploader we're a-ok
});	

process.on('exit', function () {
	console.info('shutting down');
	ruby.kill('SIGHUP');  // attempt to end the ruby process so we don't have random ruby processes sucking up the world
});
