var M = Object.defineProperty;
var x = (d, r, t) => r in d ? M(d, r, { enumerable: !0, configurable: !0, writable: !0, value: t }) : d[r] = t;
var s = (d, r, t) => (x(d, typeof r != "symbol" ? r + "" : r, t), t);
class S {
  constructor(r, t) {
    s(this, "accountId", null);
    s(this, "options", null);
    s(this, "handleMessage", (r) => {
      if (r.data)
        switch (r.data.type) {
          case "booking.close":
            this.close();
            break;
          case "booking.redirect":
            r.data.redirectUri && window.open(r.data.redirectUri, "_blank");
            break;
          case "booking.css":
            const t = r.data.height, e = document.getElementById("grabby-iframe");
            e && (e.style.height = `${t}px`);
            break;
        }
    });
    this.accountId = r, this.options = t;
  }
  buildUrl(r) {
    var b, g, w, I, P, v, U, o, k, C, E, G, L, A;
    const t = ((b = this.options) == null ? void 0 : b.accountId) || this.accountId;
    if (!t)
      throw new Error("Grabby: accountId is required. Call init(accountId) or pass it in options.");
    const e = `${((g = this.options) == null ? void 0 : g.url) || "https://app.begrabby.com"}/booking/${t}`, a = new URL(e);
    (r != null && r.compact || (w = this.options) != null && w.compact) && a.searchParams.append("compact", "true"), (r != null && r.hideFooter || (I = this.options) != null && I.hideFooter) && a.searchParams.append("hideFooter", "true");
    const c = (r == null ? void 0 : r.lang) || ((P = this.options) == null ? void 0 : P.lang);
    c && a.searchParams.append("lang", c);
    const l = (r == null ? void 0 : r.returnUrl) || ((v = this.options) == null ? void 0 : v.returnUrl);
    l && a.searchParams.append("returnUrl", l), ((r == null ? void 0 : r.isIframe) !== void 0 || ((U = this.options) == null ? void 0 : U.isIframe) !== void 0) && a.searchParams.append("isIframe", String((r == null ? void 0 : r.isIframe) || ((o = this.options) == null ? void 0 : o.isIframe))), r != null && r.productId && a.searchParams.append("productId", r.productId), r != null && r.visitDate && a.searchParams.append("visitDate", r.visitDate), r != null && r.eventId && a.searchParams.append("eventId", r.eventId), r != null && r.isGiftCardOpen && a.searchParams.append("isGiftCardOpen", "true"), r != null && r.preselectGiftCardAmount && a.searchParams.append("preselectGiftCardAmount", String(r.preselectGiftCardAmount));
    const i = (r == null ? void 0 : r.colorPrimary) || ((k = this.options) == null ? void 0 : k.colorPrimary);
    i && a.searchParams.append("colorPrimary", i);
    const h = (r == null ? void 0 : r.colorAccent) || ((C = this.options) == null ? void 0 : C.colorAccent);
    h && a.searchParams.append("colorAccent", h);
    const m = (r == null ? void 0 : r.color) || ((E = this.options) == null ? void 0 : E.color);
    m && a.searchParams.append("color", m);
    const u = (r == null ? void 0 : r.background) || ((G = this.options) == null ? void 0 : G.background);
    u && a.searchParams.append("background", u);
    const f = (r == null ? void 0 : r.bannerUrl) || ((L = this.options) == null ? void 0 : L.bannerUrl);
    f && a.searchParams.append("bannerUrl", f);
    const y = (r == null ? void 0 : r.logoUrl) || ((A = this.options) == null ? void 0 : A.logoUrl);
    return y && a.searchParams.append("logoUrl", y), a.toString();
  }
  render(r, t) {
    try {
      const e = this.buildUrl(t), a = document.createElement("iframe");
      a.src = e, a.style.border = "0", a.style.width = "100%", a.style.height = "100%", a.id = "grabby-iframe";
      let c = null;
      r && (c = document.querySelector(r)), c || (console.warn(`Grabby: Container with selector "${r}" not found. Appending to body.`), c = document.body), c.innerHTML = "", c.appendChild(a), this.attachListeners();
    } catch (e) {
      console.error(e);
    }
  }
  showModal(r) {
    try {
      const t = this.buildUrl(r), e = document.createElement("div");
      e.id = "grabby-modal-overlay", e.style.position = "fixed", e.style.top = "0", e.style.left = "0", e.style.width = "100vw", e.style.height = "100vh", e.style.backgroundColor = "rgba(0,0,0,0.5)", e.style.zIndex = "9999", e.style.display = "flex", e.style.justifyContent = "center", e.style.alignItems = "center";
      const a = document.createElement("div");
      a.style.width = "80%", a.style.height = "80%", a.style.backgroundColor = "white", a.style.overflow = "hidden", a.style.position = "relative";
      const c = document.createElement("iframe");
      c.src = t, c.style.border = "0", c.style.width = "100%", c.style.height = "100%", c.id = "grabby-iframe", a.appendChild(c), e.appendChild(a), document.body.appendChild(e), e.addEventListener("click", (l) => {
        l.target === e && this.close();
      }), this.attachListeners();
    } catch (t) {
      console.error(t);
    }
  }
  attachListeners() {
    window.removeEventListener("message", this.handleMessage), window.addEventListener("message", this.handleMessage);
  }
  close() {
    const r = document.getElementById("grabby-modal-overlay");
    r == null || r.remove(), window.removeEventListener("message", this.handleMessage);
  }
}
typeof window < "u" && (window.Grabby = S);
export {
  S as default
};
