import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaAndroid, FaArrowRight, FaChevronLeft, FaChevronRight, FaPlay, FaShieldAlt } from "react-icons/fa";
import Seo from "../components/seo/Seo.jsx";
import "../styles/crack-mapping.css";

const release = {
  apk: import.meta.env.VITE_CRACK_MAPPING_APK_URL || "/downloads/ingeniare-crack-mapping-v1.0.apk",
  screenshot: "/crack-mapping/Crack_Photo.jpg",
  result: "/crack-mapping/Traced_Crack_Photo.jpg",
  demoGif: "/crack-mapping/walkthrough.gif",
};
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const screenshots = [
  { src: "/crack-mapping/Project_Details.jpg", title: "Organize your project", description: "Keep inspections, structural elements, and crack records together within a project." },
  { src: "/crack-mapping/Inspection_Page.jpg", title: "Start an inspection", description: "Organize the inspection visit before adding structural elements and captures." },
  { src: "/crack-mapping/Add_Element_Interface.jpg", title: "Locate the structural element", description: "Record the building, level, zone, element mark, type, and surface." },
  { src: release.screenshot, title: "Keep the original photograph", description: "Return to the original image and its crack record. Width estimation is not included in this alpha." },
  { src: release.result, title: "Review the crack traces", description: "Crack segments are overlaid on the photograph, with accept, reject, and restore controls for engineer review." },
];

function EnlargedScreenshot({ screenshot, onClose }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => { element.close(); document.body.style.overflow = previousOverflow; };
  }, []);
  return <dialog ref={dialog} className="crack-lightbox" aria-label={screenshot.title} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <button type="button" className="crack-lightbox-close" onClick={onClose} autoFocus aria-label="Close enlarged screenshot">Close ×</button>
    <button type="button" className="crack-lightbox-image" onClick={onClose} aria-label="Tap again to close enlarged screenshot"><img src={screenshot.src} alt={screenshot.title} /></button>
    <p>Tap again to exit · Esc to close</p>
  </dialog>;
}

function AndroidPhone({ children }) {
  return <div className="crack-phone"><span className="crack-phone-speaker" aria-hidden="true" /><span className="crack-phone-camera" aria-hidden="true" />{children}</div>;
}

