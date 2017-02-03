"""

% gcloud app deploy --project searchitall-156620

var url = "https://searchitall-156620.appspot.com/?q=dogs"
var url = "https://api.foursquare.com/v2/venues/52617140498ec4929863ea86?client_id=QXEK1PR4ELFYEMMRBSP4O3NJ20B5F34PXZD3VAXNPNUBX0PB&client_secret=LAHBY4DND3VJL3YZQKXBJ4RY4TFKEZJC2O51P04YKXRUZXGA&v=20170101"
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    console.log(this)
};
xhttp.open("GET", url, true);
xhttp.send();

"""
import base64, datetime, json, hashlib, hmac, logging, pprint, urllib, zlib

from flask import Flask, request, Response
app = Flask(__name__)

import lxml.etree # !@#%! amazon

from google.appengine.api import urlfetch, memcache

FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/search'
FOURSQUARE_CLIENT_ID = 'QXEK1PR4ELFYEMMRBSP4O3NJ20B5F34PXZD3VAXNPNUBX0PB'
FOURSQUARE_CLIENT_SECRET = 'LAHBY4DND3VJL3YZQKXBJ4RY4TFKEZJC2O51P04YKXRUZXGA'

SPOTIFY_URL = 'https://api.spotify.com/v1/search'
SPOTIFY_CLIENT_ID = '5c2f5f461b434a0f989a3f578750f2df'
SPOTIFY_CLIENT_SECRET = 'ffb6625a0c1145c39e3cdd4069a41229'

GOOGLE_BOOKS_API_KEY = 'AIzaSyBA_9yXQd4W_mxnyNlrXg-TpsA4fakxt5A'

AMAZON_URL = 'http://webservices.amazon.com/onca/xml'
AMAZON_ACCESS_KEY_ID = 'AKIAJZJ45X2CXUQI42CA'
AMAZON_ACCESS_KEY_SECRET = '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'
AMAZON_ASSOCIATE_TAG = 'whatsgood03-20'

TMDB_MOVIE_URL = 'https://api.themoviedb.org/3/search/movie'
TMDB_TV_URL = 'https://api.themoviedb.org/3/search/tv'
TMDB_API_KEY = '7ba8f09e9d032cf1ba3d26c95c23edee'

'''
curl -X GET -G "https://api.foursquare.com/v2/venues/search" \
-d v=20170101 \
-d near=94103 \
-d query=dogs \
-d client_id=QXEK1PR4ELFYEMMRBSP4O3NJ20B5F34PXZD3VAXNPNUBX0PB \
-d client_secret=LAHBY4DND3VJL3YZQKXBJ4RY4TFKEZJC2O51P04YKXRUZXGA

detail url is like https://api.foursquare.com/v2/venues/VENUE_ID


https://developer.foursquare.com/docs/venues/search
venues/search?ll=40.7,-74


query=A search term to be applied against venue names.

near = city, state
ll = required unless near is provided. Latitude and longitude of the user's location. (Required for query searches). Optional if using intent=global


{u'allowMenuUrlEdit': True,
 u'beenHere': {u'lastCheckinExpiredAt': 0},
 u'categories': [{u'icon': {u'prefix': u'https://ss3.4sqi.net/img/categories_v2/food/streetfood_',
                            u'suffix': u'.png'},
                  u'id': u'4bf58dd8d48988d1cb941735',
                  u'name': u'Food Truck',
                  u'pluralName': u'Food Trucks',
                  u'primary': True,
                  u'shortName': u'Food Truck'}],
 u'contact': {u'formattedPhone': u'(415) 861-0778',
              u'phone': u'4158610778',
              u'twitter': u'annieshotdogs'},
 u'hasPerk': False,
 u'hereNow': {u'count': 0, u'groups': [], u'summary': u'Nobody here'},
 u'id': u'4bbd085f593fef3bdcf90256',
 u'location': {u'address': u'Market St',
               u'cc': u'US',
               u'city': u'San Francisco',
               u'country': u'United States',
               u'crossStreet': u'at Ellis St.',
               u'formattedAddress': [u'Market St (at Ellis St.)',
                                     u'San Francisco, CA 94102',
                                     u'United States'],
               u'labeledLatLngs': [{u'label': u'display',
                                    u'lat': 37.78544992665342,
                                    u'lng': -122.40631732099772}],
               u'lat': 37.78544992665342,
               u'lng': -122.40631732099772,
               u'postalCode': u'94102',
               u'state': u'CA'},
 u'name': u"Annie's Hot Dogs",
 u'referralId': u'v-1485291379',
 u'specials': {u'count': 0, u'items': []},
 u'stats': {u'checkinsCount': 250, u'tipCount': 1, u'usersCount': 169},
 u'url': u'http://www.annieshotdogs.com',
 u'venueChains': [],
 u'verified': True}

'''

