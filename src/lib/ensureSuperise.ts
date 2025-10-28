
/** UA-based check for the SupeRISE container. */
export const isSuperiseEnv = /SupeRISE/i.test(navigator.userAgent)
/** Event name emitted by the host when the bridge is injected and ready. */
export const SUPERISE_READY_EVENT = "superiseReady"

export function ensureSuperise(): Promise<SupeRISE.Bridge> {
  return new Promise((resolve, reject) => {
    // Fail fast when not in SupeRISE
    if (!isSuperiseEnv) {
      reject(new Error("Wrong environment, not in SupeRISE."))
      return
    }
    // Bridge already injected
    if (typeof superise !== "undefined") {
      resolve(window.superise)
      return
    }
    // Wait for host to signal readiness once
    window.addEventListener(
      SUPERISE_READY_EVENT,
      () => resolve(window.superise),
      { once: true }
    )
  })
}