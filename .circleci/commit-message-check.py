#!/usr/bin/python3

import json
import os
import re
import subprocess
import sys

def normalizeVersion(v):
  return [int(x) for x in re.sub(r'(\.0+)*$','', v).split(".")]

def commit_msg_has_tag(commit_msg, tag):
  res = re.search('^\[' + tag + '\]', commit_msg, re.MULTILINE)
  return res != None

def check_release_commit(commit_msg):
  currentJson = json.load(open('package.json', 'r'))
  currentVersion = currentJson['version']
  if re.match('^release ' + re.escape(currentVersion) + '\n\nSigned-off-by: .+\n$', commit_msg) == None:
    print('No release commit detected')
    return

  prevJson = json.loads(subprocess.run(['git', 'show', os.environ['CIRCLE_SHA1'] + ':package.json'], stdout=subprocess.PIPE).stdout.decode("utf-8"))
  prevVersion = prevJson['version']
  if normalizeVersion(currentVersion) < normalizeVersion(prevVersion):
    print('Current version (' + currentVersion + ') should be grather than previous one (' + prevVersion + ')')
    sys.exit(1)
  sys.exit(0)

def check_missing_tags(commit_msg):
  missing_tags = [tag for tag in ['Issue', 'Problem', 'Solution'] if not commit_msg_has_tag(commit_msg, tag)]
  no_signoff = re.search('\n\nSigned-off-by: .+\n$', commit_msg) == None
  if missing_tags:
    for tag in missing_tags:
      print('No [' + tag + '] specified')
  if no_signoff:
    print('Signoff missing')
  if missing_tags or no_signoff:
    sys.exit(1)

def main():
  commit_msg = subprocess.run(['git', 'log', '--format=%B', '-n', '1', os.environ['CIRCLE_SHA1']], stdout=subprocess.PIPE).stdout.decode("utf-8")
  check_release_commit(commit_msg)
  check_missing_tags(commit_msg)

if __name__ == "__main__":
  main()