REMOTE_TIMEOUT = 8

def parse_4sq(rpc, results, errors):
    try:
        result = rpc.get_result()
        if result.status_code == 200:
            rc = json.loads(result.content)
            for v in rc['response']['venues']:
                v['_service'] = '4sq'
            results.extend(rc['response']['venues'])
            logging.info('4sq %d venues' % len(rc['response']['venues']))
            # pprint.pprint(rc['response']['venues'][0])
        else:
            # {"meta":{"code":410,"errorType":"param_error","errorDetail":"The Foursquare API no longer supports requests that do not pass in a version parameter. For more details see https:\/\/developer.foursquare.com\/overview\/versioning","requestId":"5887be4c1ed2191d849932f3"},"response":{}}
            err = json.loads(result.content)
            err['meta']['_service'] = '4sq'
            errors.append(err['meta'])
            logging.error('4sq %s' % err['meta'])
    except Exception, e:
        errors.append({'service': '4sq', 'err': str(e)})

def search_4sq(q):
    rpc = urlfetch.create_rpc(deadline=REMOTE_TIMEOUT)
    args = {
        'client_id': FOURSQUARE_CLIENT_ID,
        'client_secret': FOURSQUARE_CLIENT_SECRET,
        'v': '20170101',
        'near': 'San Francisco, CA',
        'intent': 'browse',
        'query': q
    }

    url = '%s?%s' % (FOURSQUARE_URL, urllib.urlencode(args))
    logging.info('fetching 4sq %s' % url)
    urlfetch.make_fetch_call(rpc, url)
    return {'rpc': rpc, 'parse': parse_4sq}

#

def parse_spotify(rpc, results, errors):
    try:
        print 'parsing spotify'
        result = rpc.get_result()
        if result.status_code == 200:
            rc = json.loads(result.content)
            for v in rc['artists']['items']:
                v['_service'] = 'spotify'
            for v in rc['tracks']['items']:
                v['_service'] = 'spotify'
            for v in rc['albums']['items']:
                v['_service'] = 'spotify'

            results.extend(rc['artists']['items'])
            results.extend(rc['tracks']['items'])
            results.extend(rc['albums']['items'])
            logging.info('spot %d artists' % len(rc['artists']['items']))
            logging.info('spot %d tracks' % len(rc['tracks']['items']))
            logging.info('spot %d albums' % len(rc['albums']['items']))
            # pprint.pprint(rc['response']['venues'][0])
        else:
            # {"meta":{"code":410,"errorType":"param_error","errorDetail":"The Foursquare API no longer supports requests that do not pass in a version parameter. For more details see https:\/\/developer.foursquare.com\/overview\/versioning","requestId":"5887be4c1ed2191d849932f3"},"response":{}}
            logging.error('spot %s' % result.content)
            # err = json.loads(result.content)
            # err['meta']['_service'] = '4sq'
            # errors.append(err['meta'])
    except Exception, e:
        logging.exception(e)
        errors.append({'service': '4sq', 'err': str(e)})

def search_spotify(q):
    rpc = urlfetch.create_rpc(deadline=REMOTE_TIMEOUT)
    args = {
        'type': 'album,artist,track',
        'market': 'us',
        'q': q
    }

    url = '%s?%s' % (SPOTIFY_URL, urllib.urlencode(args))
    logging.info('fetching spotify %s' % url)
    urlfetch.make_fetch_call(rpc, url)
    return {'rpc': rpc, 'parse': parse_spotify}


