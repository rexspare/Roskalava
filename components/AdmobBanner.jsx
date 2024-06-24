import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import React from "react";
import { admobConfig } from "../app/services/adMobConfig";
import { useStateValue } from "../StateProvider";
import { useState } from "react";

const AdmobBanner = ({ isAdLoaded = true, setisAdLoaded = () => { } }) => {
  const [{ ios }] = useStateValue();


  return (
    <BannerAd
      unitId={
        ios ? admobConfig.admobBannerId.iOS : admobConfig.admobBannerId.android
      }
      size={BannerAdSize.LARGE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdLoaded={() => setisAdLoaded(true)}
      onAdFailedToLoad={(err) => { console.log(JSON.stringify(err)); setisAdLoaded(false) }}
    />
  );
};

export default AdmobBanner;
