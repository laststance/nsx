#!/bin/bash

FILENAME=digital_backup_`date +"%Y%m%d"`.sql
FILEPATH=/root/digital-strength/$FILENAME

ssh digitalstrength.dev "cd digital-strength && docker-compose exec db /usr/bin/mysqldump -u root --password=rootpass digital > ${FILEPATH}"
ssh digitalstrength.dev "test -f ${FILEPATH}"
if [ $? -ne 0 ]; then
    echo "dumpfile not found."
    exit
fi
scp digitalstrength.dev:$FILEPATH .
ssh digitalstrength.dev "rm ${FILEPATH}"
