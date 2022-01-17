import os
import json

dirname = os.path.dirname(__file__)
basepath = os.path.join(dirname, '../screenshots/')

jsonpath = os.path.join(dirname, 'flaky-tests.json')

listtest = []

def function(path):
    for item in os.listdir(path):
        if item.endswith('.png'):
            testname = item.split('--')[1].split('(')[0].strip()
            if not (testname in listtest):
                listtest.append(testname)
        if os.path.isdir(os.path.join(path, item)):
            function(path + item + '/')            

function(basepath)

text = ''

with open(jsonpath, 'w') as jsonfile:
    jsonfile.write('{ }')

with open(jsonpath) as jsonfile:
    data = json.load(jsonfile)
    
    for item in listtest:
        value = data.get(item)
        if (value):
            data.update({item: value+1})
        else:
            data.update({item: 1})

    text = json.dumps(data)

with open(jsonpath, 'w') as jsonfile:
    jsonfile.write(text)