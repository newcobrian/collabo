export const SUBJECT_SEARCH_URL = 'https://myviews.io/search?q='
export const VIEWS_URL = 'http://myviews.io'
export const COLLABO_URL = 'https://joinkoi.com'
// export const SUBJECT_SEARCH_URL = 'https://localhost:8000/search?q='

export const INBOX_SEND_EMAIL_URL = 'https://myviews.io/mail/send'

/*** Google Maps API Key ***/
export const GOOGLE_API_KEY = 'AIzaSyBvxXp_QM-oiWqY9v6Des7D2EPnhrn769g'
export const GOOGLE_PHOTOS_API_KEY = 'AIzaSyB3MbSBNOV7P2Od_AypauRe3ICDRIhxtNQ'

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


/*** Search Types ***/
export const PEOPLE_SEARCH = 'PEOPLE_SEARCH'
export const GEO_SEARCH = 'GEO_SEARCH'
export const POSTS_SEARCH = 'POSTS_SEARCH'

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
export const TIPS_BY_ITINERARY_PATH = '/tips-by-itinerary'
export const SUBJECTS_BY_ITINERARY_PATH = '/subjects-by-itinerary'
export const SAVES_PATH = '/saves'
export const SAVES_BY_USER_PATH = '/saves-by-user'
export const LIKES_PATH = '/likes'
export const LIKES_BY_USER_PATH = '/likes-by-user'
export const LIKES_BY_USER_BY_ORG_PATH = '/likes-by-user-by-org'
export const INBOX_PATH = '/inbox'
export const INBOX_COUNTER_PATH = '/counters/inbox'
export const TAGS_PATH = '/tags'
export const TAGS_BY_USER_PATH = '/tags-by-user'
export const TAGS_BY_GEO_PATH = '/tags-by-geo'
export const IMAGES_PATH = '/images'
export const IMAGES_BY_USER_PATH = '/images-by-user'
export const IMAGES_ITINERARIES_PATH = '/images-itineraries'
export const IMAGES_ITINERARIES_BY_USER_PATH = '/images-itineraries-by-user'
export const ITINERARIES_PATH = '/itineraries'
	// stored itinerary id -> itinerary object w geoId and userId
export const ITINERARIES_BY_USER_PATH = '/itineraries-by-user'
	// stored user id -> itinerary object w/ geoId
export const ITINERARIES_BY_GEO_PATH = '/itineraries-by-geo'
	// stored geo id -> user id -> itinerary object
export const ITINERARIES_BY_GEO_BY_USER_PATH = '/itineraries-by-geo-by-user'
export const ITINERARIES_BY_USER_BY_TIP_PATH = '/itineraries-by-user-by-tip'
export const TIPS_PATH = '/tips'
	// stored tip id -> tip object w subjectId and userId
export const TIPS_BY_USER_PATH = '/tips-by-user'
	// stored userId -> tip ojbect w/ subject id
export const TIPS_BY_SUBJECT_PATH = '/tips-by-subject'
	// stored subjectId -> userid -> tip object
export const GEOS_PATH = '/geos'
export const COUNTRIES_PATH = '/countries'
export const USERS_FEED_PATH = '/users-feed'
export const RECOMMENDATIONS_PATH = '/recommendations'
export const RECS_BY_ITINERARY_PATH = '/recs-by-itinerary'
export const FOLLOWED_ITINERARIES_PATH = '/followed-itineraries'
export const FOLLOWED_ITINERARIES_BY_USER_PATH = '/followed-itineraries-by-user'

