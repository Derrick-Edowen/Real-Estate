import React from "react";
import logor from '../../Assets/Images/logo.PNG'



function Privacy() {

    return (
        <div className="privacyIt">
            <div className="logorbox">
        <img className="logor" src={logor} />
        </div>                
        <div className="descTextJfc">Privacy Policy</div>
                <p className="descTexcp">At One Estate Web Services, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our website and services.</p>

<div className="descTextJfc">Information We Collect</div>

<p className="descTexcp">When you visit our website or use our services, we may collect the following types of information:</p>

<p className="descTexcp">- Personal Information: When you sign up for our services or contact us, we may collect personal information such as your name, email address, phone number, and other contact details.</p>
<p className="descTexcp">- Usage Information: We may collect information about how you interact with our website, such as the pages you visit, the links you click on, and the time and date of your visits.</p>
<p className="descTexcp">- Device Information: We may collect information about the device you use to access our website, such as your IP address, browser type, and operating system.</p>
<div className="descTextJfc">How We Use Your Information</div>

<p className="descTexcp">We may use the information we collect for the following purposes:</p>

<p className="descTexcp">- To provide and improve our services to you.<br/>
- To communicate with you about your account and our services.<br/>
- To analyze trends and improve the usability of our website.<br/>
- To comply with legal requirements.</p>
<div className="descTextJfc">Data Security</div>

<p className="descTexcp">We take the security of your information seriously and take measures to protect it from unauthorized access, disclosure, or alteration. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee its absolute security.</p>

<div className="descTextJfc">Changes to This Privacy Policy</div>

<p className="descTexcp">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

<div className="descTextJfc">Contact Us</div>

<p className="descTexcp">If you have any questions or concerns about our Privacy Policy, please contact us at <a href="mailto:oneestatewebservices@outlook.com" style={{color: 'black'}}>oneestatewebservices@outlook.com</a></p>
              </div>
    )
}
export default Privacy;