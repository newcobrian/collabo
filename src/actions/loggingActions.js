import Firebase from 'firebase';
import * as Constants from '../constants'
import * as Helpers from '../helpers'
import * as ActionTypes from './types'
import mixpanel from 'mixpanel-browser'

export function sendMixpanelEvent(eventName, params={}) {
  return dispatch => {
    dispatch({
      type: ActionTypes.MIXPANEL_EVENT,
      meta: {
        mixpanel: {
          event: eventName,
          props: Object.assign({}, params)
        }
      }
    })
  }
}

export function logMixpanelClickEvent(clickName, source) {
	return dispatch => {
		let props = Object.assign({}, {type: clickName})
		if (source) props.source = source;

		dispatch({
			type: ActionTypes.MIXPANEL_EVENT,
			meta: {
		        mixpanel: {
		          event: Constants.MIXPANEL_CLICK_EVENT,
		          props: props
		        }
	      	}
		})
	}
}