export const PROJECTS_PATH = '/projects'
export const PROJECT_NAMES_BY_ORG_PATH = '/projects-names-by-org'
export const PROJECTS_BY_ORG_PATH = '/projects-by-org'
// export const PROJECTS_BY_USER_BY_ORG_NAME_PATH = '/projects-by-user-by-org-name'
// export const PROJECTS_BY_USER_BY_ORG_PATH = '/projects-by-user-by-org'
export const PROJECTS_BY_ORG_BY_USER_PATH = '/projects-by-org-by-user'
export const PROJECTS_BY_USER_PATH = '/projects-by-user'
export const THREADS_BY_PROJECT_PATH = '/threads-by-project'
export const THREADS_BY_ORG_PATH = '/threads-by-org'
export const THREADS_PATH = '/threads'
export const THREADS_BY_USER_BY_ORG_PATH = '/threads-by-user-by-org'
export const COMMENTS_BY_THREAD_PATH = '/comments-by-thread'
export const ORGS_BY_NAME_PATH = '/orgs-by-name'
export const ORGS_BY_URL_PATH = '/orgs-by-url'
export const ORGS_PATH = '/orgs'
export const ORGS_BY_USER_PATH = '/orgs-by-user'
export const USERS_BY_EMAIL_PATH = '/users-by-email'
export const INVITES_BY_EMAIL_BY_ORG_PATH = '/invites-by-email-by-org'
export const INVITES_PATH = '/invites'
export const USERS_BY_ORG_PATH = '/users-by-org'
export const THREAD_SEEN_COUNTERS_PATH = '/thread-seen-counters'
export const ACTIVITY_BY_USER_BY_ORG_PATH = '/activity-by-user-by-org'
export const UPDATES_PATH = '/updates'
export const USERS_BY_PROJECT_PATH = '/users-by-project'
export const INVITED_USERS_BY_ORG_PATH = '/invited-users-by-org'
export const INVITED_USERS_BY_PROJECT_PATH = '/invited-users-by-project'
export const PROJECT_INVITES_PATH = '/project-invites'
export const PROJECT_INVITES_BY_USER_PATH = '/project-invites-by-user'
export const INBOX_BY_USER_BY_ORG_PATH = '/inbox-by-user-by-org'
export const EMAIL_VERIFICATION_PATH = '/email-verification'
export const VERIFICATION_BY_EMAIL_PATH = '/verification-by-email'
export const USERNAMES_BY_ORG_PATH = 'usernames-by-org'
export const USERS_BY_EMAIL_TIME_BY_ORG_PATH = '/users-by-email-time-by-org'

/*** Counter Type Constants ***/
export const LIKES_COUNT = 'likesCount'
export const COMMENTS_COUNT = 'commentsCount'
export const SAVES_COUNT = 'savesCount'
export const REVIEWS_COUNT = 'reviewsCount'

/*** Message Type Constants ***/
export const LIKE_MESSAGE = 'LIKE_MESSAGE'
export const LIKE_TIP_MESSAGE = 'LIKE_TIP_MESSAGE'
export const LIKE_REC_MESSAGE = 'LIKE_REC_MESSAGE'
export const LIKE_ITINERARY_MESSAGE = 'LIKE_ITINERARY_MESSAGE'
export const SAVE_MESSAGE = 'SAVE_MESSAGE'
export const FOLLOW_MESSAGE = 'FOLLOW_MESSAGE'
export const COMMENT_ON_COMMENT_REVIEW_MESSAGE = 'COMMENT_ON_COMMENT_REVIEW_MESSAGE'
export const COMMENT_ON_REVIEW_MESSAGE = 'COMMENT_REVIEW_MESSAGE'
export const COMMENT_ON_COMMENT_ITINERARY_MESSAGE = 'COMMENT_ON_COMMENT_ITINERARY_MESSAGE'
export const COMMENT_ON_ITINERARY_MESSAGE = 'COMMENT_ON_ITINERARY_MESSAGE'
export const DIRECT_MESSAGE = 'DIRECT_MESSAGE'
export const FORWARD_MESSAGE = 'FORWARD_MESSAGE'
export const USER_MENTIONED_TYPE = 'USER_MENTIONED_TYPE'
export const FOLLOW_ITINERARY_MESSAGE = 'FOLLOW_ITINERARY_MESSAGE'
export const COMMENT_ON_REC_MESSAGE = 'COMMENT_ON_REC_MESSAGE'
export const COMMENT_ON_COMMENT_REC_MESSAGE = 'COMMENT_ON_COMMENT_REC_MESSAGE'
export const ADD_REC_TO_ITINERARY_MESSAGE = 'ADD_REC_TO_ITINERARY_MESSAGE'
export const COMMENT_IN_THREAD_MESSAGE = 'COMMENT_IN_THREAD_MESSAGE'
export const ORG_INVITE_MESSAGE = 'ORG_INVITE_MESSAGE'
export const NEW_THREAD_MESSAGE = 'NEW_THREAD_MESSAGE'
export const COMMENT_MENTION_MESSAGE = 'COMMENT_MENTION_MESSAGE'
export const THREAD_MENTION_MESSAGE = 'THREAD_MENTION_MESSAGE'
export const LIKE_THREAD_MESSAGE = 'LIKE_THREAD_MESSAGE'
export const LIKE_COMMENT_MESSAGE = 'LIKE_COMMENT_MESSAGE'
export const ALSO_COMMENTED_MESSAGE = 'ALSO_COMMENTED_MESSAGE'
export const PROJECT_INVITE_MESSAGE = 'PROJECT_INVITE_MESSAGE'
export const VERIFY_EMAIL = 'VERIFY_EMAIL'
export const ACCEPT_ORG_INVITE_MESSAGE = 'ACCEPT_ORG_INVITE_MESSAGE'
export const ACCEPT_PROJECT_INVITE_MESSAGE = 'ACCEPT_PROJECT_INVITE_MESSAGE'

