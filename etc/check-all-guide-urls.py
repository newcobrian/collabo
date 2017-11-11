#
# use: just run it to check every guide on the live site to make sure the response is 200 OK and not the home page redirect
#

import urllib2

import firebase_admin
from firebase_admin import db
from firebase_admin import credentials

credentials = credentials.Certificate({u'auth_provider_x509_cert_url': u'https://www.googleapis.com/oauth2/v1/certs',
 u'auth_uri': u'https://accounts.google.com/o/oauth2/auth',
 u'client_email': u'firebase-adminsdk-3n3no@views-18a9f.iam.gserviceaccount.com',
 u'client_id': u'108969981922445863250',
 u'client_x509_cert_url': u'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-3n3no%40views-18a9f.iam.gserviceaccount.com',
 u'private_key': u'-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCs6jBcDzX8NSwb\nmgVOV8+vDvKGz1I4F2AdEX1fiqgX5byFjJd6Xr3UR1Cs2po17rIHb2EXGBabkLCc\npUk9hNpE904hwzjKEkjcGdYnISwZZVLDjB3hbmR8UBPVue3t5IE6BcNcXDcaqldO\nUxDsXXvZP+4toLYPgWAT5dFrkW9ch0KudD2CzEXXO0WuiEvBEt9Mx8nQ2J49ml/d\n+vui73eTzNx5/UKnmiKRXnRX5ELomYi9h1NCaviIipYIKvKOQaR/fEpHsWVmsiir\nQeFyeacBkIThmCLgl0Rvsb3FtbwO2LNvS8SoTK35kqCChnAvnqB48EEZzZxEbm3D\n44L7z2jXAgMBAAECggEANhYk3U7muIabTuDtAvXloSDgTLnBwojRSBZl7IIvFRaH\n0xBIe37yCtnpyr+wF+mbZ0b4DCS9QZjPHZh34dXR/luK5XWuqEpy3uH4AhJWvHTc\noA0Odaq1pMrZgXNgkJZ2s4ME+jlgBSe+GmJSO1T8fdaI9l28RPpXZrHuwSJjPoIO\nvAI3FzNMWj4ov+SKOhIVcizzSnCli3P/GNQ6QAiUDMUafvcKEulMKneNG0eCq+PC\nq8O0ND8waK43Bm4I6YuUaLqQmPSso/3WFE+m0cEkb+S2c2DVQWKXMWMhjgBCSFw+\nMazge+FBWtYqVLI2nlHTTLqC4v4ca5BC9F1e3WKIVQKBgQDged/jdfYgcJsG+M7Z\nMZFB92xLC3ODptiB33zYEOfV+AtE+PIoncmdr3oBRq3ralTdFNmrwrh7GuT17NDG\nt1P9bebU5VKkdnF0j+A9gOSOu0CzIx/8InbnNBvfm7W3H0ai+2sVCd+yfnOQbuyi\nl2XF3jIZYRTbWigusLtvZIr0kwKBgQDFMqNi3ihHnI5DHhV7voOQAWBMG7HeU4bs\nM5aO9wRdVnuWHfZW+YTnER0Lb9CCEpvuMfr8v9/9Ciit54actlwEUESpol5Ivp55\n0rdp0aaZy21LDwIDHINzOxgml+w42oi1wj707k8lM9uRl6yrMIC3GzkK/7XbgAkp\nG06mQRnJLQKBgEp1wuFloKX0FEiEwcBj48YY95ARFVknQAwcgQH+4ZglNj/DwDfe\n1yD6MyM3ObusQsgvAWErLxyOuEInMr2n1DFtgjM+emJZc5rxmrVsCuSZkoWZciOl\nnwFkVJagxO8gbcLkWQnag5xmu5i+YrowNC8lXEL05AE677dFInd5x2oHAoGAK2g8\nItU4FJtXjVqf6/9Bwn8rDVXDT2cfefrZF1s0cL9KsP6jbP27zYks1YmlYhxqioIh\n92TdDzwfPDiMnw5dLu3kT1rYWjbrd3F0wixN+eiXhEAndzvdi43kgQpMCy+/jBLX\n/N5AObYyjNfQQFaK3sN1SQCErW5/lbbXFy2ZWXkCgYA3O9H9C78hgexmrzZz+lYX\njwy5RqrjuexbPm78efWRDA0KpYZSzwLAG/qWnTL7TmGkv53phGbNA9sQTMzh0drK\npxVjE9ehMKNn4dltZ6I14KJ21p7q7RjW/HNeUZxU8//7fm3iNQEFEQQi8Tgxg4WE\nJsEl6G2CWtfWhV5gofoH+Q==\n-----END PRIVATE KEY-----\n',
 u'private_key_id': u'123dc36510b3892411cfb36d91a9a7f07fa96fc6',
 u'project_id': u'views-18a9f',
 u'token_uri': u'https://accounts.google.com/o/oauth2/token',
 u'type': u'service_account'})
firebase_admin.initialize_app(credentials, {
    'databaseURL' : 'https://views-18a9f.firebaseio.com'
})

ref = db.reference('itineraries').get()
if not ref:
    raise Exception('NotFound: %s' % itinerary_id)

err = ok = count = 0
for k in ref.iterkeys():
    url = 'https://myviews.io/guide/%(k)s' % locals()
    result = urllib2.urlopen(url)
    contents = result.read()
    code = result.getcode()
    if code != 200:
        print 'ERR %s' % k
        err += 1
    else:
        print 'OK %s' % k
        ok += 1
        
    count += 1

print '%(count)d guides checked, %(ok)d OK, %(err)d errors' % locals()

