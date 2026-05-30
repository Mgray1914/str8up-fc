export default function Footer() {
  return (
    <footer>
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4">
            {/* <!-- Logo --> */}
            <div className="w-full lg:w-3/12 md:w-full px-4 mb-6 lg:mb-0">
              <div className="mb-3">
                <img alt="footer-logo" src="/images/logo.svg" className="w-[200px]" />
              </div>
            </div>

            {/* <!-- Get in touch --> */}
            <div className="w-1/2 md:w-1/2 lg:w-3/12 px-4 mb-6 lg:mb-0">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-[20px] mb-4">Get in touch</h3>
                <ul className="space-y-3 text-white text-sm">
                  <li className="flex gap-3">
                    <img alt="location" src="/images/location.svg" />
                    <p>Miami, FL USA</p>
                  </li>
                  <li className="flex gap-3">
                    <img alt="sms" src="/images/sms.svg" />
                    <a href="#" className="hover:underline">Admin@str8upgaming.com</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* <!-- Support --> */}

            <div className="w-1/2 md:w-1/2 lg:w-3/12 px-4 mb-6 lg:mb-0 text-left flex justify-center">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-[20px] mb-4">Support</h3>
                <ul className="space-y-3 text-white text-sm">
                  <li><a href="#" className="hover:underline">Live Predictions</a></li>
                  <li><a href="/terms-condition" className="hover:underline">Terms &amp; Conditions</a></li>
                  <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
                </ul>
              </div>
            </div>


            {/* <!-- Social Media --> */}
            <div className="w-full lg:w-3/12 md:w-full px-4 flex justify-right">
              <div className="mb-3">
                <h3 className="text-white font-semibold text-[20px] mb-4">Social media Links</h3>
                <div className="flex gap-6">
                  <a href="#"><img alt="instagram" src="/images/instagram.svg" /></a>
                  <a href="#"><img alt="twitter" src="/images/twitter.svg" /></a>
                  <a href="#"><img alt="facebook" src="/images/facebook.svg" /></a>
                  <a href="#"><img alt="linkedin" src="/images/linkedin.svg" /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </footer>
  );
}