export const ITINERARY_TYPE = 'itinerary'
export const REVIEW_TYPE = 'review'
export const RECOMMENDATIONS_TYPE = 'recommendations'
export const TIPS_TYPE = 'tips'
export const COMMENT_TYPE = 'COMMENT_TYPE'
export const THREAD_TYPE = 'THREAD_TYPE'
export const NEW_THREAD_TYPE = 'NEW_THREAD_TYPE'
export const EDIT_THREAD_TYPE = 'EDIT_THREAD_TYPE'
export const NESTED_COMMENT_TYPE = 'NESTED_COMMENT_TYPE'
export const PROJECT_TYPE = 'PROJECT_TYPE'
export const ORG_TYPE = 'ORG_TYPE'

export const PROJECT_LIST_TYPE = 'projectList'
export const ORG_LIST_TYPE = 'orgList'

export const SUBJECTS_DATA = 'subjectsData'
export const REVIEWS_DATA = 'reviewsData'
export const TIPS_DATA = 'tipsData'
export const DEFAULT_IMAGES_DATA = 'defaultImagesData'
export const USER_IMAGES_DATA = 'userImagesData'

/**** Modal Types ***/
export const FORWARD_MODAL = 'FORWARD_MODAL'
export const REVIEW_MODAL = 'REVIEW_MODAL'
export const SAVE_MODAL = 'SAVE_MODAL'
export const NEW_ITINERARY_MODAL = 'NEW_ITINERARY_MODAL'
export const DELETE_ITINERARY_MODAL = 'DELETE_ITINERARY_MODAL'
export const INFO_MODAL = 'INFO_MODAL'
export const REORDER_ITINERARY_MODAL = 'REORDER_ITINERARY_MODAL'
export const SHARE_MODAL = 'SHARE_MODAL'
export const FILTER_MODAL = 'FILTER_MODAL'
export const CHANGE_EMAIL_MODAL = 'CHANGE_EMAIL_MODAL'
export const CREATE_RECS_MODAL = 'CREATE_RECS_MODAL'
export const SEND_RECS_MODAL = 'SEND_RECS_MODAL'
export const DELETE_MODAL = 'DELETE_MODAL'
export const PROJECT_INVITE_MODAL = 'PROJECT_INVITE_MODAL'
export const ORG_INVITE_MODAL = 'ORG_INVITE_MODAL'
export const THREAD_MODAL = 'THREAD_MODAL'
export const PROJECT_SETTINGS_MODAL = 'PROJECT_SETTINGS_MODAL'

/*** Page Sources ***/
export const USER_FEED = 'USER_FEED'
export const ITINERARY_PAGE = 'ITINERARY_PAGE'
export const EXPLORE_PAGE = 'EXPLORE_PAGE'
export const UNIVERSAL_SEARCH_BAR = 'UNIVERSAL_SEARCH_BAR'
export const PROFILE_PAGE = 'PROFILE_PAGE'
export const SETTINGS_PAGE = 'SETTINGS_PAGE'
export const CREATE_PAGE = 'CREATE_PAGE'
export const ADD_REVIEW_PAGE = 'ADD_REVIEW_PAGE'
export const ADD_PROJECT_PAGE = 'ADD_PROJECT_PAGE'
export const ADD_THREAD_PAGE = 'ADD_THREAD_PAGE'
export const PROJECTS_PAGE = 'PROJECTS_PAGE'
export const CREATE_ORG_PAGE = 'CREATE_ORG_PAGE'
export const THREAD_PAGE = 'THREAD_PAGE'
export const PROJECT_PAGE = 'PROJECT_PAGE'
export const REGISTER_PAGE = 'REGISTER_PAGE'
export const INBOX_PAGE = 'INBOX_PAGE'
export const ORG_SETTINGS_PAGE = 'ORG_SETTINGS_PAGE'
export const PROJECT_SETTINGS_PAGE = 'PROJECT_SETTINGS_PAGE'
export const INVITE_FORM = 'INVITE_FORM'
export const PROJECT_INVITE_PAGE = 'PROJECT_INVITE_PAGE'
export const ENTER_EMAIL_PAGE = 'ENTER_EMAIL_PAGE'
export const ACCEPT_ORG_INVITE_PAGE = 'ACCEPT_ORG_INVITE_PAGE'
export const ACCEPT_PROJECT_INVITE_PAGE = 'ACCEPT_PROJECT_INVITE_PAGE'
export const HOME_PAGE = 'HOME_PAGE'
export const ACCEPT_INVITE_PAGE = 'ACCEPT_INVITE_PAGE'

