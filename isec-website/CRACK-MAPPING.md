# Crack Mapping handoff

Page: `/resources/crack-mapping`, linked from Resources and included in the sitemap.

## Assets and release

The GIF handset stands directly on the page beside the introduction, without a surrounding card, header, or backdrop. Its width is capped at 240px and constrained by available space; the sticky walkthrough handset retains its compact sizing.

The five supplied screenshots are included under `public/crack-mapping/`, with the original walkthrough MP4 retained as source and a GIF conversion. The showcase displays only the automatically looping GIF, followed by a sticky phone frame and five scrolling text steps. The video player and video links have been removed. The animation can be stopped; reduced-motion users start with the poster and can choose Play. As each step approaches the viewport center, the matching screenshot slides into the phone. Order: project, inspection, structural element, original photograph, crack traces. Arrows, step dots, and keyboard arrows also navigate to each step. The layout keeps the phone alongside the text on mobile, with sizing constrained by viewport height. Reduced-motion preferences disable slide transitions and smooth step navigation.

The supplied APK is staged at `public/downloads/ingeniare-crack-mapping-v1.0.apk`. It is 248,519,373 bytes. This exceeds common Git hosting limits for ordinary files; use a release asset/object storage for production and set `VITE_CRACK_MAPPING_APK_URL` to its HTTPS URL before building, instead of committing the APK to ordinary Git. Large files can also cause Netlify Drop uploads to stall; use an appropriate deployment or external download host. The locally staged APK remains available for the local build.

Static inspection on October 28, 2026 found:

- Package: `com.ingeniare.app`; version `0.5.0-ml-research`, code `5` (different from the V1.0 filename).
- Minimum API 26 (Android 8.0); target API 36. Application is debuggable; backups are disabled in the manifest.
- Bundled `assets/crack-segmenter-research.onnx` and native ONNX Runtime libraries.
- Permissions: CAMERA, WAKE_LOCK, ACCESS_NETWORK_STATE, RECEIVE_BOOT_COMPLETED, FOREGROUND_SERVICE, and the package-specific DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. INTERNET is not declared.
- SHA-256: `1cff179e03abfdb54eb853f2d9fbdabee8ba0f30ca0fe0eca37ee4393b180825`.
- Defender scan attempted twice, including outside the sandbox; both failed with `0x80508023`. No clean scan claim is made. Signing certificate and runtime behavior have not been verified.

A valid email enables the download CTA. After a successful Netlify form POST, it starts the download and exposes a retry link. The page discloses the debuggable build and incomplete malware scan before download. Before a broader release, supply a signed, non-debuggable release build, review the declared permissions, and complete a malware scan. Any replacement APK needs a new checksum and metadata review. The 61% model figure still needs a dataset and metric definition.

## Netlify Forms

The APK is tracked with Git LFS to fit GitHub's ordinary-file limits. Set `GIT_LFS_ENABLED=true` and `GIT_LFS_FETCH_INCLUDE=*.apk` in the Netlify UI before deployment so the actual binary is checked out, rather than the text pointer. These clone-time settings cannot be supplied in `netlify.toml`. See [Netlify build environment variables](https://docs.netlify.com/build/configure-builds/environment-variables/).

The GIF and screenshots share a CSS Android handset with thin bezels, a centered punch-hole camera, metallic edges, earpiece, and side buttons. This is an illustrative handset frame, not a branded product photograph. Tapping a screenshot or GIF opens an on-page modal; tapping the enlarged image again, the backdrop, Close, or Escape exits. The modal traps focus via the native dialog element and locks background scrolling while open.

Static form declarations in `index.html` allow build-time detection of the React forms. Enable Netlify form detection and deploy, then confirm these forms in the dashboard:

- `crack-mapping-download`: `email`, `bot-field`
- `crack-mapping-feedback`: `email` (optional), `device` (optional), `feedback`, `bot-field`

Verify both submissions on the deployed Netlify site, including errors and retries. Local Vite development deliberately reports that entries have not been sent. Do not treat successful responses from arbitrary static hosting as proof that Netlify captured the submission.

## Review observations

- Email validation checks format, not mailbox ownership. A static public APK URL can be copied and bypass the UI gate. If verified ownership or restricted downloads become requirements, add email confirmation and server-issued download links.
- Existing `ContactPage.jsx` and `StructuralAssessmentGuidePage.jsx` accept any successful POST response to `/` as a successful form capture. A fallback on a non-Netlify host can therefore produce misleading confirmation. Validate their behavior on the intended deployment.
- Android source was not supplied. Static APK inspection supports the bundled local model description, but does not verify inference behavior, accuracy, or security. The screenshot's width and calibration fields are not evidence that automated width estimation is enabled. User-provided scope remains tracing only.

## App feedback from supplied screens and APK

- Ship a non-debuggable, consistently versioned release APK before wider distribution. The filename's V1.0 and the manifest's 0.5.0-ml-research should agree.
- Clarify what `ENGINEER VERIFIED` means: the original-photo screen shows that badge while verified width is not recorded and dimensions are uncalibrated. Distinguish trace review from measurement verification so readers do not infer that every field was checked.
- Explain unavailable width features in the interface, matching the tracing-only release scope. The existing image-estimated width and calibration labels may imply capabilities that are not yet available.
- The walkthrough displays `Focus not confirmed` and live candidates. Consider a clearer image-quality check before capture, and explain the difference between a candidate and an accepted segment.
- Publish the metric definition, evaluation dataset size, test conditions, and common failure examples alongside the 61% figure. Include challenging lighting, textures, joints, stains, and different devices in future validation.
- Document export and recovery options for offline records. The manifest disables Android backup; engineers need a clear way to preserve project records before changing or losing a device.

These are static-review suggestions, not device-test findings.

## Validation

Run ESLint and the Vite production build. On this Windows sandbox, invoke the available Node runtime directly if npm is not on PATH; `vite build --configLoader runner` avoids the default config bundler's denied parent-directory access.

Browser layout, actual Netlify capture, Android compatibility, model performance, and APK security require further verification in their respective environments.

The full 9.93-second video was converted to a looping 360-pixel-wide, 6 fps GIF (4,468,553 bytes); the original MP4 is retained. GIF decoding was checked and a representative frame inspected. The local page, GIF, and APK endpoints returned HTTP 200, and the staged APK checksum matches the supplied original. Browser QA was unavailable because no browser was connected.
