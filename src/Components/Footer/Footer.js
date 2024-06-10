import React, { useState, useEffect } from 'react';
import Logo from '../../Assets/Images/logo.PNG';
import Code from '../../Assets/Images/QRCODE.png'
import './Index.css';

function Footer() {
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [lightboxContent, setLightboxContent] = useState(''); // Add state for lightbox content

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 2000); // 3 seconds delay

    return () => clearTimeout(timer); // Clean up the timer
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    setVisible(false);
  };

  const handleOpenLightbox = (content) => {
    setLightboxContent(content); // Set the content for the lightbox
    setLightboxOpen(true);
    setVisible(false);
  };

  const handleCloseLightbox = () => {
    setLightboxOpen(false);
    setVisible(true);
  };

  return (
    <div>
      <div className={`feet ${visible ? 'visible' : 'nope'}`} onClick={() => handleOpenLightbox('mission')}>
        <div className="transLate">
          NOTICE: This website is for sample purposes only. All rights to this content are reserved by One Estate Web Services. To setup
          your own personal website and increase your online presence, please contact One Estate Web Services at 
          oneestatewebservices@outlook.com to get started today! Click to learn more about what we offer!
          <span className="closeg" onClick={handleClose}>×</span>
        </div>
      </div>

      {isLightboxOpen && (
        <div className="lightboxf" onClick={handleCloseLightbox}>
          <div className="lightbox-contentf" onClick={(e) => e.stopPropagation()}>
            <div className="closef" onClick={handleCloseLightbox}>×</div>
            <div className='inquiry'>
              <img className='Logo' src={Logo} alt="Logo"/>
            </div>
            {lightboxContent === 'mission' && (
              <>
                <h2>Our Mission!</h2>
                <p>In today's fast-paced digital age, having a robust online presence is no longer a luxury but a necessity for every real estate agent. At One Estate Web Services, we understand the unique needs of real estate professionals and offer bespoke website solutions tailored to showcase your expertise and listings. Our goal is to help you stand out in the crowded real estate market, attract more clients, and provide them with an exceptional browsing experience. By leveraging the latest technology and innovative designs, we create websites that are not only visually stunning but also functional and user-friendly.</p>
                <h2>What We Offer!</h2>
                <p>One Estate Web Services is your one-stop solution for all your real estate website needs. Here’s a detailed look at what we offer:<br/><br/>
                <strong>- Personalized Websites:</strong> Work closely with our team of expert web developers to create a website that is uniquely yours. We provide extensive customization options, allowing you to modify every aspect of your site, from text and images to layout and design. This level of personalization ensures that your website truly reflects your brand and meets your specific needs. Changes to  your website can be made any time, free of charge.<br/><br/>
                <strong>- Domain Name Selection:</strong> A memorable domain name can make a significant difference in how easily clients can find you. We offer the option to select your own domain name, subject to availability, to help reinforce your brand identity and improve your online visibility.<br/><br/>
                <strong>- Future-Proof Features:</strong> Technology evolves, and so do we. Our commitment to you includes ongoing updates and the addition of new functionalities at no extra cost. Future plans include the integration of AI chatbots for enhanced client interaction, additional calculators to aid in financial decision-making, and improved Zillow property searches. Stay ahead of the curve with a website that evolves with the times.<br/><br/>
                <strong>- Announcement/Blog System:</strong> Engage directly with your audience through our innovative announcement system. This feature allows you to post updates, advertisements, and communications in a social media-like format directly on your website. Keep your clients informed and engaged with the latest news and developments.<br/><br/>
                <strong>- Comprehensive Property Searches:</strong> Powered by Zillow, our property search functionality covers both the USA and Canada. Your clients can effortlessly find their dream homes using our intuitive and powerful search tools, ensuring a seamless and satisfying browsing experience.</p><br/>
                <h2>Why Choose One Estate Web Services?</h2>
                <p>Choosing One Estate Web Services means partnering with a company dedicated to your success. Here’s why we’re the best choice for your real estate website needs:<br/><br/>
                <strong>- Affordable Pricing:</strong> At just <strong>$55 USD</strong> per month, our subscription cost is transparent and affordable. There are no hidden fees, additional charges, or service/sign-up fees. What you see is what you get – a fully-featured, professional website at a price that won’t break the bank.<br/><br/>
                <strong>- Promotional Offers:</strong> Take advantage of our special promotions to get started at an even lower cost. Sign up with <strong>PROMO CODE: ONEESTATE2024</strong> and enjoy 35% off for the first two months. Plus, refer a colleague and receive your last month free – a one-time offer that’s too good to pass up.<br/><br/>
                <strong>- Advertising Freedom:</strong> We believe in giving you the tools and freedom to succeed. You have complete rights to advertise your website as you see fit, ensuring your marketing efforts are fully under your control and tailored to your unique business needs.<br/><br/>
                <strong>- Ongoing Support and Maintenance:</strong> Your website will never be outdated. Enjoy free updates, new features, and maintenance to keep your site running smoothly and efficiently. We handle the technical aspects so you can focus on what you do best – selling real estate.<br/><br/>
                <strong>- No Hidden Fees:</strong> We value transparency and honesty. Our pricing is straightforward with no hidden costs or surprise charges. You can trust that your investment is well-spent on quality services without any unexpected expenses.</p><br/>
                <h2>Getting Started!</h2>
                <p>Ready to elevate your real estate business and enhance your online presence? Getting started with One Estate Web Services is simple and straightforward:<br/><br/>
                <strong>1. Sign Up:</strong> Begin by sending us an email at <a href="mailto:oneestatewebservices@outlook.com" style={{color: 'black'}}>oneestatewebservices@outlook.com</a> so we can connect you with one of our professional web developers that will create your personal website.  <br/><br/>
                <strong>2. Customization:</strong> Collaborate with our skilled web developers to create a website that perfectly aligns with your brand. Customize every detail to ensure your site meets your specific needs and preferences.<br/><br/>
                <strong>3. Launch and Advertise:</strong> Once your website is ready, launch it with your chosen domain name and start advertising. Use your new online platform to attract more clients and showcase your listings.<br/><br/>
                <strong>4. Subscribe:</strong> Once your website is up, subscribe for continued service. Don’t forget to use <strong>PROMO CODE: ONEESTATE2024</strong> to enjoy 35% off for the first two months.<br/><br/>
                <strong>- Referral Bonus:</strong> Spread the word and refer a colleague to One Estate Web Services. As a thank you, you’ll receive your last month free – a fantastic way to share the benefits while gaining more from your subscription.<br/><br/>
                <strong>- Stay Updated:</strong> Enjoy free future additions, updates, and maintenance, including exciting new features like AI chatbots, more calculators, and enhanced Zillow property searches. Your website will always be at the cutting edge of technology.<br/><br/>
                At One Estate Web Services, we’re committed to helping you succeed in the digital world. Join us today and take the first step towards transforming your online presence and growing your real estate business!</p>
              </>
            )}
            {lightboxContent === 'privacy' && (
              <>
                <h2>Privacy Policy</h2>
                <p>At One Estate Web Services, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our website and services.</p>

<h2>Information We Collect</h2>

<p>When you visit our website or use our services, we may collect the following types of information:</p>

<p>Personal Information: When you sign up for our services or contact us, we may collect personal information such as your name, email address, phone number, and other contact details.</p>
<p>Usage Information: We may collect information about how you interact with our website, such as the pages you visit, the links you click on, and the time and date of your visits.</p>
<p>Device Information: We may collect information about the device you use to access our website, such as your IP address, browser type, and operating system.</p>
<p>How We Use Your Information</p>

<p>We may use the information we collect for the following purposes:</p>

<p>To provide and improve our services to you.
To communicate with you about your account and our services.
To analyze trends and improve the usability of our website.
To comply with legal requirements and protect our rights.</p>
<h2>Data Security</h2>

<p>We take the security of your information seriously and take measures to protect it from unauthorized access, disclosure, or alteration. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.</p>

<h2>Changes to This Privacy Policy</h2>

<p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

<h2>Contact Us</h2>

<p>If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:oneestatewebservices@outlook.com" style={{color: 'black'}}>oneestatewebservices@outlook.com</a></p>
              </>
            )}
            {lightboxContent === 'terms' && (
              <>
                <h2>Terms of Service</h2>
                <h2>1. Acceptance of Terms</h2>

<p>By accessing or using the services provided by One Estate Web Services, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use our services.</p>

<h2>2. Description of Services</h2>

<p>One Estate Web Services provides website design and development services tailored to real estate professionals. We strive to create visually stunning and user-friendly websites to help our clients showcase their expertise and listings.</p>

<h2>3. Payment Terms</h2>

<p>Payment for our services is due as per the terms agreed upon in the contract between One Estate Web Services and the client. Failure to make payment may result in the suspension or termination of services.</p>

<h2>4. Intellectual Property</h2>

<p>All content and designs created by One Estate Web Services are the intellectual property of One Estate Web Services unless otherwise agreed upon in writing. Clients are granted a license to use the content and designs for their own personal or business use only.</p>

<h2>5. Limitation of Liability</h2>

<p>One Estate Web Services shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of our services.</p>

<h2>6. Governing Law</h2>

<p>These Terms of Service shall be governed by and construed in accordance with local laws, without regard to its conflict of law provisions.</p>

<h2>7. Changes to Terms</h2>

<p>One Estate Web Services reserves the right to update or change these Terms of Service at any time. Your continued use of the services after any such changes constitutes your acceptance of the new Terms of Service.</p>

<h2>8. Advertisement Placement</h2>

<p>One Estate Web Services reserves the right to place topic-related advertisements on client websites. These advertisements will be selected and placed at the sole discretion of One Estate Web Services and may include but are not limited to, banner ads, text links, and sponsored content. Clients will not receive any compensation for the placement of these advertisements.</p>

<h2>9. Acceptable Use</h2>

<p>Clients agree not to use our services to display or promote any illegal, unethical, or objectionable content. One Estate Web Services reserves the right to remove any content that violates this provision or is deemed inappropriate at our sole discretion.</p>

<h2>10. Termination of Services</h2>

<p>One Estate Web Services reserves the right to suspend or terminate services to clients who violate these Terms of Service or engage in any conduct that we deem harmful or disruptive to our business or other clients.</p>

<h2>11. Contact Us</h2>
<p>If you have any questions or concerns about our Terms of Service, please contact us at <a href="mailto:oneestatewebservices@outlook.com" style={{color: 'black'}}>oneestatewebservices@outlook.com</a></p>
              </>
            )}
            <span onClick={() => handleOpenLightbox('mission')}>&copy;One Estate Web Services, 2024</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span onClick={() => handleOpenLightbox('privacy')}>Privacy Policy</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <span onClick={() => handleOpenLightbox('terms')}>Terms of Service</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Footer;