/*** Tab Constants ***/
export const MEMBERS_TAB = 'members'
export const PENDING_TAB = 'pending'
export const LISTS_TAB = 'lists'
export const MANAGE_TAB = 'manage'
export const SETTINGS_TAB= 'settings'

/*** User Roles ***/
export const PRIMARY_OWNER_ROLE = '0'
export const OWNER_ROLE = '1'
export const ADMIN_ROLE = '2'
export const USER_ROLE = '3'
export const GUEST_ROLE = '4'

/*** User role names map ***/
export const USER_ROLES_MAP = {
	0: 'Primary Owner',
	1: 'Owner',
	2: 'Admin',
	3: 'User',
	4: 'Guest'
}

/*** USER STATUS ***/
export const ACTIVE_STATUS = 'Active'
export const DEACTIVE_STATUS = 'Deactivated'

export const ORG_MEMBERS_LIST = 'orgMembers'
export const PROJECT_MEMBERS_LIST = 'projectMembers'

/*** Tag list ***/
export const TAG_LIST = []

/*** Popularity Score Values ***/
export const ADD_TIP_GUIDE_SCORE = 1
export const LIKE_GUIDE_SCORE = 3
export const SAVE_TIP_GUIDE_SCORE = 6
export const COMMENT_GUIDE_SCORE = 6

export const POPULARITY_PAGE_COUNT = 9
export const POPULARITY_MODULE_COUNT = 3
export const HOME_PAGE_FEED_COUNT = 15
export const INBOX_FEED_COUNT = 20
export const TIPS_TO_LOAD = 8

/*** Mixpanel events ***/
export const MIXPANEL_PAGE_VIEWED = 'page viewed'
export const MIXPANEL_CLICK_EVENT = 'click event'
export const MIXPANEL_SHARE_EVENT = 'share event'
export const MIXPANEL_EMAIL_SENT = 'email sent'
export const MIXPANEL_EMAIL_FAILED = 'email failed'
export const FACEBOOK_POST = 'facebook post'
export const TWITTER_POST = 'twitter post'
export const COPY_URL_TO_CLIPBOARD = 'copy URL to clipboard'

/*** Mixpanel click names ***/
export const ASK_FOR_RECS_MIXPANEL_CLICK = 'ask for recs button'

/*** Mixpanel page sources ***/
export const HOME_PAGE_MIXPANEL_SOURCE = 'home page'
export const ITINERARY_PAGE_MIXPANEL_SOURCE = 'itinerary page'

export const INVALID_USERNAMES = ['account', 'send', 'message', 'inbox', 'notification', 'create', 'edit', 'editor',
 'itinerary', 'messenger', 'settings', 'admin', 'administrator', 'settings', 'saved', 'login', 'register',
  'followers', 'isfollowing', 'likes', 'saves', 'select', 'explore', 'search', 'user', 'users','home', 
  'api', 'popular', 'privacy', 'terms', 'about', 'contact', 'recommend', 'recommendations', 'new', 'addthread', 
  'addproject', 'thread', 'project', 'organization', 'team', 'undefined', 'null', 'forgotpassword', 'invitation', 'verify']

  export const INVALID_ORG_NAMES = ['koi', 'account', 'send', 'message', 'inbox', 'notification', 'create', 'edit', 'editor',
  'messenger', 'settings', 'admin', 'administrator', 'settings', 'global', 'saved', 'login', 'register',
  'followers', 'isfollowing', 'likes', 'saves', 'select', 'explore', 'search', 'user', 'users', 
  'home', 'api', 'privacy', 'terms', 'about', 'contact', 'new', 'addthread', 'addproject', 'thread', 'project', 
  'organization', 'team', 'undefined', 'null', 'default', 'accept', 'forgotpassword', 'newteam', 'seo', 'invitation', 'koi',
  'joinkoi', 'koiteam', 'koifish', 'verify']

/*** Inbox types ***/
export const INBOX_INVITE_TYPE = 'INBOX_INVITE_TYPE'

/*** status types ***/
export const ACCEPTED_STATUS = 'accepted'

/** Google Driver REST endpoint ***/
export const GOOGLE_DRIVE_API_ENDPOINT = 'https://content.googleapis.com/drive'
export const GOOGLE_DRIVE_CLIENT_ID = '438121995352-h6nr2939gti9mh11vit36e9conrsib9l.apps.googleusercontent.com'
export const GOOGLE_DRIVE_API_KEY = 'AIzaSyDM-kc1XYMc8mGDCNqXa7vidvXvUHTgE9k'

export const CHANGE_DETECTION_DEBOUNCE_TIME = 10 * 1000; // 1 mins

export const DUMMY_PROJECTS = [
{ name: 'General' },
{ name: 'Meeting Notes' }
]