!function() {
    window&&(window.___emSsrCtx= {
        airline: {
            code: "nk", name: "Spirit"
        }
        , product_scope: {
            name: "airTRFX", version: "2.0"
        }
        , datasource: {
            step: "home", variables: [-1], hostname: "spirit-dev.everymundo.com", pathname: "/en/flights", type: "default", url: "https://spirit-dev.everymundo.com/en/flights", referrer: ""
        }
        , audience: {
            browser: "Chrome 1+", device_category: "desktop", language: "en-US", city: -1, country: -1
        }
        , geo: {
            language: {
                lang: "en", site_edition: "en", site_edition_country_geo_id: null, separator: null, siteEditionLanguage: null, siteEditionMarket: null, languageBeforeMarket: !0, uppercaseLanguage: !1, uppercaseMarket: !1
            }
            , location: {
                user_input_origin_airport_code: -1, user_input_origin_city_name: -1, level_origin: -1, origin_geo_id: -1, user_input_origin_country_name: -1
            }
        }
        , modules:[ {
            id: "em-cmp-lib-bookings-flights__booking-flights--nk--nk", name: "Booking Flights"
        }
        , {
            id: "page_title_h1", name: "Page Title [H1] "
        }
        , {
            id: "breadcrumbs", name: "Breadcrumbs "
        }
        , {
            id: "em-cmp-lib-prices__fare-list--mosaic--carousel--nk", name: "FC Fare List Mosaic Carousel "
        }
        , {
            id: "em-cmp-lib-prices__fare-filter--list--nk", name: "FC Fare Filter List "
        }
        , {
            id: "campaign_id_5aeb21cc2c477e9201000006", name: "[Campaign] 20180502_EN_ES "
        }
        , {
            id: "campaign_id_59c3d454367475d542105e3b", name: "[Campaign] The Big Deal Campaign HOME "
        }
        , {
            id: "price_widget-59c147e73674757907105e38", name: "Pricing Widget: Home Pricing Widget "
        }
        , {
            id: "accordion_destinations", name: "Flights Hub "
        }
        , {
            id: "campaign_id_5a302eaf969debd902000007", name: "[Campaign] The Big Deal - AM "
        }
        , {
            id: "em-cmp-lib-bookings-flights__booking-flights-popup--nk--nk", name: "Booking Flights Popup"
        }
        ], extra_info: {
            airports: {
                origin: [], destination: []
            }
            , route: {
                status: ""
            }
        }
        , timestamp:1536345630999, ctx_version:"1.0"
    }
    );
    var e=document.createElement("div");
    e.setAttribute("data-em-module-id", "em-cmp-lib-prices"),
    e.setAttribute("data-em-version", "0.7.28"),
    e.setAttribute("data-em-cmp", "fare-list--mosaic--carousel"),
    e.setAttribute("data-em-model-source-type", "ajax"),
    e.setAttribute("data-em-styles", "https://bodaclick.github.io/em-theme-temp/themes/nk/index.isolated.nk.css"),
    t=document.createElement("div");
    t.setAttribute("data-em-module-id", "em-cmp-lib-bookings-flights"),
    t.setAttribute("data-em-version", "0.6.80"),
    t.setAttribute("data-em-cmp", "booking-flights-popup--nk"),
    t.setAttribute("data-em-model-source-type", "ajax"),
    t.setAttribute("data-em-styles", "default"),
    document.getElementById("em_deals_home").appendChild(e),
    document.getElementById("em_deals_home").appendChild(t)
}

(),
function() {
    var e=document.createElement("script");
    e.type="text/javascript",
    e.async=!0,
    e.src="https://em-frontend-assets-dev.airtrfx.com/components/em-cmp-loader/0.2.5/components/em-cmp-loader/loader.bundle.js";
    var t=document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(e, t)
}

();