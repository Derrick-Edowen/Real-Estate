import React from "react";
import logor from '../../Assets/Images/logo.PNG'



function Pricing() {

    return (
      <div className="priceIt">
            <div className="logorbox">
        <img className="logor" src={logor} />
        </div>
        <div className="descTextJfc">Pricing and Subscriptions</div>
        <div className="descTexcp">Unlock the power of One Estate Web Services, your gateway to premium real estate websites for only <strong>$55 USD per month.</strong> Our subscription offers unparalleled value, providing you with fully customizable platforms designed to elevate your online presence and streamline your business operations. Whether you're a seasoned agent or just starting out, our intuitive tools and sleek designs ensure you stand out in a competitive market.</div>

        <div className="descTextJfc">Why choose us? With One Estate Web Services, you get:</div>

<div className="descTexc"> - <strong>Customizable Websites:</strong> Tailor your site to reflect your unique brand and style.</div>
<div className="descTexc"> - <strong>Responsive Design:</strong> Ensures your website looks great on any device, enhancing user experience.</div>
<div className="descTexc"> - <strong>SEO Optimization:</strong> Boost your visibility and attract more leads with optimized search engine performance.</div>
<div className="descTexc"> - <strong>Secure Hosting:</strong> Enjoy reliable hosting services to keep your website running smoothly.</div>
<div className="descTexc"> - <strong>Rapid Support:</strong> Access expert assistance whenever you need it, ensuring peace of mind.</div>
<div className="descTextJfc">Limited Time Promotion</div>

<div className="descTexc"> - But that's not all! For a limited time, use promo code "ONEESTATE24" and receive a generous 15% discount for the first 2 months of your subscription. This exclusive offer allows you to experience the full benefits of our services at an unbeatable price.</div>
<div className="descTextJfc">Getting Started</div>

<div className="descTexc">Ready to take your real estate business to new heights? Join One Estate Web Services today and start your journey towards success. Click the link below and begin your monthly subscription once approved by One Estate Web Services. Don't miss out on this opportunity to transform your online presence affordably and effectively!</div>

        <a
        className="descTexc"
    href="https://buy.stripe.com/4gw3ekg8HeBSfKwbII"
    target="_blank"
    rel="noopener noreferrer"
  >
    One Estate Web Services Subscription Link
  </a>
</div>
    )
}
export default Pricing;