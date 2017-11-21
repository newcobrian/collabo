export const SUBJECT_SEARCH_URL = 'https://myviews.io/search?q='
export const VIEWS_URL = 'http://myviews.io'
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
export const SAVES_PATH = '/saves'
export const SAVES_BY_USER_PATH = '/saves-by-user'
export const LIKES_PATH = '/likes'
export const LIKES_BY_USER_PATH = '/likes-by-user'
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
export const TIPS_PATH = '/tips'
	// stored tip id -> tip object w subjectId and userId
export const TIPS_BY_USER_PATH = '/tips-by-user'
	// stored userId -> tip ojbect w/ subject id
export const TIPS_BY_SUBJECT_PATH = '/tips-by-subject'
	// stored subjectId -> userid -> tip object
export const GEOS_PATH = '/geos'
export const COUNTRIES_PATH = '/countries'
export const USERS_FEED_PATH = '/users-feed'

/*** Counter Type Constants ***/
export const LIKES_COUNT = 'likesCount'
export const COMMENTS_COUNT = 'commentsCount'
export const SAVES_COUNT = 'savesCount'
export const REVIEWS_COUNT = 'reviewsCount'

/*** Message Type Constants ***/
export const LIKE_MESSAGE = 'LIKE_MESSAGE'
export const LIKE_TIP_MESSAGE = 'LIKE_TIP_MESSAGE'
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

export const ITINERARY_TYPE = 'itinerary'
export const REVIEW_TYPE = 'review'

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

/*** Page Sources ***/
export const USER_FEED = 'USER_FEED'
export const ITINERARY_PAGE = 'ITINERARY_PAGE'
export const EXPLORE_PAGE = 'EXPLORE_PAGE'

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

export const MIXPANEL_PAGE_VIEWED = 'page viewed'

export const INVALID_USERNAMES = ['account', 'send', 'message', 'inbox', 'notification', 'create', 'edit', 'editor',
 'itinerary', 'messenger', 'settings', 'admin', 'administrator', 'settings', 'global', 'saved', 'login', 'register',
  'review', 'followers', 'isfollowing', 'likes', 'saves', 'select', 'explore', 'search', 'user', 'location', 'city', 
  'geo', 'attraction', 'subject', 'home', 'places', 'countries', 'api', 'guide', 'popular', 'privacy', 'terms', 'about',
  'contact', 'recommend']

export const ADMIN_USERS = [

'WZPmzQzrHtPxMk3DyXpUDn0HU513',
'Pv4pCJ7a11TxXTU28mcUmxgyXc92', 
'HZ1g4L39qnW3rdrhduUwUbGnUx82', 
'S0kpgk8Gk5dlsEvUbGj6QmV40Wl2' /** agent4 **/

]

/** Top Cities for homepage and explore page searchbar **/
export const POPULAR_CITIES = [
	{id: 'ChIJ51cu8IcbXWARiRtXIothAS4', label: 'Tokyo, Japan', shortName: 'Tokyo'},
	{id: 'ChIJ5TCOcRaYpBIRCmZHTz37sEQ', label: 'Barcelona', shortName: 'Barcelona'},
	{id: 'ChIJmQrivHKsQjQR4MIK3c41aj8', label: 'Taipei', shortName: 'Taipei'},
	{id: 'ChIJIQBpAG2ahYAR_6128GcTUEo', label: 'San Francisco', shortName: 'San Francisco'},
	{id: 'ChIJOwg_06VPwokRYv534QaPC8g', label: 'New York', shortName: 'New York'}
]

/** Itineraries that everyone can edit (for testing shared itineraries feature) **/
export const SHARED_ITINERARIES = ['-KpOQT2bgUyHNdcX662g', '-KpiW2sKdc81qIKD_iOO', '-KqURO44kTCwkDyISjBe', 
'-KuM-90vgN_wWHSZvlKu','-KuaQCOTUBL8_NDoiKem','-KuaQosck60hUhKH1BX0', '-KufYkqOAT7OxCadeFXH']

/** Sample guides for logged out view of homepage **/
export const HOMEPAGE_SAMPLE_GUIDES = ['-KsHtCGxX10pSPFRFw6p','-KsaEC85tRyFPhyx_vRI', '-Kr6_OAy780JwQQKlmZE', '-KseiC5dp80TPD6EOnKk']

/** Featured guides on homepage **/
export const FEATURED_GUIDES = ['-KsHtCGxX10pSPFRFw6p','-KsaEC85tRyFPhyx_vRI', '-Kr6_OAy780JwQQKlmZE', '-KseiC5dp80TPD6EOnKk']

/*** Guide preview sizes ***/
export const SMALL_GUIDE_PREVIEW = 'small-guide'
export const MEDIUM_GUIDE_PREVIEW = 'medium-guide'
export const LARGE_GUIDE_PREVIEW = 'large-guide'

/*** Meta tag info ***/
export const DEFAULT_META_TITLE = 'Views'
export const DEFAULT_META_DESCRIPTION = 'Save and Share Travel Guides'
export const DEFAULT_META_URL = 'http://www.myviews.io'


