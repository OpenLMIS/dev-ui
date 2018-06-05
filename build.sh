#!/bin/sh

# Update everything (just in case)
npm rebuild
npm install --no-optional

# Built and test
if [ -z "$GIT_BRANCH" ] || [ "$GIT_BRANCH" = "master" ]; then
  grunt --production --pullTransifex --pushTransifex
else
  grunt --production --pullTransifex
fi
