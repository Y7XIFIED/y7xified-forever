import { PromptingIsAllYouNeed } from "@/components/ui/animated-hero-section";
import Footer from "@/components/ui/animated-footer";

const DemoOne = () => {
  return (
    <div className="flex flex-col w-full">
      <PromptingIsAllYouNeed />
      <Footer
        leftLinks={[
          { href: "/terms", label: "Terms & policies" },
          { href: "/privacy-policy", label: "Privacy policy" },
        ]}
        rightLinks={[
          { href: "/about", label: "About Y7XIFIED" },
          { href: "https://x.com/y7xified", label: "Twitter" },
          { href: "https://www.instagram.com/y7xified", label: "Instagram" },
          { href: "https://github.com/y7xified", label: "GitHub" },
        ]}
        copyrightText="Y7XIFIED 2025."
        barCount={23}
      />
    </div>
  );
};

export { DemoOne };
export default DemoOne;