function AppShowcase() {
  const [index, setIndex] = useState(0);
  const [gifPlaying, setGifPlaying] = useState(() => typeof window === "undefined" || !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [enlarged, setEnlarged] = useState(null);
  const steps = useRef([]);
  const slide = screenshots[index];
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const target = window.innerHeight * .55;
      let closest = 0;
      let distance = Infinity;
      steps.current.forEach((step, stepIndex) => {
        if (!step) return;
        const rect = step.getBoundingClientRect();
        const nextDistance = Math.abs(rect.top + rect.height / 2 - target);
        if (nextDistance < distance) { closest = stepIndex; distance = nextDistance; }
      });
      setIndex(closest);
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { window.cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);
  const goToStep = (next) => {
    const selected = (next + screenshots.length) % screenshots.length;
    steps.current[selected]?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };
  return <section id="showcase" className="crack-showcase container" aria-labelledby="showcase-heading">
    <div className="crack-showcase-heading"><div><p className="crack-eyebrow">EXPLORE THE APP</p><h2 id="showcase-heading">See the cracks. See the workflow.</h2></div><p>Watch the demo first, then scroll through the five steps.</p></div>
    <div className="crack-video-intro">
      <div className="crack-video-intro-copy"><p className="crack-eyebrow">FIRST / WATCH THE DEMO</p><h3>Local AI.<br />Live on Android.</h3><p>A 10-second look at live crack candidates and the capture interface. Results still require engineer review.</p><a href="#crack-walkthrough">Explore the five steps ↓</a></div>
      <figure className="crack-demo-showcase">
          <AndroidPhone><button type="button" className="crack-phone-screen crack-screen-zoom" onClick={() => setEnlarged({ src: gifPlaying ? release.demoGif : "/crack-mapping/walkthrough-poster.jpg", title: "Crack Mapping live tracing demonstration" })} aria-haspopup="dialog" aria-label="Enlarge the app demonstration"><img className="crack-demo-gif" src={gifPlaying ? release.demoGif : "/crack-mapping/walkthrough-poster.jpg"} alt="Live crack candidates and capture workflow in the Android app" width="360" height="780" /></button></AndroidPhone>
        <figcaption><p>Tap the screen to enlarge. Tap again to exit.</p><button type="button" className="crack-animation-toggle" onClick={() => setGifPlaying(!gifPlaying)}>{gifPlaying ? "Stop animation" : "Play animation"}</button></figcaption>
      </figure>
    </div>
    <div className="crack-walkthrough-heading" id="crack-walkthrough"><p className="crack-eyebrow">NEXT / FOLLOW THE WORKFLOW</p><h3>From your project to the crack trace.</h3><p>Scroll to explore. The phone follows each step.</p></div>
    <div className="crack-scroll-story">
      <div className="crack-phone-column">
        <div className="crack-phone-sticky" role="region" aria-roledescription="carousel" aria-label="App workflow screenshots" tabIndex={0} onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); goToStep(index + (event.key === "ArrowLeft" ? -1 : 1)); }
        }}>
          <AndroidPhone><button type="button" className="crack-phone-screen crack-screen-zoom" onClick={() => setEnlarged(slide)} aria-haspopup="dialog" aria-label={`${slide.title}: tap to enlarge`}><span className="crack-phone-track" style={{ transform: `translateX(-${index * 100}%)` }}>{screenshots.map((item, itemIndex) => <img key={item.src} src={item.src} alt={itemIndex === index ? item.title : ""} aria-hidden={itemIndex !== index} width="1080" height="2340" draggable="false" />)}</span></button></AndroidPhone>
          <div className="crack-phone-controls"><button type="button" className="crack-carousel-arrow" aria-label="Previous step" onClick={() => goToStep(index - 1)}><FaChevronLeft aria-hidden="true" /></button><span>{String(index + 1).padStart(2, "0")} / 05</span><button type="button" className="crack-carousel-arrow" aria-label="Next step" onClick={() => goToStep(index + 1)}><FaChevronRight aria-hidden="true" /></button></div>
          <div className="crack-step-dots" role="group" aria-label="Choose a workflow step">{screenshots.map((item, itemIndex) => <button key={item.src} type="button" aria-label={item.title} aria-pressed={itemIndex === index} onClick={() => goToStep(itemIndex)} />)}</div>
          <p className="crack-phone-hint">Tap the screen to enlarge. Tap again to exit.</p>
        </div>
      </div>
      <div className="crack-story-steps">{screenshots.map((item, itemIndex) => <section key={item.src} ref={(element) => { steps.current[itemIndex] = element; }} className={`crack-story-step${index === itemIndex ? " is-active" : ""}`} aria-labelledby={`crack-step-${itemIndex}`}><span className="crack-step-number">STEP {String(itemIndex + 1).padStart(2, "0")}</span><h3 id={`crack-step-${itemIndex}`}>{item.title}</h3><p>{item.description}</p></section>)}</div>
    </div>
    <p className="crack-showcase-note">Screens and recording supplied by Ingeniare Research. The shown traces are a demonstration, not an accuracy benchmark.</p>
    {enlarged && <EnlargedScreenshot screenshot={enlarged} onClose={() => setEnlarged(null)} />}
  </section>;
}

function ResearchForm({ feedback = false }) {
  const name = feedback ? "crack-mapping-feedback" : "crack-mapping-download";
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);
  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (busy || !form.reportValidity() || (!feedback && !validEmail(email))) return;
    setBusy(true);
    setMessage("");
    setFailed(false);
    try {
      // A Vite fallback is not a successful Netlify Forms submission.
      if (import.meta.env.DEV) throw new Error("Forms are available on the Netlify deployment. Your entry has not been sent.");
      const data = new FormData(form);
      if (!feedback) data.set("email", email);
      const response = await fetch("/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data).toString() });
      if (!response.ok) throw new Error("We could not send your entry. Please try again.");
      if (!feedback && release.apk) {
        setDownloadReady(true);
        const link = document.createElement("a");
        link.href = release.apk;
        link.download = "ingeniare-crack-mapping.apk";
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
      setMessage(feedback ? "Thank you. Your feedback has been sent to Ingeniare Research." : release.apk ? "Your download is ready. If it does not start, use the link below." : "Thank you. Your request for a release notification has been recorded.");
      form.reset();
      setEmail("");
    } catch (error) {
      setFailed(true);
      setMessage(error.message || "Unable to send your entry. Please try again.");
    } finally { setBusy(false); }
  }
  return <form name={name} method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={submit}>
    <input type="hidden" name="form-name" value={name} />
    <p hidden><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off" /></label></p>
    <fieldset disabled={busy}>
      <legend className="visually-hidden">{feedback ? "App feedback" : "Android release request"}</legend>
      <label htmlFor={`${name}-email`}>Email address {feedback && "(optional)"}</label>
      <input id={`${name}-email`} name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required={!feedback} {...(!feedback ? { value: email, onChange: (event) => setEmail(event.target.value.trim()) } : {})} aria-describedby={`${name}-privacy`} />
      {feedback && <>
        <label htmlFor="crack-device">Android device & app version (optional)</label>
        <input id="crack-device" name="device" maxLength={200} placeholder="Phone model, Android version, app version" />
        <label htmlFor="crack-feedback">Your feedback</label>
        <textarea id="crack-feedback" name="feedback" required minLength={10} maxLength={5000} rows={6} placeholder="What worked? What did the tracing miss? Tell us what happened, what you expected, or which feature would help you." />
      </>}
      <p id={`${name}-privacy`} className="crack-fine">{feedback ? "Please leave out confidential project or client details. Add your email if you would like a reply." : "We will use your email to process this request and contact you about this alpha release."} <Link to="/privacy-policy">Privacy policy</Link>.</p>
      <button type="submit" className="crack-button" disabled={busy || (!feedback && !validEmail(email))}>{busy ? "Sending…" : feedback ? "Send feedback" : release.apk ? "Download free Android APK" : "Notify me when the APK is ready"}<FaArrowRight aria-hidden="true" /></button>
    </fieldset>
    <div aria-live="polite" aria-atomic="true">{message && <p className={`crack-form-message${failed ? " is-error" : ""}`} role={failed ? "alert" : "status"}>{message}</p>}</div>
    {downloadReady && <a href={release.apk} download>Download the Android APK</a>}
  </form>;
}

