import { FC, useEffect } from "react";

(window as any).chatwootSettings = {
    hideMessageBubble: false,
    position: "right",
    locale: "en",
    type: "standard",
};

const ChatwootWidget: FC = () => {
    useEffect(() => {
        (function (d, t) {
            const BASE_URL = "https://app.chatwoot.com";
            const g = d.createElement(t) as unknown,
                s = d.getElementsByTagName(t)[0] as unknown;
            (g as any).src = BASE_URL + "/packs/js/sdk.js";
            (g as any).defer = true;
            (g as any).async = true;
            (s as any).parentNode.insertBefore(g, s);
            (g as any).onload = function () {
                (window as any).chatwootSDK.run({
                    websiteToken: "GHYRJ74VMc8ChFBQ5BRf2sJZ",
                    baseUrl: BASE_URL,
                });
            };
        })(document, "script");
    }, []);

    return null;
};


export default ChatwootWidget;
