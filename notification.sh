#!/bin/bash

curl 'https://iceman.com/webhook/group/xxxxxxxxxx1nWVtDQ' \
     -H 'Content-Type: application/json' \                        
     -d '                        
     {                                        
         "tag": "text",                                        
         "text": {                                                        
              "content": "\n分析项目: Code-Demo\n分析报告: https://iceman.com/code-demo/",
              "at_all": true                                        
         }                        
     }'