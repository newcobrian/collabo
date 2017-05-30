export const SUBJECT_SEARCH_URL = 'https://whatsgoooood.com/search?q='

export const INBOX_SEND_EMAIL_URL = 'https://whatsgoooood.com/mail/send'

/*** FourSquare API Keys ***/
export const FOURSQUARE_CLIENT_ID = 'QXEK1PR4ELFYEMMRBSP4O3NJ20B5F34PXZD3VAXNPNUBX0PB'
export const FOURSQUARE_CLIENT_SECRET = 'LAHBY4DND3VJL3YZQKXBJ4RY4TFKEZJC2O51P04YKXRUZXGA'
export const FOURSQUARE_API_PATH = 'https://api.foursquare.com/v2/venues/'


/*** Amazon API Keys ***/
export const AMAZON_URL = 'http://webservices.amazon.com/onca/xml'
export const AMAZON_ACCESS_KEY_ID = 'AKIAJZJ45X2CXUQI42CA'
export const AMAZON_ACCESS_KEY_SECRET = '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'
export const AMAZON_ASSOCIATE_TAG = 'whatsgood03-20'
export const AMAZON_SEARCH_URL = 'http://whatsgoooood.com/proxy/amazon/'


/*** IMDB PATHS ***/
export const TMDB_IMAGES_PATH = 'http://image.tmdb.org/t/p/original/'


/*** Firebase Paths ***/
export const USERS_PATH = '/users'
export const USERNAMES_TO_USERIDS_PATH = '/usernames-to-userids'
export const HAS_FOLLOWERS_PATH = '/has-followers'
export const IS_FOLLOWING_PATH = '/is-following'
export const SUBJECTS_PATH = '/subjects'
export const REVIEWS_PATH = '/reviews'
export const COMMENTS_PATH = '/comments'
export const COMMENTS_BY_USER_PATH = '/comments-by-user'
export const REVIEWS_BY_USER_PATH = '/reviews-by-user'
export const REVIEWS_BY_SUBJECT_PATH = '/reviews-by-subject'
export const SAVES_PATH = '/saves'
export const SAVES_BY_USER_PATH = '/saves-by-user'
export const LIKES_PATH = '/likes'
export const LIKES_BY_USER_PATH = '/likes-by-user'
export const INBOX_PATH = '/inbox'
export const INBOX_COUNTER_PATH = '/counters/inbox'
export const TAGS_PATH = '/tags'
export const IMAGES_PATH = '/images'
export const IMAGES_BY_USER_PATH = '/images-by-user'
export const ITINERARIES_PATH = '/itineraries'
	// stored itinerary id -> itinerary object w geoId and userId
export const ITINERARIES_BY_USER_PATH = '/itineraries-by-user'
	// stored user id -> itinerary object w/ geoId
export const ITINERARIES_BY_GEO_PATH = '/itineraries-by-geo'
	// stored geo id -> user id -> itinerary object
export const TIPS_PATH = '/tips'
	// stored tip id -> tip object w subjectId and userId
export const TIPS_BY_USER_PATH = '/tips-by-user'
	// stored userId -> tip ojbect w/ subject id
export const TIPS_BY_SUBJECT_PATH = '/tips-by-subject'
	// stored subjectId -> userid -> tip object


/*** Counter Type Constants ***/
export const LIKES_COUNT = 'likesCount'
export const COMMENTS_COUNT = 'commentsCount'
export const SAVES_COUNT = 'savesCount'


/*** Message Type Constants ***/
export const LIKE_MESSAGE = 'LIKE_MESSAGE'
export const LIKE_ITINERARY_MESSAGE = 'LIKE_ITINERARY_MESSAGE'
export const SAVE_MESSAGE = 'SAVE_MESSAGE'
export const FOLLOW_MESSAGE = 'FOLLOW_MESSAGE'
export const COMMENT_ON_COMMENT_REVIEW_MESSAGE = 'COMMENT_ON_COMMENT_REVIEW_MESSAGE'
export const COMMENT_ON_REVIEW_MESSAGE = 'COMMENT_REVIEW_MESSAGE'
export const COMMENT_ON_COMMENT_ITINERARY_MESSAGE = 'COMMENT_ON_COMMENT_ITINERARY_MESSAGE'
export const COMMENT_ON_ITINERARY_MESSAGE = 'COMMENT_ON_ITINERARY_MESSAGE'
export const DIRECT_MESSAGE = 'DIRECT_MESSAGE'
export const FORWARD_MESSAGE = 'FORWARD_MESSAGE'


export const ITINERARY_TYPE = 'itinerary'
export const REVIEW_TYPE = 'review'


/*** Tag list ***/
export const TAG_LIST = []