export default function CrackMappingPage() {
  return <>
    <Seo title="Crack Mapping App for Android | Ingeniare Research" description="Explore Ingeniare's free offline AI crack-tracing app for Android. View the workflow, download the research alpha, and help improve tools for Filipino engineers." path="/resources/crack-mapping" image="https://www.ingeniare-sec.com/crack-mapping/Traced_Crack_Photo.jpg" imageAlt="Ingeniare Crack Mapping — offline Android AI crack tracing" schema={[
      { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ingeniare", item: "https://www.ingeniare-sec.com/" },
        { "@type": "ListItem", position: 2, name: "Engineering resources", item: "https://www.ingeniare-sec.com/resources" },
        { "@type": "ListItem", position: 3, name: "Crack Mapping", item: "https://www.ingeniare-sec.com/resources/crack-mapping" },
      ] },
      { "@context": "https://schema.org", "@type": "SoftwareApplication", "@id": "https://www.ingeniare-sec.com/resources/crack-mapping#app", name: "Ingeniare Crack Mapping", url: "https://www.ingeniare-sec.com/resources/crack-mapping", operatingSystem: "Android 8.0 or later", applicationCategory: "UtilitiesApplication", softwareVersion: "0.5.0-ml-research", description: "Free research alpha for offline AI crack tracing. Does not estimate crack width. Engineer review is required.", screenshot: "https://www.ingeniare-sec.com/crack-mapping/Traced_Crack_Photo.jpg", image: "https://www.ingeniare-sec.com/crack-mapping/Traced_Crack_Photo.jpg", publisher: { "@id": "https://www.ingeniare-sec.com/#organization" }, offers: { "@type": "Offer", price: "0", priceCurrency: "PHP" } },
    ]} />
    <div className="crack-page">
      <header className="crack-hero"><div className="container">
        <Link className="crack-back" to="/resources">← All resources</Link>
        <p className="crack-eyebrow">FROM THE INGENIARE RESEARCH DEPARTMENT</p>
        <span className="crack-tag">RESEARCH NOTE / ALPHA RELEASE</span>
        <h1>Crack Mapping<br />for engineers.</h1>
        <p className="crack-deck">Meet Crack Mapping: an offline AI tool for tracing visible cracks on Android. Free for engineers. Built to keep improving with you.</p>
        <div className="crack-hero-actions"><a className="crack-button" href="#showcase"><FaPlay aria-hidden="true" /> See the app in action</a><a href="#get-the-app">Get the Android alpha <FaArrowRight aria-hidden="true" /></a><a href="#feedback">Help us improve it ↗</a></div>
        <div className="crack-facts"><span><FaAndroid aria-hidden="true" /> Android only</span><span>On-device AI · Works offline</span><span>Free alpha</span></div>
      </div></header>
      <AppShowcase />
      <div className="container crack-layout">
        <article className="crack-article">
          <section id="why"><p className="crack-eyebrow">01 / WHY WE BUILT IT</p><h2>From challenges in practice,<br />to tools for our community.</h2>
            <p>Filipino engineers face practical challenges every day. Our team has encountered many of them, too. At Ingeniare Research, those experiences push us to develop tools that help engineers in their work and share what we learn along the way.</p>
            <p>Crack Mapping is one of those efforts. We are opening this early Android app to engineers for free, and inviting you to help us verify how it performs. Your observations, questions, and suggestions will help shape what comes next.</p>
          </section>
          <section id="how"><p className="crack-eyebrow">02 / WHAT IT USES</p><h2>Local AI. No internet needed.</h2>
            <p>The app uses an AI model running locally on your Android device to trace visible cracks in images. The crack-tracing feature does not need an internet connection. This website’s signup, download, and feedback forms do require a connection.</p>
            <p>The supplied APK bundles an ONNX crack-segmentation model and ONNX Runtime libraries. It requires Android 8.0 or later. The current release focuses on tracing cracks; it does not estimate crack width. Although the interface shows width and calibration fields, those labels do not establish that automated measurement is available in this alpha. Training data and evaluation details have not been supplied.</p>
            <aside className="crack-note"><strong>61% reported model accuracy</strong><p>This is the current figure shared by the research team. The evaluation method, test dataset, and conditions have not yet been published here. It is an early result, not a guarantee for an individual image.</p></aside>
            <p>Please check every trace against the original image. This alpha does not determine structural safety or replace an engineer’s inspection, measurements, and professional judgment.</p>
          </section>
          <section id="verification"><p className="crack-eyebrow">03 / RELEASE TRANSPARENCY</p><h2><FaShieldAlt aria-hidden="true" /> Know what you are installing.</h2>
            <p>We inspected the supplied APK’s manifest and archive on October 28, 2026. This is a research alpha, and its manifest marks it as a debuggable build. The supplied filename says V1.0, while the internal version is <code>0.5.0-ml-research</code>.</p>
            <p>A Microsoft Defender scan was attempted but failed to run (error <code>0x80508023</code>). There is no completed malware scan or independent security audit to report. We cannot claim this APK is virus-free. The checksum below identifies this exact file; it is not a safety certification.</p>
            <div className="crack-verification"><span>Internal version / code</span><strong>0.5.0-ml-research / 5</strong><span>APK size</span><strong>248.5 MB (248,519,373 bytes)</strong><span>Minimum Android version</span><strong>Android 8.0 (API 26)</strong><span>Package</span><strong>com.ingeniare.app</strong><span>Build status</span><strong>Debuggable research alpha</strong><span>Malware scan</span><strong>Not completed</strong></div>
            <p className="crack-checksum"><strong>SHA-256</strong><br /><code>1cff179e03abfdb54eb853f2d9fbdabee8ba0f30ca0fe0eca37ee4393b180825</code></p>
            <details><summary>Declared permissions and scope of this review</summary><p>The manifest declares CAMERA, WAKE_LOCK, ACCESS_NETWORK_STATE, RECEIVE_BOOT_COMPLETED, FOREGROUND_SERVICE, and the app-specific DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. It does not declare INTERNET. Camera access supports image capture; the other permissions need developer review to confirm why they are included.</p><p>This was a static manifest and archive inspection. APK signing identity, runtime behavior, model accuracy, and device compatibility have not been independently verified.</p></details>
          </section>
          <section id="feedback"><p className="crack-eyebrow">04 / BUILD WITH US</p><h2>Your field experience matters.</h2><p>Help us verify the app. Tell us about missed cracks, incorrect traces, device issues, or features that would make your work easier. Feedback from Filipino engineers and the wider engineering community is welcome.</p><ResearchForm feedback /></section>
        </article>
        <aside className="crack-sidebar"><div className="crack-download" id="get-the-app"><span className="crack-tag">FREE / ANDROID ALPHA</span><h2>Try it. Question it.<br />Help improve it.</h2><p>Enter a valid email to activate the free download. Android 8.0+ · 248.5 MB.</p><p className="crack-fine">Debuggable research build · Malware scan not completed. <a href="#verification">Review the release details</a> before installing.</p><ResearchForm /><p className="crack-fine">Current scope: crack tracing only.<br />Crack-width estimation is not included.</p></div>
          <nav className="crack-toc" aria-label="In this research note"><strong>IN THIS NOTE</strong><a href="#why">Why we built it</a><a href="#how">Technology & limitations</a><a href="#showcase">App showcase</a><a href="#verification">Release transparency</a><a href="#feedback">Share your feedback</a></nav>
        </aside>
      </div>
    </div>
  </>;
}
