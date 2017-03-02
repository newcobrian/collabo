curl -v \
-X POST \
-F template-id=7691e888-4b30-40e2-9d78-df815d5b8453 \
-F recipient='David Young <dave@artichokelabs.com>' \
-F data='{"count": 5, "food_name": "ramen"}' \
'http://whatsgoooood.com/mail/send'

