#!/bin/sh

# Update everything (just in case)
npm rebuild
npm install --no-optional

TX_PUSH=${TRANSIFEX_PUSH:-true}
TX_PULL=${TRANSIFEX_PULL:-true}

# Built and test
if [ "$TX_PUSH" = "true" ]; then
  grunt --production --pullTransifex --pushTransifex
elif [ "$TX_PULL" = "true" ]; then
  grunt --production --pullTransifex
else
  grunt --production
fi