# API keys are connected to dave@artichokelabs.com affiliate account
# Your unique Associate ID is whatsgood03-20
# lol it's xml time
def parse_amazon(rpc, results, errors):
    NS = '{http://webservices.amazon.com/AWSECommerceService/2011-08-01}'
    ATTRIBUTES = ('Author', 'Manufacturer', 'ProductGroup', 'Title')

    try:
        result = rpc.get_result()
        if result.status_code == 200:
            root = lxml.etree.fromstring(result.content)
            # christ
            items = root.find(NS + 'Items')
            items = [x for x in items if x.tag.endswith('Item')]
            # this API is ghetto and you have to make another call to get images
            # http://docs.aws.amazon.com/AWSECommerceService/latest/DG/EX_RetrievingImages.html
            logging.info('amzn %d results' % len(items))
            for i in items:
                res = {}
                res['_service'] = 'amazon'
                attributes = i.find(NS + 'ItemAttributes')
                for k in ATTRIBUTES:
                    attr = attributes.find(NS + k)
                    if attr is not None:
                        res[k] = attr.text
                res['ASIN'] = i.find(NS + 'ASIN').text
                res['DetailPageURL'] = i.find(NS + 'DetailPageURL').text
                results.append(res)


            # for v in rc['response']['venues']:
            #     v['_service'] = '4sq'
            # results.extend(rc['response']['venues'])
            # pprint.pprint(rc['response']['venues'][0])
        else:
            # err = json.loads(result.content)
            # err['meta']['_service'] = '4sq'
            # errors.append(err['meta'])
            logging.error('amzn %s' % result.content)
    except Exception, e:
        errors.append({'service': 'amazon', 'err': str(e)})

# cf bottlenose api for python, but we need async urlfetch support
def _quote_query(query):
    """Turn a dictionary into a query string in a URL, with keys
    in alphabetical order."""
    return "&".join("%s=%s" % (
        k, urllib.quote(
            unicode(query[k]).encode('utf-8'), safe='~'))
            for k in sorted(query))


def search_amazon(q):
    '''http://webservices.amazon.com/onca/xml?
  Service=AWSECommerceService
  &Operation=ItemSearch
  &ResponseGroup=Small
  &SearchIndex=Music
  &Title=Blue
  &AWSAccessKeyId=[Your_AWSAccessKeyID]
  &AssociateTag=[Your_AssociateTag]
  &Timestamp=[YYYY-MM-DDThh:mm:ssZ]
  &Signature=[Request_Signature]
'''
    rpc = urlfetch.create_rpc(deadline=REMOTE_TIMEOUT)
    args = {
        'Service': 'AWSECommerceService',
        'Operation': 'ItemSearch',
        'ResponseGroup': 'Small',
        'SearchIndex': 'Books',
        'Title': q,
        'AWSAccessKeyId': AMAZON_ACCESS_KEY_ID,
        'AssociateTag': AMAZON_ASSOCIATE_TAG,
        'Timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
    }

    # signing cf. bottlenose API
    quoted_strings = _quote_query(args)
    data = "GET\n" + 'webservices.amazon.com' + "\n/onca/xml\n" + quoted_strings
    digest = hmac.new(AMAZON_ACCESS_KEY_SECRET, data, hashlib.sha256).digest()
    signature = urllib.quote(base64.b64encode(digest))

    url = '%s?%s&Signature=%s' % (AMAZON_URL, urllib.urlencode(args), signature)
    logging.info('fetching amazon %s' % url)
    urlfetch.make_fetch_call(rpc, url)
    return {'rpc': rpc, 'parse': parse_amazon}

# https://api.themoviedb.org/3/search/movie?api_key=7ba8f09e9d032cf1ba3d26c95c23edee&query=Jack+Reacher

def parse_tmdb(rpc, results, errors):
    try:
        result = rpc.get_result()
        if result.status_code == 200:
            rc = json.loads(result.content)
            for v in rc['results']:
                v['_service'] = 'tmdb'
            results.extend(rc['results'])
            logging.info('tmdb %d results' % len(rc['results']))
        else:
            err = json.loads(result.content)
            errors.append(err)
            logging.error('tmdb %s' % err)
    except Exception, e:
        errors.append({'service': 'tmdb', 'err': str(e)})

def search_tmdb_movie(q):
    rpc = urlfetch.create_rpc(deadline=REMOTE_TIMEOUT)
    args = {
        'api_key': TMDB_API_KEY,
        'query': q
    }

    url = '%s?%s' % (TMDB_MOVIE_URL, urllib.urlencode(args))
    logging.info('fetching tmdb movie %s' % url)
    urlfetch.make_fetch_call(rpc, url)
    return {'rpc': rpc, 'parse': parse_tmdb}

