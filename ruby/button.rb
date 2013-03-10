require 'rubygems'
require 'dream_cheeky'

DreamCheeky::BigRedButton.run do

  # on a button push, let's tell the node-js system about it!
  push do
    `curl http://localhost:8080/buttonpush`
  end
end
