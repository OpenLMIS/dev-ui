#!/bin/sh

# install transifex cli in case of not installed yet
rm -f tx
curl -o- https://raw.githubusercontent.com/transifex/cli/master/install.sh | bash

# Update everything (just in case)
npm rebuild
npm install

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
