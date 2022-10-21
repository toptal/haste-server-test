import { Metric } from 'web-vitals'

import {
  TrackEventType,
  trackEvent,
  interactionExistsInDataLayer,
  trackInteractionOnce,
  trackPageView,
  sendToGoogleAnalytics
} from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

jest.mock('~/lib/utils/is-gtag-defined', () => ({
  isGtagDefined: true
}))

describe('Track functions', () => {
  let gtagSpy: jest.SpyInstance<void, Parameters<Window['gtag']>>

  beforeAll(() => {
    Object.defineProperty(global, 'window', {
      writable: true,
      value: { gtag: jest.fn() }
    })

    gtagSpy = jest.spyOn(window, 'gtag')
  })

  describe('trackEvent', () => {
    it('triggers event with given category and action', () => {
      const event: TrackEventType = {
        action: 'ButtonClick',
        params: { event_category: 'Editor - Freebuild' }
      }

      trackEvent(event)
      expect(gtagSpy).toHaveBeenCalledWith('event', event.action, event.params)
    })
  })

  describe('trackPageView', () => {
    it('calls gtag with correct params if it is present on window', () => {
      trackPageView('/url')

      expect(gtagSpy).toHaveBeenCalledWith(
        'config',
        process.env.NEXT_PUBLIC_GA_ID || '',
        { page_path: '/url' }
      )
    })
  })

  describe('sendToGoogleAnalytics', () => {
    it('creates event with correct data for CLS (delta multiplier)', () => {
      sendToGoogleAnalytics({ name: 'CLS', delta: 0.1, id: 'id' } as Metric)

      expect(gtagSpy).toHaveBeenCalledWith('event', 'CLS', {
        event_category: 'web_vitals',
        event_label: 'id',
        value: 100
      })
    })

    it('creates event with correct data for FID', () => {
      sendToGoogleAnalytics({ name: 'FID', delta: 0.7, id: 'id' } as Metric)

      expect(gtagSpy).toHaveBeenCalledWith('event', 'FID', {
        event_category: 'web_vitals',
        event_label: 'id',
        value: 1
      })
    })
  })
})

describe('interactionExistsInDataLayer', () => {
  it('returns false if dataLayer undefined', () => {
    expect(interactionExistsInDataLayer('test')).toEqual(false)
  })

  it('returns false if datalayer empty', () => {
    Object.defineProperty(global, 'window', {
      writable: true,
      value: { dataLayer: [] }
    })

    expect(interactionExistsInDataLayer('test')).toEqual(false)
  })

  describe('with dataLayer defined', () => {
    beforeAll(() => {
      Object.defineProperty(global, 'window', {
        writable: true,
        value: {
          dataLayer: [['event', 'someevent']]
        }
      })
    })

    it('returns true if event exists in datalayer', () => {
      expect(interactionExistsInDataLayer('someevent')).toEqual(true)
    })

    it("returns false if event doesn't exist in datalayer", () => {
      expect(interactionExistsInDataLayer('otherevent')).toEqual(false)
    })
  })
})

describe('trackInteractionOnce', () => {
  beforeAll(() => {
    Object.defineProperty(global, 'window', {
      writable: true,
      value: {
        gtag: jest.fn(),
        dataLayer: [['event', 'interaction - ' + InteractionEvents.CopyText]]
      }
    })
  })

  it('does not send the event if it already exists in datalayer', () => {
    const gtagSpy = jest.spyOn(window, 'gtag')

    trackInteractionOnce(InteractionEvents.CopyText)

    expect(gtagSpy).not.toBeCalled()
  })

  it('sends proper event to window.gtag', () => {
    const gtagSpy = jest.spyOn(window, 'gtag')

    trackInteractionOnce(InteractionEvents.SaveText)

    expect(gtagSpy).toBeCalledWith(
      'event',
      'interaction - ' + InteractionEvents.SaveText,
      {
        event_category: 'interaction',
        event_label: InteractionEvents.SaveText
      }
    )
  })
})
