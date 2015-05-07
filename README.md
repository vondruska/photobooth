photobooth
==========

The code that ran the photobooth at my wedding.

The UI was run completely in a web browser. It used jQuery and jQuery Webcam which allowed me to hook into Flash to use the webcam. On the server side, it was a simple node.js application that listened for a external button push to notify the web browser to start the picture taking sequence and then save a taken picture to the local hard drive.

To trigger the picture taking, I used a [Dream Cheeky Big Red Button](http://dreamcheeky.com/big-red-button). A ruby script ran all the time listening for the button push using the [`dream_cheeky` Ruby Gem](https://github.com/derrick/dream_cheeky). On the button push, the ruby script sent an HTTP request to the node.js application. The node.js application in turn used socket.io via WebSockets to notify the web browser to begin the picture sequence.

Once the web browser captured the picture, it was POST'ed back to node.js which it saved the data to the hard drive and the web browser reset for the next picture.