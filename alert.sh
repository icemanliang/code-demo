#!/bin/bash

curl 'https://iceman.com/webhook/group/xxxxxxxxxx1nWVtDQ' \
     -H 'Content-Type: application/json' \                        
     -d '                        
     {                                        
         "tag": "text",                                        
         "text": {                                                        
              "content": "\n代码告警: Code-Demo\n流水日志: https://iceman.com/code-demo/-/jobs/20051072",
              "at_all": true                                        
         }                        
     }'