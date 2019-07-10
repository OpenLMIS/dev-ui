#!/bin/sh

# Update everything (just in case)
npm rebuild
npm install

TX_PUSH=${TRANSIFEX_PUSH:-true}
TX_PULL=${TRANSIFEX_PULL:-true}

# Built and test
if [ "$TX_PUSH" = "true" ]; then
  grunt --production=false --pullTransifex --pushTransifex
elif [ "$TX_PULL" = "true" ]; then
  grunt --production=false --pullTransifex
else
  grunt --production=false
fi
