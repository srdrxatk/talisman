import * as SentryBrowser from "@sentry/browser"
import * as SentryReact from "@sentry/react"
import { Event } from "@sentry/types"
import { DEBUG } from "extension-shared"
import { ReplaySubject, firstValueFrom } from "rxjs"

import {
  trackIndexedDbErrorExtras,
  triggerIndexedDbUnavailablePopup,
} from "../domains/app/store.errors"
import { settingsStore } from "../domains/app/store.settings"

const normalizeUrl = (url: string) => {
  return url.replace(/(webpack_require__@)?(moz|chrome)-extension:\/\/[^/]+\//, "~/")
}

// cache latest value of useErrorTracking so that we don't need to check localStorage for every error sent to sentry
const useErrorTracking = new ReplaySubject<boolean>(1)
settingsStore.observable.subscribe((settings) => useErrorTracking.next(settings.useErrorTracking))

export const initSentry = (sentry: typeof SentryBrowser | typeof SentryReact) => {
  sentry.init({
    enabled: true,
    environment: process.env.BUILD,
    dsn: process.env.SENTRY_DSN,
    integrations: [new SentryBrowser.BrowserTracing()],
    release: process.env.RELEASE,
    sampleRate: 1,
    maxBreadcrumbs: 20,
    ignoreErrors: [
      /(No window with id: )(\d+).?/,
      /(disconnected from wss)[(]?:\/\/[\w./:-]+: \d+:: Normal Closure[)]?/,
      /^disconnected from .+: [0-9]+:: .+$/,
      /^unsubscribed from .+: [0-9]+:: .+$/,
      /(Could not establish connection. Receiving end does not exist.)/,
    ],
    // prevents sending the event if user has disabled error tracking
    beforeSend: async (event, hint) => {
      // Track extra information about IndexedDB errors
      await trackIndexedDbErrorExtras(event, hint)

      // Print to console instead of Sentry in DEBUG/development builds
      if (DEBUG) {
        console.error("[DEBUG] Sentry event occurred", event) // eslint-disable-line no-console
        return null
      }

      const errorTracking = await firstValueFrom(useErrorTracking)
      return errorTracking ? event : null
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    beforeBreadcrumb: (breadCrumb, hint) => {
      if (breadCrumb.data?.url) {
        breadCrumb.data.url = normalizeUrl(breadCrumb.data.url)
      }
      return breadCrumb
    },

    // Set tracesSampleRate to capture 5%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 0.05,
  })

  sentry.configureScope((scope) => {
    scope.addEventProcessor(async (event: Event) => {
      if (event.request && event.request.url) {
        event.request.url = normalizeUrl(event.request.url)
      }

      if (event.exception?.values && event.exception.values.length > 0) {
        const firstValue = event.exception.values[0]
        if (!firstValue.stacktrace?.frames) return event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        firstValue.stacktrace.frames = firstValue.stacktrace.frames.map((frame: any) => {
          frame.filename = normalizeUrl(frame.filename)
          return frame
        })
      }

      return event
    })
  })

  window.addEventListener("error", (event) => {
    triggerIndexedDbUnavailablePopup(event.error)
  })
}
