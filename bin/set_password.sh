#!/bin/sh
USER_POOL_ID=ap-northeast-1_Zb6TiymOv
USER_NAME=useruser
USER_PASSWORD=user@user

aws cognito-idp admin-set-user-password \
--user-pool-id $USER_POOL_ID \
--username $USER_NAME \
--password $USER_PASSWORD \
--permanent