def search_tmdb_tv(q):
    rpc = urlfetch.create_rpc(deadline=REMOTE_TIMEOUT)
    args = {
        'api_key': TMDB_API_KEY,
        'query': q
    }

    url = '%s?%s' % (TMDB_TV_URL, urllib.urlencode(args))
    logging.info('fetching tmdb tv %s' % url)
    urlfetch.make_fetch_call(rpc, url)
    return {'rpc': rpc, 'parse': parse_tmdb}

###

SERVICES = [search_4sq, search_spotify, search_amazon, search_tmdb_movie, search_tmdb_tv]
#SERVICES = [search_amazon]

###

@app.route('/search')
def hello():
    q = request.args.get('q')

    results = []
    errors = []
    rpcs = []

    rc = memcache.get(q.lower())
    if rc and not request.args.get('nocache'):
        data = json.loads(zlib.decompress(rc))
        results = data['results']
        logging.info('[cache] hit "%s"; %d results' % (q.lower(), len(results)))
    else:
        logging.info('[cache] miss "%s"' % q.lower())
        for search in SERVICES:
            rpcs.append(search(q))

        for r in rpcs:
            r['rpc'].wait()

        for r in rpcs:
            r['parse'](r['rpc'], results, errors)

        memcache.add(q.lower(), zlib.compress(json.dumps({'results': results})), 86400)

    resp = Response(json.dumps({'q': q, 'results': results, 'errors': errors}))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

@app.route('/proxy/amazon/<item_id>')
def proxy_amazon(item_id):
    args = {
        'Service': 'AWSECommerceService',
        'Operation': 'ItemLookup',
        'ResponseGroup': 'Images,EditorialReview',
        'IdType': 'ASIN',
        'ItemId': item_id,
        'AWSAccessKeyId': AMAZON_ACCESS_KEY_ID,
        'AssociateTag': AMAZON_ASSOCIATE_TAG,
        'Timestamp': datetime.datetime.now().strftime('%Y-%m-%dT%H:%M:%SZ'),
    }

    # signing cf. bottlenose API
    quoted_strings = _quote_query(args)
    data = "GET\n" + 'webservices.amazon.com' + "\n/onca/xml\n" + quoted_strings
    digest = hmac.new(AMAZON_ACCESS_KEY_SECRET, data, hashlib.sha256).digest()
    signature = urllib.quote(base64.b64encode(digest))

    url = '%s?%s&Signature=%s' % (AMAZON_URL, urllib.urlencode(args), signature)
    logging.info('fetching amazon detail %s' % url)
    response = urlfetch.fetch(url, deadline=REMOTE_TIMEOUT)

    # parse
    NS = '{http://webservices.amazon.com/AWSECommerceService/2011-08-01}'

    rc = {}
    if response.status_code == 200:
        root = lxml.etree.fromstring(response.content)
        # christ
        items = root.find(NS + 'Items')
        items = [x for x in items if x.tag.endswith('Item')]
        # there is afaict only one Item per ASIN search, extract the images from it
        logging.info('amzn %d results' % len(items))
        for i in items:
            ASIN = i.find(NS + 'ASIN')
            assert ASIN.text == item_id, (ASIN.text, item_id, 'mismatch')
            rc['ASIN'] = ASIN.text
            for k, v in (('SmallImage', 'small'), ('MediumImage', 'medium'), ('LargeImage', 'large')):
                image_element = i.find(NS + k)
                if image_element:
                    rc.setdefault('images', {})
                    rc['images'][v] = image_element.find(NS + 'URL').text
            # love XML
            for r in i.find(NS + 'EditorialReviews'):
                rc.setdefault('reviews', {})
                rc['reviews'][r.find(NS + 'Source').text] = r.find(NS + 'Content').text

    else:
        # err = json.loads(response.content)
        # err['meta']['_service'] = '4sq'
        # errors.append(err['meta'])
        logging.error('amzn %s' % response.content)

    resp = Response(json.dumps(rc))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp



@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, Nothing at this URL.', 404


@app.errorhandler(500)
def application_error(e):
    """Return a custom 500 error."""
    return 'Sorry, unexpected error: {}'.format(e), 500
