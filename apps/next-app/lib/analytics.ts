/* eslint-disable camelcase */
import { Metric } from 'web-vitals'

import { InteractionEvents } from './types/analytics'

import { isGtagDefined } from '~/lib/utils/is-gtag-defined'

export interface EventParams {
  event_category: string
  event_label?: string | number
  value?: string | number
}

export interface ViewPageParams {
  // eslint-disable-next-line camelcase
  page_path: string
}

export interface TrackEventType {
  action: string
  params: EventParams
}

export const trackPageView = (url: string): void => {
  isGtagDefined &&
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
      page_path: url
    })
}

// log specific events happening.
export const trackEvent = ({ action, params }: TrackEventType): void => {
  isGtagDefined && window?.gtag('event', action, params)
}

export const sendToGoogleAnalytics = ({ name, delta, id }: Metric): void => {
  trackEvent({
    action: name,
    params: {
      event_category: 'web_vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta)
    }
  })
}

export const interactionExistsInDataLayer = (action: string): boolean => {
  return (
    !!window.dataLayer &&
    window.dataLayer.length > 0 &&
    window.dataLayer.some(el => el.length > 1 && el[1] === action)
  )
}

export const trackInteractionOnce = (event: InteractionEvents): void => {
  const action = 'interaction - ' + event

  isGtagDefined &&
    !interactionExistsInDataLayer(action) &&
    window.gtag('event', action, {
      event_category: 'interaction',
      event_label: event
    })
}
