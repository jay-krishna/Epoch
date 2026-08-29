# Epoch

A clean, distraction-free countdown timer and stopwatch for workouts, focus sessions, cooking, and other timed activities. It runs in the browser, installs like a native app, works offline, and supports voice control so the screen can stay untouched during a set.

## Getting started

Open Epoch in a browser to begin. Tap the central **hh : mm : ss** display to enter a time, then press **Start**.

- **Start** begins the countdown. While running, **Pause** and **Stop** appear.
- **Pause** freezes the time; the button becomes **Resume**.
- **Stop** resets the timer to 00:00:00.
- A soft chime plays when time is up, and five gentle ticks play during the final five seconds.

The Start button stays greyed out until a time above zero is set.

## Timer vs. stopwatch

The button below the Epoch logo (top-left) switches modes:

- **Timer** (default) — counts down from the time entered in **hh : mm : ss** to zero, as described above.
-- **Stopwatch** — a continuous count-up clock that starts from 00:00:00 and keeps counting upward until stopped. The display is read-only in this mode. A sharp double-beep plays at a regular interval (10s by default).

In stopwatch mode, **Start** begins counting, **Pause** freezes the elapsed time (button becomes **Resume**), and **Stop** resets back to 00:00:00. Switching modes shows a brief notification.

The mode toggle is only available while idle — stop the current session before switching modes.

### Beep interval

While in stopwatch mode, a small button appears below the mode toggle showing the current beep interval (e.g. **10s**). Tap it to choose an interval: **5s, 10s, 30s, 60s**. A brief notification confirms the selection.

## Install it as an app

Epoch can be installed to open full-screen from the home screen or dock, without browser chrome.

- **iPhone / iPad (Safari):** use the Share button, then **Add to Home Screen**.
- **Android (Chrome):** open the menu (⋮), then choose **Install app** or **Add to Home screen**.
- **Windows / macOS (Chrome or Edge):** click the install icon in the address bar, or open the browser menu and choose **Install Epoch**.

Once installed, Epoch launches in its own window and continues to work without an internet connection.

## Voice control

Use the microphone button for hands-free control. The browser requests microphone permission the first time; granting it enables voice commands. Begin each command with the wake word **"Epoch"** (or **"hello"**) and speak naturally:

- **"Epoch switch timer"** — switches to timer (countdown) mode
- **"Epoch switch stopwatch"** — switches to stopwatch (count-up) mode
- **"Epoch set 2 minutes 10 seconds"** — sets the time (timer mode only)
- **"Epoch start"** — starts the timer (in stopwatch mode, starts counting from 00:00:00)
- **"Epoch start 50 seconds"** — sets *and* starts in one step (timer mode only)
- **"Epoch pause"** — pauses
- **"Epoch stop"** — resets

Mode switches are only accepted while idle — stop the current session first.

It understands hours, minutes, and seconds, and accepts singular or plural forms ("minute" vs "minutes"). Once enabled, the microphone stays listening throughout a session so commands can be issued between sets.

Voice uses the browser's built-in speech recognition and works best in **Google Chrome** on desktop and Android. If voice seems unresponsive, open the **voice log** (the lines button) to see what the microphone hears.

## Keep the screen awake

Use the cup button to prevent the screen from dimming or locking while a timer runs — handy for keeping the countdown visible across the room. Tap again to disable.

## Dark & light

Use the **sun / moon** button to switch themes. Epoch remembers the choice and follows the device's system setting on first visit.

## Privacy

Epoch runs entirely in the browser. Microphone access is used only when voice control is enabled and audio is processed by the browser's speech recognition. There are no accounts, no tracking, and timer settings stay on the device.
