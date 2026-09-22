import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#13241d] text-[#dce7e0]">
      <div className="mx-auto grid w-[92%] max-w-[1180px] gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand */}
        <div>
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-xs font-black text-[#17382c]">
              BN
            </div>

            <div>
              <div className="text-[17px] font-extrabold text-white">
                {siteConfig.name}
              </div>

              <span className="block text-[9px] font-semibold text-[#81958b]">
                {siteConfig.tagline}
              </span>
            </div>
          </Link>

          <p className="mt-4 max-w-xs text-[10px] leading-6 text-[#9eb0a5]">
            A community bookshelf where books stay in circulation and
            readers stay connected.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-3 text-[11px] font-extrabold text-white">
            Explore
          </h3>

          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block py-1 text-[10px] text-[#9eb0a5] transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Membership */}
        <div>
          <h3 className="mb-3 text-[11px] font-extrabold text-white">
            Membership
          </h3>

          <Link
            href="/signup"
            className="block py-1 text-[10px] text-[#9eb0a5] hover:text-white"
          >
            Request to Join
          </Link>

          <Link
            href="/signin"
            className="block py-1 text-[10px] text-[#9eb0a5] hover:text-white"
          >
            Sign In
          </Link>
        </div>

        {/* About */}
        <div>
          <h3 className="mb-3 text-[11px] font-extrabold text-white">
            BookNest
          </h3>

          <p className="text-[10px] leading-6 text-[#9eb0a5]">
            Public browsing is open to everyone. Approved members can
            borrow, lend, message, and manage their books.
          </p>
        </div>
      </div>

      <div className="mx-auto w-[92%] max-w-[1180px] border-t border-white/10 py-4 text-[9px] text-[#7f9589]">
        © {new Date().getFullYear()} BookNest. Share • Borrow • Read.
      </div>
    </footer>
  );
};

export default Footer;