#!/bin/sh
cd /frontend && ng b --prod --base-href=/explorer/ 
nginx -g"daemon off;"

