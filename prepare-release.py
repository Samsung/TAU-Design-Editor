#!/usr/bin/python3

import collections
import json
import subprocess

def main():
  packageJson = json.load(open('package.json', 'r'), object_pairs_hook=collections.OrderedDict)
  currentVersion = packageJson['version']
  verNums = currentVersion.split('.')
  verNums[-1] = str(int(verNums[-1])+1)
  packageJson['version'] = '.'.join(verNums)
  with open('package.json', 'w') as outfile:
    json.dump(packageJson, outfile, indent=2)
    outfile.write('\n')

  subprocess.run(['git', 'add', 'package.json'])
  subprocess.run(['git', 'commit', '-m', 'release ' + packageJson['version']])

if __name__ == "__main__":
  main()