// export const COUNTRY_FLAGS = {
//     'AF' : 'Afghanistan',
//     'AX' : 'Aland Islands',
//     'AL' : 'Albania',
//     'DZ' : 'Algeria',
//     'AS' : 'American Samoa',
//     'AD' : 'Andorra',
//     'AO' : 'Angola',
//     'AI' : 'Anguilla',
//     'AQ' : 'Antarctica',
//     'AG' : 'Antigua And Barbuda',
//     'AR' : 'Argentina',
//     'AM' : 'Armenia',
//     'AW' : 'Aruba',
//     'AU' : 'Australia',
//     'AT' : 'Austria',
//     'AZ' : 'Azerbaijan',
//     'BS' : 'Bahamas',
//     'BH' : 'Bahrain',
//     'BD' : 'Bangladesh',
//     'BB' : 'Barbados',
//     'BY' : 'Belarus',
//     'BE' : 'Belgium',
//     'BZ' : 'Belize',
//     'BJ' : 'Benin',
//     'BM' : 'Bermuda',
//     'BT' : 'Bhutan',
//     'BO' : 'Bolivia',
//     'BA' : 'Bosnia And Herzegovina',
//     'BW' : 'Botswana',
//     'BV' : 'Bouvet Island',
//     'BR' : 'Brazil',
//     'IO' : 'British Indian Ocean Territory',
//     'BN' : 'Brunei Darussalam',
//     'BG' : 'Bulgaria',
//     'BF' : 'Burkina Faso',
//     'BI' : 'Burundi',
//     'KH' : 'Cambodia',
//     'CM' : 'Cameroon',
//     'CA' : 'Canada',
//     'CV' : 'Cape Verde',
//     'KY' : 'Cayman Islands',
//     'CF' : 'Central African Republic',
//     'TD' : 'Chad',
//     'CL' : 'Chile',
//     'CN' : 'China',
//     'CX' : 'Christmas Island',
//     'CC' : 'Cocos (Keeling) Islands',
//     'CO' : 'Colombia',
//     'KM' : 'Comoros',
//     'CG' : 'Congo',
//     'CD' : 'Congo, Democratic Republic',
//     'CK' : 'Cook Islands',
//     'CR' : 'Costa Rica',
//     'CI' : 'Cote D\'Ivoire',
//     'HR' : 'Croatia',
//     'CU' : 'Cuba',
//     'CY' : 'Cyprus',
//     'CZ' : 'Czech Republic',
//     'DK' : 'Denmark',
//     'DJ' : 'Djibouti',
//     'DM' : 'Dominica',
//     'DO' : 'Dominican Republic',
//     'EC' : 'Ecuador',
//     'EG' : 'Egypt',
//     'SV' : 'El Salvador',
//     'GQ' : 'Equatorial Guinea',
//     'ER' : 'Eritrea',
//     'EE' : 'Estonia',
//     'ET' : 'Ethiopia',
//     'FK' : 'Falkland Islands (Malvinas)',
//     'FO' : 'Faroe Islands',
//     'FJ' : 'Fiji',
//     'FI' : 'Finland',
//     'FR' : 'France',
//     'GF' : 'French Guiana',
//     'PF' : 'French Polynesia',
//     'TF' : 'French Southern Territories',
//     'GA' : 'Gabon',
//     'GM' : 'Gambia',
//     'GE' : 'Georgia',
//     'DE' : 'Germany',
//     'GH' : 'Ghana',
//     'GI' : 'Gibraltar',
//     'GR' : 'Greece',
//     'GL' : 'Greenland',
//     'GD' : 'Grenada',
//     'GP' : 'Guadeloupe',
//     'GU' : 'Guam',
//     'GT' : 'Guatemala',
//     'GG' : 'Guernsey',
//     'GN' : 'Guinea',
//     'GW' : 'Guinea-Bissau',
//     'GY' : 'Guyana',
//     'HT' : 'Haiti',
//     'HM' : 'Heard Island & Mcdonald Islands',
//     'VA' : 'Holy See (Vatican City State)',
//     'HN' : 'Honduras',
//     'HK' : 'Hong Kong',
//     'HU' : 'Hungary',
//     'IS' : 'Iceland',
//     'IN' : 'India',
//     'ID' : 'Indonesia',
//     'IR' : 'Iran, Islamic Republic Of',
//     'IQ' : 'Iraq',
//     'IE' : 'Ireland',
//     'IM' : 'Isle Of Man',
//     'IL' : 'Israel',
//     'IT' : 'Italy',
//     'JM' : 'Jamaica',
//     'JP' : 'Japan',
//     'JE' : 'Jersey',
//     'JO' : 'Jordan',
//     'KZ' : 'Kazakhstan',
//     'KE' : 'Kenya',
//     'KI' : 'Kiribati',
//     'KR' : 'Korea',
//     'KW' : 'Kuwait',
//     'KG' : 'Kyrgyzstan',
//     'LA' : 'Lao People\'s Democratic Republic',
//     'LV' : 'Latvia',
//     'LB' : 'Lebanon',
//     'LS' : 'Lesotho',
//     'LR' : 'Liberia',
//     'LY' : 'Libyan Arab Jamahiriya',
//     'LI' : 'Liechtenstein',
//     'LT' : 'Lithuania',
//     'LU' : 'Luxembourg',
//     'MO' : 'Macao',
//     'MK' : 'Macedonia',
//     'MG' : 'Madagascar',
//     'MW' : 'Malawi',
//     'MY' : 'Malaysia',
//     'MV' : 'Maldives',
//     'ML' : 'Mali',
//     'MT' : 'Malta',
//     'MH' : 'Marshall Islands',
//     'MQ' : 'Martinique',
//     'MR' : 'Mauritania',
//     'MU' : 'Mauritius',
//     'YT' : 'Mayotte',
//     'MX' : 'Mexico',
//     'FM' : 'Micronesia, Federated States Of',
//     'MD' : 'Moldova',
//     'MC' : 'Monaco',
//     'MN' : 'Mongolia',
//     'ME' : 'Montenegro',
//     'MS' : 'Montserrat',
//     'MA' : 'Morocco',
//     'MZ' : 'Mozambique',
//     'MM' : 'Myanmar',
//     'NA' : 'Namibia',
//     'NR' : 'Nauru',
//     'NP' : 'Nepal',
//     'NL' : 'Netherlands',
//     'AN' : 'Netherlands Antilles',
//     'NC' : 'New Caledonia',
//     'NZ' : 'New Zealand',
//     'NI' : 'Nicaragua',
//     'NE' : 'Niger',
//     'NG' : 'Nigeria',
//     'NU' : 'Niue',
//     'NF' : 'Norfolk Island',
//     'MP' : 'Northern Mariana Islands',
//     'NO' : 'Norway',
//     'OM' : 'Oman',
//     'PK' : 'Pakistan',
//     'PW' : 'Palau',
//     'PS' : 'Palestinian Territory, Occupied',
//     'PA' : 'Panama',
//     'PG' : 'Papua New Guinea',
//     'PY' : 'Paraguay',
//     'PE' : 'Peru',
//     'PH' : 'Philippines',
//     'PN' : 'Pitcairn',
//     'PL' : 'Poland',
//     'PT' : 'Portugal',
//     'PR' : 'Puerto Rico',
//     'QA' : 'Qatar',
//     'RE' : 'Reunion',
//     'RO' : 'Romania',
//     'RU' : 'Russian Federation',
//     'RW' : 'Rwanda',
//     'BL' : 'Saint Barthelemy',
//     'SH' : 'Saint Helena',
//     'KN' : 'Saint Kitts And Nevis',
//     'LC' : 'Saint Lucia',
//     'MF' : 'Saint Martin',
//     'PM' : 'Saint Pierre And Miquelon',
//     'VC' : 'Saint Vincent And Grenadines',
//     'WS' : 'Samoa',
//     'SM' : 'San Marino',
//     'ST' : 'Sao Tome And Principe',
//     'SA' : 'Saudi Arabia',
//     'SN' : 'Senegal',
//     'RS' : 'Serbia',
//     'SC' : 'Seychelles',
//     'SL' : 'Sierra Leone',
//     'SG' : 'Singapore',
//     'SK' : 'Slovakia',
//     'SI' : 'Slovenia',
//     'SB' : 'Solomon Islands',
//     'SO' : 'Somalia',
//     'ZA' : 'South Africa',
//     'GS' : 'South Georgia And Sandwich Isl.',
//     'ES' : 'Spain',
//     'LK' : 'Sri Lanka',
//     'SD' : 'Sudan',
//     'SR' : 'Suriname',
//     'SJ' : 'Svalbard And Jan Mayen',
//     'SZ' : 'Swaziland',
//     'SE' : 'Sweden',
//     'CH' : 'Switzerland',
//     'SY' : 'Syrian Arab Republic',
//     'TW' : 'Taiwan',
//     'TJ' : 'Tajikistan',
//     'TZ' : 'Tanzania',
//     'TH' : 'Thailand',
//     'TL' : 'Timor-Leste',
//     'TG' : 'Togo',
//     'TK' : 'Tokelau',
//     'TO' : 'Tonga',
//     'TT' : 'Trinidad And Tobago',
//     'TN' : 'Tunisia',
//     'TR' : 'Turkey',
//     'TM' : 'Turkmenistan',
//     'TC' : 'Turks And Caicos Islands',
//     'TV' : 'Tuvalu',
//     'UG' : 'Uganda',
//     'UA' : 'Ukraine',
//     'AE' : 'United Arab Emirates',
//     'GB' : 'United Kingdom',
//     'US' : 'United States',
//     'UM' : 'United States Outlying Islands',
//     'UY' : 'Uruguay',
//     'UZ' : 'Uzbekistan',
//     'VU' : 'Vanuatu',
//     'VE' : 'Venezuela',
//     'VN' : 'Viet Nam',
//     'VG' : 'Virgin Islands, British',
//     'VI' : 'Virgin Islands, U.S.',
//     'WF' : 'Wallis And Futuna',
//     'EH' : 'Western Sahara',
//     'YE' : 'Yemen',
//     'ZM' : 'Zambia',
//     'ZW' : 'Zimbabwe'
// }
