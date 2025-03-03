import React, { useEffect, useState } from "react";
import '../../search.css'
import Contact from '../Contact/Contact';
import sampler from '../../Assets/Images/sampler.webp'


function Oakwood() {
    useEffect(() => {
        const initializeAds = () => {
          if (window.adsbygoogle) {
            window.adsbygoogle.loaded = true;
            for (let i = 0; i < 5; i++) {
              window.adsbygoogle.push({});
            }
          }
        };
        
        const timeoutId = setTimeout(initializeAds, 1000); // Push ads 1 second after page load
        return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount
      }, []);
    return (<>
<aside className="leftSidebar">
<ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '680px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="1124922245"></ins>
            </aside>
            <main className="investingIt">
            <div className="sam">

<div className="descTextJc">Oak Wood Properties</div>
<div className="descTextJc">Your Trusted Partner in Property Management & Investments</div>

<p className="descTexcp">At Oak Wood Properties, we specialize in helping investors build wealth through smart real estate investments while providing full-service property management solutions. Whether you're searching for the perfect investment property or need expert management for your existing assets, our team of certified, licensed realtors ensures a seamless and profitable experience.</p>

<div className="descTextJf">Why Work with a Licensed Realtor for Investment Properties?
</div>
<p className="descTexcp">Finding the right investment property requires more than just browsing listings—it takes deep market knowledge, sharp negotiation skills, and a strategic approach. At Oak Wood Properties, our licensed realtors bring expertise and insight that give investors a competitive edge.</p>


<div className="descTexc">Key Benefits of Working with Our Realtors:
</div>
<p className="descTexcp">✅ Market Knowledge & Investment Strategy – Our realtors have a thorough understanding of Ontario’s real estate market, allowing us to identify high-potential properties in prime locations. We analyze market trends, rental demand, and future growth potential to ensure your investment is sound.</p>

<p className="descTexcp">✅ Access to Exclusive Listings – Licensed realtors have access to off-market and exclusive listings that aren't available to the general public. This means more opportunities for you to find undervalued properties before they hit the mainstream market.</p>

<p className="descTexcp">✅ Accurate Property Valuation – We provide in-depth property analysis, including cash flow projections, cap rates, and return on investment (ROI) calculations. This helps investors make informed decisions based on real numbers.</p>

<p className="descTexcp">✅ Expert Negotiation & Due Diligence – Our realtors negotiate the best possible terms on your behalf, ensuring you get the highest value for your investment. We also conduct thorough due diligence to identify any potential risks before you commit.</p>

<p className="descTexcp">✅ Seamless Buying Process – From securing financing and handling paperwork to coordinating inspections and closing the deal, we make the buying process smooth and stress-free.</p>
<div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="8253269505"></ins>
                </div>
<div className="descTextJf">Comprehensive Property Management Services
</div>
<p className="descTexcp">Owning an investment property should be rewarding—not overwhelming. That’s why Oak Wood Properties offers full-service property management, handling every aspect of your rental property with professionalism and care.</p>



<div className="descTexc">Our Property Management Services Include:
</div>
<p className="descTexcp">🏡 Tenant Placement & Screening – Finding the right tenants is crucial for a successful investment. We conduct thorough background, credit, and rental history checks to ensure you get reliable, responsible tenants.</p>

<p className="descTexcp">💰 Rent Collection & Financial Reporting – We take care of rent collection, enforce lease terms, and provide detailed financial reports, so you always know how your property is performing.</p>

<p className="descTexcp">🔧 Maintenance & Repairs – From minor fixes to major repairs, our team ensures your property is well-maintained. We work with trusted contractors to keep costs low while maintaining high-quality standards.</p>
<p className="descTexcp">📜 Legal Compliance & Evictions – Ontario’s rental laws can be complex, but we ensure full compliance with local regulations. In the rare case of an eviction, we handle the legal process efficiently and professionally.</p>
<p className="descTexcp">📞 24/7 Emergency Support – We provide round-the-clock support for tenant emergencies, so you don’t have to worry about late-night repair calls.</p>
<p className="descTexcp">📊 Property Inspections & Value Optimization – Regular property inspections help prevent costly issues down the road. We also suggest upgrades and improvements to maximize rental income and property value.</p>

<div className="descTextJf">Why Choose Oak Wood Properties?
</div>
<p className="descTexcp">✅ Hands-Off Investing – We handle everything so you can enjoy passive income.
</p>

<p className="descTexcp">✅ Maximized Returns – Our strategies help you get the best ROI on your investment.
</p>

<p className="descTexcp">✅ Expert Guidance – With licensed professionals on your side, you make smarter investment choices.

</p>

<p className="descTexcp">At Oak Wood Properties, we’re committed to helping investors succeed while ensuring their properties are managed with excellence. Whether you need assistance finding the right investment or want a stress-free property management experience, we are here to help.</p>
<div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="6078532301"></ins>
                </div>
<div className="descTextJf">📞 Contact us today and let’s grow your real estate portfolio together!
</div>
<div className="adContainer">
                    <ins className="adsbygoogle"
                        style={{ display: 'block', width: '100%' }}
                        data-ad-layout="in-article"
                        data-ad-format="fluid"
                        data-ad-client="ca-pub-8295243074005821"
                        data-ad-slot="4141967824"></ins>
                </div>
                </div>
              </main>
              <aside className="rightSidebar">
              <ins className="adsbygoogle"
                    style={{ display: 'inline-block', width: '100%', height: '680px' }}
                    data-ad-client="ca-pub-8295243074005821"
                    data-ad-slot="6185677230"></ins>
            </aside>
              <Contact />

    </>)
}
export default Oakwood;