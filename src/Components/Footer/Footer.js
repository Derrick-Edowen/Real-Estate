import React, { useState, useEffect } from 'react';
import Logo from '../../Assets/Images/logo.PNG';

import './Index.css';

function Footer() {
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000); // 4 seconds delay

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
  };
  const handleOpenLightbox = () => {
    setLightboxOpen(true);
    setVisible(false);

    
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setVisible(true);

  };

  return (
    <div>
      <div className={`feet ${visible ? 'visible' : 'nope'}`} onClick={handleOpenLightbox}>
      <div className="transLate">
        NOTICE: This website is for sample purposes only. All rights to this content are reserved by One Estate Web Services. To setup
        your own personal website and increase your online presence, please contact One Estate Web Services at 
        oneestatewebservices@outlook.com to get started today! Click to learn more about what we offer!
        <span className="closef" onClick={handleClose}>×</span>
      </div>
    </div>

      {isLightboxOpen && (
        <div className="lightboxf" onClick={handleCloseLightbox}>
          <div className="lightbox-contentf" onClick={(e) => e.stopPropagation()}>
            <div className="closef" onClick={handleCloseLightbox}>×</div>
            <div className='inquiry'>
            <img className='Logo' src={Logo} alt="Logo"/>
            <h1>
              One Estate Web Services
            </h1>
            </div>
            <h2>What we do!</h2>
            <p>In today's fast-paced digital age, having a robust online presence
               is no longer a luxury but a necessity for every real estate agent. At One Estate Web 
               Services, we understand the unique needs of real estate professionals and offer
                bespoke website solutions tailored to showcase your expertise and listings. Our goal 
                is to help you stand out in the crowded real estate market, attract more clients, and provide 
                them with an exceptional browsing experience. By leveraging the latest technology and innovative designs, we create
                 websites that are not only visually stunning but also functional and user-friendly.</p>
            <h2>What we Offer!</h2>
            <p>One Estate Web Services is your one-stop solution for all your real estate website needs. Here’s a detailed look at what we offer:<br/><br/>

- Personalized Websites: Work closely with our team of expert web developers to create a website that is uniquely yours. We provide extensive customization options, allowing you to modify every aspect of your site, from text and images to layout and design. This level of personalization ensures that your website truly reflects your brand and meets your specific needs.<br/><br/>

- Domain Name Selection: A memorable domain name can make a significant difference in how easily clients can find you. We offer the option to select your own domain name, subject to availability, to help reinforce your brand identity and improve your online visibility.<br/><br/>

- Future-Proof Features: Technology evolves, and so do we. Our commitment to you includes ongoing updates and the addition of new functionalities at no extra cost. Future plans include the integration of AI chatbots for enhanced client interaction, additional calculators to aid in financial decision-making, and improved Zillow property searches. Stay ahead of the curve with a website that evolves with the times.<br/><br/>

- Announcement/Blog System: Engage directly with your audience through our innovative announcement system. This feature allows you to post updates, advertisements, and communications in a social media-like format directly on your website. Keep your clients informed and engaged with the latest news and developments.<br/><br/>

- Comprehensive Property Searches: Powered by Zillow, our property search functionality covers both the USA and Canada. Your clients can effortlessly find their dream homes using our intuitive and powerful search tools, ensuring a seamless and satisfying browsing experience.</p><br/>
            <h2>Why Choose Us?</h2>
            <p>Choosing One Estate Web Services means partnering with a company dedicated to your success. Here’s why we’re the best choice for your real estate website needs:<br/><br/>

- Affordable Pricing: At just $55 USD per month, our subscription cost is transparent and affordable. There are no hidden fees, additional charges, or service/sign-up fees. What you see is what you get – a fully-featured, professional website at a price that won’t break the bank.<br/><br/>

- Promotional Offers: Take advantage of our special promotions to get started at an even lower cost. Sign up with <strong>PROMO CODE: ONEESTATE2024</strong> and enjoy 35% off for the first two months. Plus, refer a colleague and receive an additional month free – a one-time offer that’s too good to pass up.<br/><br/>

- Complete Advertising Freedom: We believe in giving you the tools and freedom to succeed. You have complete rights to advertise your website as you see fit, ensuring your marketing efforts are fully under your control and tailored to your unique business needs.<br/><br/>

- Ongoing Support and Maintenance: Your website will never be outdated. Enjoy free updates, new features, and maintenance to keep your site running smoothly and efficiently. We handle the technical aspects so you can focus on what you do best – selling real estate.<br/><br/>

- No Hidden Fees: We value transparency and honesty. Our pricing is straightforward with no hidden costs or surprise charges. You can trust that your investment is well-spent on quality services without any unexpected expenses.</p><br/>
            <h2>Getting Started!</h2>
            <p>Ready to elevate your real estate business and enhance your online presence? Getting started with One Estate Web Services is simple and straightforward:<br/><br/>

1. Sign Up: Begin by sending us an email at oneestatewebservices@outlook.com so we can connect you with our professional web developers that will aid you in making your website your own. <br/><br/>

2. Customization: Collaborate with our skilled web developers to create a website that perfectly aligns with your brand. Customize every detail to ensure your site meets your specific needs and preferences.<br/><br/>
3. Launch and Advertise: Once your website is ready, launch it with your chosen domain name and start advertising. Use your new online platform to attract more clients and showcase your listings.<br/><br/>
4. Once your website is up, subscribe for continued service. Don’t forget to use <strong>PROMO CODE: ONEESTATE2024</strong> to enjoy 35% off for the first two months.<br/><br/>

- Referral Bonus: Spread the word and refer a colleague to One Estate Web Services. As a thank you, you’ll receive an additional month free – a fantastic way to share the benefits while gaining more from your subscription.<br/><br/>

- Stay Updated: Enjoy free future additions, updates, and maintenance, including exciting new features like AI chatbots, more calculators, and enhanced Zillow property searches. Your website will always be at the cutting edge of technology.<br/><br/>

At One Estate Web Services, we’re committed to helping you succeed in the digital world. Join us today and take the first step towards transforming your online presence and growing your real estate business!

</p>

          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
